import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tagsRef = collection(db, "tags");
    const q = query(tagsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    const formattedTag = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!querySnapshot.empty) {
      res.json(formattedTag[0]);
    } else {
      res.status(404).json({ message: "No tag found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting tag by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
