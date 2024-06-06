import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  Query,
  DocumentData,
} from "firebase/firestore";

const router = Router();
const axios = require("axios");

/** GET all questionnaires with questions */
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

    if (!questionnairesSnapshot.empty) {
      const formattedQuestionnaires = questionnairesSnapshot.docs.map(
        async (doc) => {
          const questionnaireDoc = doc;
          const questionnaireData = questionnaireDoc.data();

          if (
            questionnaireData.questions &&
            Array.isArray(questionnaireData.questions)
          ) {
            const tagPromises = questionnaireData.questions.map((tagRef) => {
              const tagId = tagRef.id.trim();
              return axios
                .get(`https://staff-score.vercel.app/api/questions/${tagId}`)
                .then((response: { data: any }) => response.data)
                .catch((error: any) => {
                  console.error(`Error fetching tag with id: ${tagId}`, error);
                  throw new Error(`Error fetching tag with id: ${tagId}`);
                });
            });

            const tagsArray = await Promise.all(tagPromises);

            questionnaireData.questions = tagsArray;

            const formattedUser = {
              id: questionnaireDoc.id,
              ...questionnaireData,
            };

            console.log(formattedUser);

            res.json(formattedUser);
          }
        }
      );

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
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
