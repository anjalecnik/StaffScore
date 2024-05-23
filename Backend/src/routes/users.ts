import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", users.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(users);
  } catch (error) {
    console.error("Error getting users", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
