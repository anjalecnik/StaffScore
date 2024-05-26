import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";

const router = Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const surveyRef = doc(db, "questionnaires", id);
        const surveySnap = await getDoc(surveyRef);

        if (surveySnap.exists()) {
            const surveyData = surveySnap.data();
            const questionIds = surveyData.questions || [];

            console.log(`Survey Data: `, surveyData);
            console.log(`Question IDs: `, questionIds);

            const questionsPromises = questionIds.map(async (questionId: string) => {
                const questionRef = doc(db, "questions", questionId);
                const questionSnap = await getDoc(questionRef);
                if (questionSnap.exists()) {
                    const questionData = questionSnap.data();
                    console.log(`Question ID: ${questionId}`, questionData);
                    return { id: questionSnap.id, ...questionData };
                } else {
                    console.log(`Question not found for ID: ${questionId}`);
                    return null;
                }
            });

            const questions = (await Promise.all(questionsPromises)).filter(q => q !== null);

            console.log(`Questions: `, questions);

            const survey = { id: surveySnap.id, ...surveyData, questions };

            res.json(survey);
        } else {
            res.status(404).json({ message: "No survey found with the id: " + id });
        }
    } catch (error) {
        console.error("Error getting survey by id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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

export default router;
