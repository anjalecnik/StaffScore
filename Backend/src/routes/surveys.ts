import { Router } from "express";
import { db } from "../config/firebase";
import { getDocs, getDoc, collection, doc, query, where, addDoc, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const router = Router();

/** GET all surveys */
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

/** GET by document id */
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

/** CREATE new survey */
router.post("/", async (req, res) => {
  const { questions_ids, ...otherAttributes} = req.body;

  try {
    const newSurveyRef = await addDoc(collection(db, "questionnaires"), {
      questions: questions_ids.map((id: string) => doc(db, "questions", id)),
      ...otherAttributes
    });

    const newSurveyDoc = await getDoc(newSurveyRef);
    const newSurvey = newSurveyDoc.data();

    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** UPDATE survey */
router.put("/:surveyId", async (req, res) => {
  const { surveyId } = req.params;
  const { name, question_ids } = req.body;

  try {
    const surveyDocRef = doc(db, "questionnaires", surveyId);
    const surveyDocSnapshot = await getDoc(surveyDocRef);

    if (!surveyDocSnapshot.exists()) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const updateData: { [key: string]: any } = {
      lastModified: serverTimestamp(),
    };

    if (name !== undefined) updateData.name = name;
    if (question_ids !== undefined)
      updateData.questions = question_ids.map((id: string) =>
        doc(db, "questions", id)
      );

    await updateDoc(surveyDocRef, updateData);

    const updatedSurveyDocSnapshot = await getDoc(surveyDocRef);
    let updatedSurveyData = updatedSurveyDocSnapshot.data();

    if (updatedSurveyData) updatedSurveyData.id = surveyId;

    return res.status(200).json(updatedSurveyData);
  } catch (error) {
    console.error("Error updating survey:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/** DELETE survey */
router.delete("/:surveyId", async (req, res) => {
  const { surveyId } = req.params;

  try {
    const surveyDocRef = doc(db, "questionnaires", surveyId);
    const surveyDocSnapshot = await getDoc(surveyDocRef);

    if (!surveyDocSnapshot.exists()) {
      return res.status(404).json({ error: "Survey not found" });
    }

    await deleteDoc(surveyDocRef);

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
