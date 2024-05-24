import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const teamsSnapshot = await getDocs(collection(db, "teams"));
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", teams.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(teams);
  } catch (error) {
    console.error("Error getting teams", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    const team = { id: id, ...querySnapshot };

    console.log(team);

    if (!querySnapshot.empty) {
      res.json(team);
    } else {
      res.status(404).json({ message: "No team found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
