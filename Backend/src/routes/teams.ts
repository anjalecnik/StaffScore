import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  orderBy,
  startAt,
  endAt,
  DocumentData,
  Query,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";

const router = Router();

export interface ITeamStatistic {
  evaluation: number;
  user: string;
}

/** GET all teams */
router.get("/", async (req, res) => {
  try {
    const { _sort, _order, q } = req.query;

    const order = (_order as string) === "DESC" ? "desc" : "asc";
    let sortField = typeof _sort === "string" ? _sort : "lastModified";
    const queryText = (q as string) ? q : "";

    if (sortField === "id") sortField = "lastModified";

    let qu: Query<DocumentData, DocumentData>;
    if (queryText === "") {
      qu = query(collection(db, "teams"), orderBy(sortField));
    } else {
      qu = query(
        collection(db, "teams"),
        orderBy(sortField),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
    }

    const teamsSnapshot = await getDocs(qu);

    const statisticsSnapshot = await getDocs(collection(db, "statistics"));

    const statistics: ITeamStatistic[] = statisticsSnapshot.docs.map((doc) => ({
      id: doc.id,
      evaluation: doc.data().evaluation,
      user: doc.data().user.id,
    }));

    const teams = teamsSnapshot.docs.map((doc) => {
      const teamData = doc.data();

      let memberIds = [];
      if (teamData.members) {
        memberIds = teamData.members.map(
          (memberRef: DocumentReference) => memberRef.id
        );
      }

      return {
        id: doc.id,
        ...teamData,
        memberIds: memberIds,
      };
    });

    const teamsWithAverageEvaluation = teams.map((team) => {
      const memberStatistics = statistics.filter((stat) =>
        team.memberIds.includes(stat.user)
      );

      const totalEvaluation = memberStatistics.reduce(
        (acc, curr) => acc + curr.evaluation,
        0
      );
      const averageEvaluation =
        memberStatistics.length > 0
          ? totalEvaluation / memberStatistics.length
          : 0;

      return {
        ...team,
        averageEvaluation: Math.round(averageEvaluation * 5 * 100) / 100,
      };
    });

    const ascDescTeams =
      order === "desc"
        ? teamsWithAverageEvaluation.reverse()
        : teamsWithAverageEvaluation;

    res.setHeader("X-Total-Count", ascDescTeams.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: ascDescTeams,
      total: ascDescTeams.length,
    });
  } catch (error) {
    console.error("Error getting teams", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export interface IUser {
  displayName: string;
  email: string;
  address: string;
  city: string;
  zipcode: string;
  photoUrl: string;
  phoneNumber: string;
}

export interface IStatistic {
  date: Timestamp;
  evaluation: number;
  questionnaireId: number;
}

interface Statistic {
  date: Timestamp;
  [user: string]: number | Timestamp;
}

interface AggregatedStatistic {
  name: string;
  [user: string]: number | string;
}

/** GET by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const teamDoc = querySnapshot.docs[0];
      const teamData = teamDoc.data();

      let allStatistics: Statistic[] = [];
      if (teamData.members && Array.isArray(teamData.members)) {
        const teamPromises = teamData.members.map(async (memberRef) => {
          const trimmedMemberId = memberRef.id.trim();
          const trimmedMemberRef = doc(db, "users", trimmedMemberId);

          const memberSnap = await getDoc(trimmedMemberRef);
          if (memberSnap.exists()) {
            const memberData = memberSnap.data() as IUser;

            const statisticsQuery = query(
              collection(db, "statistics"),
              where("user", "==", trimmedMemberRef)
            );
            const statisticsSnapshot = await getDocs(statisticsQuery);

            const statistics: IStatistic[] = statisticsSnapshot.docs.map(
              (doc) => ({
                id: doc.id,
                evaluation: doc.data().evaluation,
                questionnaireId: doc.data().questionnaire.id,
                date: doc.data().timestamp,
              })
            );

            statistics.forEach((stat) => {
              allStatistics.push({
                date: stat.date,
                [memberData.displayName]: stat.evaluation,
              });
            });

            return { id: memberSnap.id, ...memberData };
          } else {
            console.log(`No user (member) found with the id: ${memberRef.id}`);
            return null;
          }
        });

        const membersArray = (await Promise.all(teamPromises)).filter(
          (member) => member !== null
        );

        teamData.members = membersArray;

        // Map statistics data into correct form
        const groupByQuarter = (date: Date) => {
          const year = date.getFullYear();
          const month = date.getMonth();
          const quarter = Math.floor(month / 3) + 1;
          return `${year}-Q${quarter}`;
        };

        const aggregateStatistics = (
          allStatistics: Statistic[]
        ): AggregatedStatistic[] => {
          const aggregated: {
            [quarter: string]: {
              [user: string]: { sum: number; count: number };
            };
          } = {};

          allStatistics.forEach((stat) => {
            const date = stat.date.toDate();
            const quarter = groupByQuarter(date);

            if (!aggregated[quarter]) {
              aggregated[quarter] = {};
            }

            Object.keys(stat).forEach((key) => {
              if (key !== "date") {
                if (!aggregated[quarter][key]) {
                  aggregated[quarter][key] = { sum: 0, count: 0 };
                }
                aggregated[quarter][key].sum +=
                  Math.round((stat[key] as number) * 100) / 100;
                aggregated[quarter][key].count++;
              }
            });
          });

          // Fill missing user data with default values
          const allUsers = new Set<string>();
          allStatistics.forEach((stat) => {
            Object.keys(stat).forEach((key) => {
              if (key !== "date") {
                allUsers.add(key);
              }
            });
          });

          Array.from(allUsers).forEach((user) => {
            for (const quarter in aggregated) {
              if (!aggregated[quarter][user]) {
                aggregated[quarter][user] = { sum: 0, count: 0 };
              }
            }
          });

          const formattedAggregated: AggregatedStatistic[] = [];

          for (const quarter in aggregated) {
            const aggregatedQuarter = aggregated[quarter];
            const averageAggregatedQuarter: AggregatedStatistic = {
              name: quarter,
            };

            for (const user in aggregatedQuarter) {
              const { sum, count } = aggregatedQuarter[user];
              averageAggregatedQuarter[user] =
                Math.round((sum / count) * 100) / 100;
            }

            formattedAggregated.push(averageAggregatedQuarter);
          }

          const sortQuarterName = (quarterName: string): number => {
            const parts = quarterName.split("-Q");
            const year = parseInt(parts[0], 10);
            const quarter = parseInt(parts[1], 10);
            return year * 10 + quarter;
          };

          return formattedAggregated.sort((a, b) => {
            const dateA = sortQuarterName(a.name);
            const dateB = sortQuarterName(b.name);
            return dateA - dateB;
          });
        };

        teamData.statistics = aggregateStatistics(allStatistics);
      }

      if (teamData.teamLeader) {
        const trimmedLeaderId = teamData.teamLeader.id.trim();
        const trimmedLeaderRef = doc(db, "users", trimmedLeaderId);

        const leaderSnap = await getDoc(trimmedLeaderRef);
        if (leaderSnap.exists()) {
          const leaderData = leaderSnap.data() as IUser;
          teamData.teamLeader = { id: leaderSnap.id, ...leaderData };
        } else {
          console.log(
            `No user (leader) found with the id: ${teamData.teamLeader.id}`
          );
          return null;
        }
      }

      const formattedTeam: {
        id: string;
        teamLeader?: IUser;
        teamLeader_id?: string;
        members?: IUser[];
        members_ids?: string[];
        allStatistics?: any[];
        [key: string]: any;
      } = {
        id: teamDoc.id,
        ...teamData,
      };

      if (teamData.teamLeader) {
        formattedTeam.teamLeader_id = teamData.teamLeader.id.trim();
      }

      if (teamData.members && Array.isArray(teamData.members)) {
        formattedTeam.members_ids = teamData.members.map((member: any) =>
          member.id.trim()
        );
      }

      res.json(formattedTeam);
    } else {
      res.status(404).json({ message: "No team found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting team by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** CREATE new team */
router.post("/", async (req, res) => {
  const { teamLeader_id, members_ids, ...otherAttributes } = req.body;

  try {
    const newTeamRef = await addDoc(collection(db, "teams"), {
      teamLeader: doc(db, "users", teamLeader_id),
      members: members_ids.map((id: string) => doc(db, "users", id)),
      lastModified: serverTimestamp(),
      ...otherAttributes,
    });

    const updatePromises = members_ids.map(async (id: string) => {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        teams: arrayUnion(newTeamRef),
      });
    });

    await Promise.all(updatePromises);

    const newTeamDoc = await getDoc(newTeamRef);
    const newTeam = newTeamDoc.data();

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** UPDATE team */
router.put("/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const { name, description, teamLeader_id, members_ids } = req.body;

  try {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);

    if (!teamDocSnapshot.exists()) {
      return res.status(404).json({ error: "Team not found" });
    }

    const updateData: { [key: string]: any } = {
      lastModified: serverTimestamp(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (teamLeader_id !== undefined)
      updateData.teamLeader = doc(db, "users", teamLeader_id);
    if (members_ids !== undefined)
      updateData.members = members_ids.map((id: string) =>
        doc(db, "users", id)
      );

    await updateDoc(teamDocRef, updateData);

    const updatePromises = members_ids.map(async (id: string) => {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        teams: arrayUnion(teamDocRef),
      });
    });

    await Promise.all(updatePromises);

    const updatedTeamDocSnapshot = await getDoc(teamDocRef);
    let updatedTeamData = updatedTeamDocSnapshot.data();

    if (updatedTeamData) updatedTeamData.id = teamId;

    return res.status(200).json(updatedTeamData);
  } catch (error) {
    console.error("Error updating team:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/** DELETE team */
router.delete("/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);

    if (!teamDocSnapshot.exists()) {
      return res.status(404).json({ error: "Team not found" });
    }

    await deleteDoc(teamDocRef);

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
