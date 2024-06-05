import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  startAt,
  endAt,
  Query,
  DocumentData,
} from "firebase/firestore";

const router = Router();

/** GET all questions */
router.get("/", async (req, res) => {
  try {
    const { _limit, _page, _sort, _order, q } = req.query;

    const end =
      parseInt(_limit as string, 10) * parseInt(_page as string, 10) || 10;
    let start =
      (parseInt(_page as string, 10) - 1) * parseInt(_limit as string, 10) || 0;
    const order = (_order as string) === "DESC" ? "desc" : "asc";
    let sortField = typeof _sort === "string" ? _sort : "lastModified";
    const queryText = (q as string) ? q : "";

    if (sortField === "id") sortField = "lastModified";

    if (parseInt(_page as string, 10) == 1) {
      start = 0;
    }

    let qu: Query<DocumentData, DocumentData>;
    if (queryText === "") {
      qu = query(collection(db, "questions"), orderBy(sortField));
    } else {
      qu = query(
        collection(db, "questions"),
        orderBy(sortField),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
    }

    const questionsSnapshot = await getDocs(qu);

    let formattedQuestions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const ascDescQuestions =
      order === "desc" ? formattedQuestions.reverse() : formattedQuestions;

    const filteredQuestions = ascDescQuestions.slice(start, end);

    const totalRecords = questionsSnapshot.size;

    res.setHeader("X-Total-Count", totalRecords.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: filteredQuestions,
      total: totalRecords,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    const formattedQuestion = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!querySnapshot.empty) {
      res.json(formattedQuestion[0]);
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
  const { ...attributes } = req.body;

  try {
    const newQuestionRef = await addDoc(collection(db, "questions"), {
      lastModified: serverTimestamp(),
      ...attributes,
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
  const { ...questionDataToUpdate } = req.body;

  try {
    const questionDocRef = doc(db, "questions", questionId);
    const questionDocSnapshot = await getDoc(questionDocRef);

    if (!questionDocSnapshot.exists()) {
      return res.status(404).json({ error: "Question not found" });
    }

    await updateDoc(questionDocRef, {
      ...questionDataToUpdate,
      lastModified: serverTimestamp(),
    });

    const updatedQuestionDocSnapshot = await getDoc(questionDocRef);
    const updatedQuestionData = updatedQuestionDocSnapshot.data();

    res.status(200).json(updatedQuestionData);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Internal server error" });
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

    res.status(200).json([]);
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
