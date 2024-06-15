import { Router } from "express";
import { db, storage } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  startAt,
  endAt,
  Query,
  DocumentData,
} from "firebase/firestore";
import { sendMail } from "../config/mailService";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const router = Router();

/** GET all users */
router.get("/", async (req, res) => {
  try {
    const { _limit, _page, _sort, _order, q } = req.query;

    const end =
      parseInt(_limit as string, 10) * parseInt(_page as string, 10) || 10;
    let start =
      (parseInt(_page as string, 10) - 1) * parseInt(_limit as string, 10) || 0;
    const order = (_order as string) === "DESC" ? "desc" : "asc";
    let sortField = typeof _sort === "string" ? _sort : "lastModified";
    const queryText = (q as string) ? q : "";

    if (sortField === "id") sortField = "lastModified";

    if (parseInt(_page as string, 10) == 1) {
      start = 0;
    }

    let qu: Query<DocumentData, DocumentData>;
    if (queryText === "") {
      qu = query(collection(db, "users"), orderBy(sortField));
    } else {
      qu = query(
        collection(db, "users"),
        orderBy(sortField),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
    }

    const usersSnapshot = await getDocs(qu);

    let formattedUsers = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const ascDescUsers =
      order === "desc" ? formattedUsers.reverse() : formattedUsers;

    const filteredUsers = ascDescUsers.slice(start, end);

    const totalRecords = usersSnapshot.size;

    res.setHeader("X-Total-Count", totalRecords.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: filteredUsers,
      total: totalRecords,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

interface ITag {
  name: string;
  color: string;
}

interface IStatistic {
  date: Date;
  name: string;
  evaluation: number;
  questionnaireId: number;
}

interface IQuarterlyStatistic {
  name: string;
  avgEv: number;
  [key: string]: number | string;
}

/** GET by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const storageRef = ref(storage, `users/${id}/evaluations`);
      const listResult = await listAll(storageRef);

      const pdfUrls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url,
          };
        })
      );

      userData.pdfs = pdfUrls;

      const statisticsSnapshot = await getDocs(
        query(
          collection(db, "statistics"),
          where("user", "==", doc(db, "users", id))
        )
      );

      const statistics: IStatistic[] = statisticsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name:
          doc.data().timestamp.toDate().getFullYear() +
          "-" +
          (doc.data().timestamp.toDate().getMonth() + 1),
        evaluation: doc.data().evaluation,
        questionnaireId: doc.data().questionnaire.id,
        date: doc.data().timestamp.toDate(),
      }));

      const allQuestionnaireIds = Array.from(
        new Set(statistics.map((stat) => stat.questionnaireId))
      );

      const groupedByQuarter = statistics.reduce(
        (acc: { [key: string]: IStatistic[] }, stat: IStatistic) => {
          const quarterName = getQuarterName(stat.date);
          if (!acc[quarterName]) {
            acc[quarterName] = [];
          }
          acc[quarterName].push(stat);
          return acc;
        },
        {}
      );

      const result: IQuarterlyStatistic[] = Object.keys(groupedByQuarter).map(
        (quarter) => {
          const stats = groupedByQuarter[quarter];
          const totalEvaluation = stats.reduce(
            (sum, stat) => sum + stat.evaluation,
            0
          );
          const avgEv =
            Math.round((totalEvaluation / stats.length) * 100) / 100;

          const questionnaireAvg = stats.reduce(
            (acc: { [key: string]: number[] }, stat) => {
              if (!acc[stat.questionnaireId]) {
                acc[stat.questionnaireId] = [];
              }
              acc[stat.questionnaireId].push(stat.evaluation);
              return acc;
            },
            {}
          );

          const questionnaireAvgResult = allQuestionnaireIds.reduce(
            (acc: { [key: string]: number | null }, qId) => {
              if (questionnaireAvg[qId]) {
                const total = questionnaireAvg[qId].reduce(
                  (sum, evaluation) => sum + evaluation,
                  0
                );
                acc[qId] =
                  Math.round((total / questionnaireAvg[qId].length) * 100) /
                  100;
              } else {
                acc[qId] = null;
              }
              return acc;
            },
            {}
          );

          return {
            name: quarter,
            avgEv,
            ...questionnaireAvgResult,
          };
        }
      );

      result.sort((a, b) => a.name.localeCompare(b.name));

      userData.statistics = result;

      const totalEvaluation = statistics.reduce(
        (acc, statistic) => acc + statistic.evaluation,
        0
      );
      const averageEvaluation = totalEvaluation / statistics.length;

      userData.averageEvaluation = averageEvaluation * 5;

      if (userData.tags && Array.isArray(userData.tags)) {
        const tagPromises = userData.tags.map(async (tagRef) => {
          const trimmedTagId = tagRef.id.trim(); // Trim any leading or trailing spaces from the tag ID
          const trimmedTagRef = doc(db, "tags", trimmedTagId);

          const tagSnap = await getDoc(trimmedTagRef);
          if (tagSnap.exists()) {
            const tagData = tagSnap.data() as ITag;
            return { id: tagSnap.id, ...tagData };
          } else {
            console.log(`No tag found with the id: ${tagRef.id}`);
            return null;
          }
        });

        const tagsArray = (await Promise.all(tagPromises)).filter(
          (tag) => tag !== null
        );

        userData.tags = tagsArray;

        let formattedUser: {
          id: string;
          tags?: ITag[];
          tags_ids?: string[];
          statistics?: any[];
          averageEvaluation?: number;
          pdfs?: { name: string; url: string };
          [key: string]: any;
        } = {
          id: userDoc.id,
          ...userData,
        };

        if (userData.teams && Array.isArray(userData.teams)) {
          const uniqueTeamIds: string[] = [];
          const filteredTeams = userData.teams.filter((teamRef) => {
            const trimmedTeamId = teamRef.id.trim();
            if (!uniqueTeamIds.includes(trimmedTeamId)) {
              uniqueTeamIds.push(trimmedTeamId);
              return true;
            }
            return false;
          });

          const teamPromises = filteredTeams.map(async (teamRef) => {
            const trimmedTeamId = teamRef.id.trim();
            const trimmedTeamRef = doc(db, "teams", trimmedTeamId);

            const teamSnap = await getDoc(trimmedTeamRef);
            if (teamSnap.exists()) {
              const teamData = teamSnap.data() as ITag;
              return { id: teamSnap.id, ...teamData };
            } else {
              console.log(`No team found with the id: ${teamRef.id}`);
              return null;
            }
          });

          const teamsArray = (await Promise.all(teamPromises)).filter(
            (team) => team !== null
          );

          userData.teams = teamsArray;

          formattedUser = {
            id: userDoc.id,
            ...userData,
          };
        }

        formattedUser.tags_ids = userData.tags.map((tag: any) => tag.id.trim());

        res.json(formattedUser);
      } else {
        let formattedUser = {
          id: userDoc.id,
          ...userData,
        };

        if (userData.teams && Array.isArray(userData.teams)) {
          const teamPromises = userData.teams.map(async (teamRef) => {
            const trimmedTeamId = teamRef.id.trim();
            const trimmedTeamRef = doc(db, "teams", trimmedTeamId);

            const teamSnap = await getDoc(trimmedTeamRef);
            if (teamSnap.exists()) {
              const teamData = teamSnap.data() as ITag;
              return { id: teamSnap.id, ...teamData };
            } else {
              console.log(`No team found with the id: ${teamRef.id}`);
              return null;
            }
          });

          const teamsArray = (await Promise.all(teamPromises)).filter(
            (team) => team !== null
          );

          userData.teams = teamsArray;

          formattedUser = {
            id: userDoc.id,
            ...userData,
          };
        }

        res.json(formattedUser);
      }
    } else {
      res.status(404).json({ message: "No user found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function getQuarterName(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return `${year}-Q${quarter}`;
}

/** CREATE new user */
router.post("/", async (req, res) => {
  const { email, tags_ids, roles, ...otherAttributes } = req.body;

  try {
    // Check if a user with the given email already exists
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUserRef = await addDoc(collection(db, "users"), {
      email: email,
      tags: tags_ids ? tags_ids.map((id: string) => doc(db, "tags", id)) : [],
      roles: roles ? roles : [],
      lastModified: serverTimestamp(),
      ...otherAttributes,
    });

    const newUserDoc = await getDoc(newUserRef);
    const newUser = newUserDoc.data();

    await sendWelcomeEmail(email);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** CREATE new user --> send email */
async function sendWelcomeEmail(userEmail: string) {
  const from: string = process.env.MAIL_USERNAME
    ? process.env.MAIL_USERNAME
    : "";
  const to: string = userEmail;
  const subject: string = "Welcome to StaffScore!";
  const mailTemplate: string = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to StaffScore</title>
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Welcome to StaffScore!</h1>
              <p>We are excited to have you on board!</p>
              <p>If you have any questions or need assistance, feel free to contact us.</p>
              <p>Thank you!</p>

              <a href="https://staff-score-frontend.vercel.app/" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to StaffScore</a>
          </div>
      </body>
      </html>
      `;

  await sendMail(from, to, subject, mailTemplate);
}

/** UPDATE user */
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { tags, tags_ids, roles, ...userDataToUpdate } = req.body; // Don't update tags!!

  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData: { [key: string]: any } = {
      ...userDataToUpdate,
      lastModified: serverTimestamp(),
    };

    if (roles !== undefined) {
      updateData.roles = roles;
    }

    if (tags_ids !== undefined)
      updateData.tags = tags_ids.map((id: string) => doc(db, "tags", id));

    await updateDoc(userDocRef, updateData);

    const updatedUserDocSnapshot = await getDoc(userDocRef);
    const updatedUserData = updatedUserDocSnapshot.data();

    res.status(200).json(updatedUserData);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** DELETE user */
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteDoc(userDocRef);

    res.status(200).json([]);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
