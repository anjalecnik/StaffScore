import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAt,
  OrderByDirection,
  addDoc,
} from "firebase/firestore";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { _end, _order, _sort, _start } = req.query;

    const end = parseInt(_end as string, 10) || 10;
    const start = parseInt(_start as string, 10) || 0;
    const order = (_order as string) === "DESC" ? "asc" : "asc"; // TODO: enable filtering by desc (https://www.reddit.com/r/Firebase/comments/16p5a4d/pagination_with_sorting_and_filtering/)
    let sortField = typeof _sort === "string" ? _sort : "lastModified";

    if (sortField == "id") sortField = "lastModified";

    const usersSnapshot = await query(
      collection(db, "users"),
      orderBy(sortField, order),
      startAt(start),
      limit(end - start)
    );

    const users = await getDocs(usersSnapshot);

    const formattedUsers = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", formattedUsers.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    await addDoc(collection(db, "users"), {
      email: email,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
