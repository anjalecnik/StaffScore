import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, getDoc, collection, doc, query, where } from "firebase/firestore";

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
    const surveysRef = collection(db, "questionnaires");
    const q = query(surveysRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No survey found with the id: " + id });
    }

    const surveyDoc = querySnapshot.docs[0];
    const surveyData = surveyDoc.data() as { name: string; questions: any[] };

    const questionsRefs = surveyData.questions;

    const questionsPromises = questionsRefs.map(ref => getDoc(doc(db, "questions", ref.id)));
    const questionsDocs = await Promise.all(questionsPromises);

    const questions = questionsDocs.map(questionDoc => {
      if (questionDoc.exists()) {
        const data = questionDoc.data();
        return {
          id: questionDoc.id,
          question: data.question,
          type: data.type
        };
      }
      return null;
    }).filter(q => q !== null) as { id: string; question: string; type: string }[];

    const response = {
      id: surveyDoc.id,
      name: surveyData.name,
      questions: questions
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting survey by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
