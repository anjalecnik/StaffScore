import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  doc,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const router = Router();

router.post("/check-user", async (req, res) => {
  const { email, photoUrl } = req.body;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;

      const updateData: { [key: string]: any } = {
        photoUrl: photoUrl,
      };

      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updateData);

      const roles = userData.roles || [];

      res.json({ roles, userId });
    } else {
      res
        .status(404)
        .json({ message: "No user found with the email: " + email });
    }
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
