import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  startAt,
  orderBy,
  endAt,
} from "firebase/firestore";

const router = Router();

/** GET all tags */
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

    const tagsSnapshot = query(
      collection(db, "tags"),
      orderBy(sortField),
      startAt(queryText),
      endAt(queryText + "\uf8ff")
    );

    const tagsDocs = await getDocs(tagsSnapshot);

    const tags = tagsDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const ascDescTags = order === "desc" ? tags.reverse() : tags;

    const filteredTags = ascDescTags.slice(start, end);

    const totalRecords = tagsDocs.size;

    res.setHeader("X-Total-Count", tags.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: filteredTags,
      total: totalRecords,
    });
  } catch (error) {
    console.error("Error getting teams", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET by document id */
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

/** CREATE new tag */
router.post("/", async (req, res) => {
  const { ...attributes } = req.body;

  try {
    const newTagRef = await addDoc(collection(db, "tags"), {
      lastModified: serverTimestamp(),
      ...attributes,
    });

    const newTagDoc = await getDoc(newTagRef);
    const newTag = newTagDoc.data();

    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** UPDATE tag */
router.put("/:tagId", async (req, res) => {
  const { tagId } = req.params;
  const { ...tagDataToUpdate } = req.body;

  try {
    const tagDocRef = doc(db, "tags", tagId);
    const tagDocSnapshot = await getDoc(tagDocRef);

    if (!tagDocSnapshot.exists()) {
      return res.status(404).json({ error: "Tag not found" });
    }

    await updateDoc(tagDocRef, {
      ...tagDataToUpdate,
      lastModified: serverTimestamp(),
    });

    const updatedTagDocSnapshot = await getDoc(tagDocRef);
    const updatedTagData = updatedTagDocSnapshot.data();

    res.status(200).json(updatedTagData);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
