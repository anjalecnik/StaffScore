import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const surveysSnapshot = await getDocs(collection(db, "questionnaires"));
        const surveys = surveysSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.setHeader("X-Total-Count", surveys.length.toString());
        res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

        res.json(surveys);
    } catch (error) {
        console.error("Error getting surveys", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const surveyRef = doc(db, "questionnaires", id);
        const surveySnap = await getDoc(surveyRef);

        if (surveySnap.exists()) {
            const survey = { id: surveySnap.id, ...surveySnap.data() };
            res.json(survey);
        } else {
            res.status(404).json({ message: "No survey found with the id: " + id });
        }
    } catch (error) {
        console.error("Error getting survey by id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;