import { Router } from "express";
import { db } from "../config/firebase";
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
} from "firebase/firestore";
import { sendMail } from "../config/mailService";

const router = Router();

/** GET all users */
router.get("/", async (req, res) => {
  try {
    const { _limit, _page, _sort, _order } = req.query;

    const end =
      parseInt(_limit as string, 10) * parseInt(_page as string, 10) || 10;
    let start =
      (parseInt(_page as string, 10) - 1) * parseInt(_limit as string, 10) || 0;
    const order = (_order as string) === "DESC" ? "asc" : "asc"; // TODO: enable filtering by desc (https://www.reddit.com/r/Firebase/comments/16p5a4d/pagination_with_sorting_and_filtering/)
    let sortField = typeof _sort === "string" ? _sort : "lastModified";

    if (parseInt(_page as string, 10) == 1) {
      start = 0;
    }

    const usersSnapshot = await getDocs(
      query(collection(db, "users"), orderBy(sortField, order))
    );

    const formattedUsers = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredUsers = formattedUsers.slice(start, end);

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

        const formattedUser = {
          id: userDoc.id,
          ...userData,
        };

        res.json(formattedUser);
      } else {
        const formattedUser = {
          id: userDoc.id,
          ...userData,
        };

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

/** CREATE new user */
router.post("/", async (req, res) => {
  const { email, ...otherAttributes } = req.body;

  try {
    const newUserRef = await addDoc(collection(db, "users"), {
      email: email,
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
  const { tags, ...userDataToUpdate } = req.body; // Don't update tags!!

  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateDoc(userDocRef, {
      ...userDataToUpdate,
      lastModified: serverTimestamp(),
    });

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
