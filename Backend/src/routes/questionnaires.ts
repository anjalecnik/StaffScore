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

/** GET all questionnaires */
router.get("/", async (req, res) => {
  try {
    const { _limit, _page, _sort, _order, q } = req.query;

    const order = (_order as string) === "DESC" ? "desc" : "asc";
    let sortField = typeof _sort === "string" ? _sort : "lastModified";
    const queryText = (q as string) ? q : "";

    if (sortField === "id") sortField = "lastModified";

    let qu: Query<DocumentData, DocumentData>;
    if (queryText === "") {
      qu = query(collection(db, "questionnaires"), orderBy(sortField));
    } else {
      qu = query(
        collection(db, "questionnaires"),
        orderBy(sortField),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
    }

    const questionnairesSnapshot = await getDocs(qu);

    let formattedQuestionnaires = questionnairesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const ascDescQuestions =
      order === "desc"
        ? formattedQuestionnaires.reverse()
        : formattedQuestionnaires;

    res.setHeader("X-Total-Count", ascDescQuestions.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: ascDescQuestions,
      total: ascDescQuestions.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

interface IQuestion {
  question: string;
  type: string;
  optimalResponse: string;
}

interface Question {
  id: string;
  question: string;
  type: string;
  optimalResponse: string;
}

/** GET by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const questionnaireRef = collection(db, "questionnaires");
    const q = query(questionnaireRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const questionnaireDoc = querySnapshot.docs[0];
      const questionnaireData = questionnaireDoc.data();

      const questionsArray = Object.entries(
        questionnaireData.questionWeights
      ).map(([question_id, weight]) => ({
        question_id,
        weight: Number(weight).toFixed(2),
      }));

      const formattedQuestionnaire = {
        id: id,
        name: questionnaireData.name,
        questions: questionsArray,
      };

      res.json(formattedQuestionnaire);
    } else {
      res
        .status(404)
        .json({ message: "No questionnaire found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting questionnaire by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET by document id for solve */
router.get("/solve/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const questionnaireRef = collection(db, "questionnaires");
    const q = query(questionnaireRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const questionnaireDoc = querySnapshot.docs[0];
      const questionnaireData = questionnaireDoc.data();

      let formattedQuestionnaire = {
        id: questionnaireDoc.id,
        ...questionnaireData,
      };

      if (
        questionnaireData.questions &&
        Array.isArray(questionnaireData.questions)
      ) {
        const questionPromises = questionnaireData.questions.map(
          async (questionRef) => {
            const trimmedQuestionId = questionRef.id.trim();
            const trimmedQuestionRef = doc(db, "questions", trimmedQuestionId);

            const questionSnap = await getDoc(trimmedQuestionRef);
            if (questionSnap.exists()) {
              const questionData = questionSnap.data() as IQuestion;
              return { id: questionSnap.id, ...questionData };
            } else {
              console.log(`No question found with the id: ${questionRef.id}`);
              return null;
            }
          }
        );

        const questionsArray = (await Promise.all(questionPromises)).filter(
          (question) => question !== null
        );

        questionnaireData.questions = questionsArray;

        formattedQuestionnaire = {
          id: questionnaireDoc.id,
          ...questionnaireData,
        };
      }

      res.json(formattedQuestionnaire);
    } else {
      res
        .status(404)
        .json({ message: "No questionnaire found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting questionnaire by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** CREATE new questionnaire */
router.post("/", async (req, res) => {
  const { name, questions } = req.body;

  try {
    const processedQuestions = await Promise.all(
      questions.map(async (question: any) => {
        if (question.qType) {
          const modifiedQuestion = {
            lastModified: serverTimestamp(),
            type: question.qType,
            ...question,
          };

          const newQuestionRef = await addDoc(
            collection(db, "questions"),
            modifiedQuestion
          );
          question.question_id = newQuestionRef.id;
        } else {
          const questionDoc = await getDoc(
            doc(db, "questions", question.question_id)
          );
          if (questionDoc.exists()) {
            const existingQuestion = questionDoc.data();
            question = { ...existingQuestion, ...question };
          } else {
            throw new Error(
              `Question with ID ${question.question_id} not found.`
            );
          }
        }
        return question;
      })
    );

    const totalWeight = processedQuestions.reduce(
      (sum, q) => sum + parseFloat(q.weight),
      0
    );
    const normalizedQuestions = processedQuestions.map((q) => ({
      ...q,
      weight: (parseFloat(q.weight) / totalWeight).toFixed(2),
    }));

    const mappedData = {
      lastModified: serverTimestamp(),
      name,
      questionWeights: Object.fromEntries(
        normalizedQuestions.map((q) => [q.question_id, parseFloat(q.weight)])
      ),
      questions: normalizedQuestions.map(
        (q, index) => `/questions/${q.question_id}`
      ),
    };

    const newQuestionnaireRef = await addDoc(
      collection(db, "questionnaires"),
      mappedData
    );
    const newQuestionnaireDoc = await getDoc(newQuestionnaireRef);
    const newQuestionnaire = newQuestionnaireDoc.data();

    res.status(201).json(newQuestionnaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** UPDATE questionnaire */
router.put("/:questionnaireId", async (req, res) => {
  const { questionnaireId } = req.params;
  const { name, questions } = req.body;

  try {
    const questionnaireDocRef = doc(db, "questionnaires", questionnaireId);
    const questionnaireDocSnapshot = await getDoc(questionnaireDocRef);

    if (!questionnaireDocSnapshot.exists()) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }

    const processedQuestions = await Promise.all(
      questions.map(async (question: any) => {
        if (question.qType) {
          const modifiedQuestion = {
            lastModified: serverTimestamp(),
            type: question.qType,
            ...question,
          };
          const newQuestionRef = await addDoc(
            collection(db, "questions"),
            modifiedQuestion
          );
          question.question_id = newQuestionRef.id;
        } else {
          const questionDoc = await getDoc(
            doc(db, "questions", question.question_id)
          );
          if (questionDoc.exists()) {
            const existingQuestion = questionDoc.data();
            question = { ...existingQuestion, ...question };
          } else {
            throw new Error(
              `Question with ID ${question.question_id} not found.`
            );
          }
        }
        return question;
      })
    );

    const totalWeight = processedQuestions.reduce(
      (sum, q) => sum + parseFloat(q.weight),
      0
    );
    const normalizedQuestions = processedQuestions.map((q) => ({
      ...q,
      weight: (parseFloat(q.weight) / totalWeight).toFixed(2),
    }));

    const mappedData = {
      lastModified: serverTimestamp(),
      name,
      questionWeights: Object.fromEntries(
        normalizedQuestions.map((q) => [q.question_id, parseFloat(q.weight)])
      ),
      questions: normalizedQuestions.map(
        (q, index) => `/questions/${q.question_id}`
      ),
    };

    await updateDoc(questionnaireDocRef, mappedData);

    const updatedQuestionnaireDocSnapshot = await getDoc(questionnaireDocRef);
    const updatedQuestionnaireData = updatedQuestionnaireDocSnapshot.data();

    res.status(200).json({ id: questionnaireId, ...updatedQuestionnaireData });
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** SOLVE questionnaire */
router.post("/solve", async (req, res) => {
  const { formValues, questionnaireId, userId } = req.body;
  try {
    try {
      const questionnaireRef = collection(db, "questionnaires");
      const q = query(
        questionnaireRef,
        where("__name__", "==", questionnaireId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const questionnaireDoc = querySnapshot.docs[0];
        const questionnaireData = questionnaireDoc.data();

        let formattedQuestionnaire: any = {
          id: questionnaireDoc.id,
          ...questionnaireData,
        };

        if (
          questionnaireData.questions &&
          Array.isArray(questionnaireData.questions)
        ) {
          const questionPromises = questionnaireData.questions.map(
            async (questionRef: { id: string }) => {
              const trimmedQuestionId = questionRef.id.trim();
              const trimmedQuestionRef = doc(
                db,
                "questions",
                trimmedQuestionId
              );

              const questionSnap = await getDoc(trimmedQuestionRef);
              if (questionSnap.exists()) {
                const questionData = questionSnap.data() as IQuestion;
                return { id: questionSnap.id, ...questionData };
              } else {
                console.log(`No question found with the id: ${questionRef.id}`);
                return null;
              }
            }
          );

          const questionsArray = (await Promise.all(questionPromises)).filter(
            (question) => question !== null
          );

          questionnaireData.questions = questionsArray;

          formattedQuestionnaire = {
            id: questionnaireDoc.id,
            ...questionnaireData,
          };
        }

        let evaluation = 0;
        const questionWeights = questionnaireData.questionWeights;
        formattedQuestionnaire.questions.forEach((question: ICalcQuestion) => {
          evaluation += calculateEvaluation(
            question,
            formValues,
            questionWeights
          );
        });

        const timestamp = serverTimestamp();

        const newEvaluationRef = await addDoc(collection(db, "statistics"), {
          evaluation,
          questionnaire: doc(db, "questionnaires", questionnaireId),
          timestamp,
          user: doc(db, "users", userId),
        });

        res.json(newEvaluationRef);
      } else {
        res.status(404).json({
          message: "No questionnaire found with the id: " + questionnaireId,
        });
      }
    } catch (error) {
      console.error("Error getting questionnaire by id:", error);
      res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

interface ICalcQuestion {
  id: string;
  lastModified: any;
  optimalResponse: string;
  type: "binary" | "rating";
  question: string;
}

const calculateEvaluation = (
  question: ICalcQuestion,
  formValues: Record<string, string>,
  questionWeights: Record<string, number>
): number => {
  const { id, optimalResponse } = question;
  const formResponse = formValues[id];

  if (question.type === "binary" && formResponse === optimalResponse) {
    return questionWeights[id];
  }

  if (question.type === "rating") {
    const optimal = parseInt(optimalResponse);
    const response = parseInt(formResponse);
    const weight = questionWeights[id];

    if (
      !isNaN(optimal) &&
      !isNaN(response) &&
      optimal >= 1 &&
      optimal <= 5 &&
      response >= 1 &&
      response <= 5
    ) {
      const difference = Math.abs(optimal - response);
      const percentage = 1 - difference / 4;
      const weightedPercentage = percentage * weight;
      return Math.min(weightedPercentage, 1);
    }
  }

  return 0;
};

/** DELETE questionnaire */
router.delete("/:questionnaireId", async (req, res) => {
  const { questionnaireId } = req.params;

  try {
    const questionnaireDocRef = doc(db, "questionnaires", questionnaireId);
    const questionnaireDocSnapshot = await getDoc(questionnaireDocRef);

    if (!questionnaireDocSnapshot.exists()) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }

    await deleteDoc(questionnaireDocRef);

    res.status(200).json([]);
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
