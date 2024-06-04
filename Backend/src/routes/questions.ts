import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  QuerySnapshot,
  DocumentReference,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const router = Router();

/** GET all questions */
router.get("/", async (req, res) => {
  try {
    const questionsRef = collection(db, "questions");
    const questionsSnapshot = await getDocs(questionsRef);

    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", questions.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(questions);
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET question by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const questionDoc = querySnapshot.docs[0];
      const questionData = questionDoc.data();

      const formattedQuestion = {
        id: questionDoc.id,
        ...questionData,
      };

      res.json(formattedQuestion);
    } else {
      res.status(404).json({ message: "No question found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting question by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** CREATE new question */
router.post("/", async (req, res) => {
  const { text, type, ...otherAttributes } = req.body;

  try {
    const newQuestionRef = await addDoc(collection(db, "questions"), {
      question: text,
      type: type,
      ...otherAttributes,
    });

    const newQuestionDoc = await getDoc(newQuestionRef);
    const newQuestion = newQuestionDoc.data();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


/** UPDATE question */
router.put("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { text, type } = req.body;

  try {
    const questionDocRef = doc(db, "questions", questionId);
    const questionDocSnapshot = await getDoc(questionDocRef);

    if (!questionDocSnapshot.exists()) {
      return res.status(404).json({ error: "Question not found" });
    }

    const updateData: { [key: string]: any } = {
      lastModified: serverTimestamp(),
    };

    if (text !== undefined) updateData.text = text;
    if (type !== undefined) updateData.type = type;

    await updateDoc(questionDocRef, updateData);

    const updatedQuestionDocSnapshot = await getDoc(questionDocRef);
    let updatedQuestionData = updatedQuestionDocSnapshot.data();

    if (updatedQuestionData) updatedQuestionData.id = questionId;

    return res.status(200).json(updatedQuestionData);
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


/** DELETE question */
router.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    const questionDocRef = doc(db, "questions", questionId);
    const questionDocSnapshot = await getDoc(questionDocRef);

    if (!questionDocSnapshot.exists()) {
      return res.status(404).json({ error: "Question not found" });
    }

    await deleteDoc(questionDocRef);

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
