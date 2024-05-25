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
} from "firebase/firestore";
import { sendMail } from "../config/mailService";

const axios = require("axios");
const router = Router();

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

export default router;
