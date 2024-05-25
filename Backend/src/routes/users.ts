import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAt,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { sendMail } from "../config/mailService";

const axios = require("axios");
const router = Router();

/** GET all users */
router.get("/", async (req, res) => {
  try {
    const { _end, _order, _sort, _start } = req.query;

    const end = parseInt(_end as string, 10) || 10;
    const start = parseInt(_start as string, 10) || 0;
    const order = (_order as string) === "DESC" ? "asc" : "asc"; // TODO: enable filtering by desc (https://www.reddit.com/r/Firebase/comments/16p5a4d/pagination_with_sorting_and_filtering/)
    let sortField = typeof _sort === "string" ? _sort : "lastModified";

    if (sortField == "id") sortField = "lastModified";

    const usersSnapshot = await query(
      collection(db, "users"),
      orderBy(sortField, order),
      startAt(start),
      limit(end - start)
    );

    const users = await getDocs(usersSnapshot);

    const formattedUsers = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", formattedUsers.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

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
        const tagPromises = userData.tags.map((tagRef) => {
          const tagId = tagRef.id.trim();
          return axios
            .get(`https://staff-score.vercel.app/api/tags/${tagId}`)
            .then((response: { data: any }) => response.data)
            .catch((error: any) => {
              console.error(`Error fetching tag with id: ${tagId}`, error);
              throw new Error(`Error fetching tag with id: ${tagId}`);
            });
        });

        const tagsArray = await Promise.all(tagPromises);

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

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
