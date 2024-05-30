import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

const router = Router();

/** GET all teams */
router.get("/", async (_req, res) => {
  try {
    const teamsSnapshot = await getDocs(collection(db, "teams"));
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("X-Total-Count", teams.length.toString());
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json({
      data: teams,
      total: teams.length,
    });
  } catch (error) {
    console.error("Error getting teams", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export interface IUser {
  displayName: string;
  email: string;
  address: string;
  city: string;
  zipcode: string;
  photoUrl: string;
  phoneNumber: string;
}

/** GET by document id */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("__name__", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const teamDoc = querySnapshot.docs[0];
      const teamData = teamDoc.data();

      if (teamData.members && Array.isArray(teamData.members)) {
        const teamPromises = teamData.members.map(async (memberRef) => {
          const trimmedMemberId = memberRef.id.trim();
          const trimmedMemberRef = doc(db, "users", trimmedMemberId);

          const memberSnap = await getDoc(trimmedMemberRef);
          if (memberSnap.exists()) {
            const memberData = memberSnap.data() as IUser;
            return { id: memberSnap.id, ...memberData };
          } else {
            console.log(`No user (member) found with the id: ${memberRef.id}`);
            return null;
          }
        });

        const membersArray = (await Promise.all(teamPromises)).filter(
          (member) => member !== null
        );

        teamData.members = membersArray;
      }

      if (teamData.teamLeader) {
        const trimmedLeaderId = teamData.teamLeader.id.trim();
        const trimmedLeaderRef = doc(db, "users", trimmedLeaderId);

        const leaderSnap = await getDoc(trimmedLeaderRef);
        if (leaderSnap.exists()) {
          const leaderData = leaderSnap.data() as IUser;
          teamData.teamLeader = { id: leaderSnap.id, ...leaderData };
        } else {
          console.log(
            `No user (leader) found with the id: ${teamData.teamLeader.id}`
          );
          return null;
        }
      }

      const formattedTeam: {
        id: string;
        teamLeader?: IUser;
        teamLeader_id?: string;
        members?: IUser[];
        members_ids?: string[];
        [key: string]: any;
      } = {
        id: teamDoc.id,
        ...teamData,
      };

      if (teamData.teamLeader) {
        formattedTeam.teamLeader_id = teamData.teamLeader.id.trim();
      }

      if (teamData.members && Array.isArray(teamData.members)) {
        formattedTeam.members_ids = teamData.members.map((member: any) =>
          member.id.trim()
        );
      }

      res.json(formattedTeam);
    } else {
      res.status(404).json({ message: "No team found with the id: " + id });
    }
  } catch (error) {
    console.error("Error getting team by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** CREATE new team */
router.post("/", async (req, res) => {
  const { teamLeader_id, members_ids, ...otherAttributes } = req.body;

  try {
    const newTeamRef = await addDoc(collection(db, "teams"), {
      teamLeader: doc(db, "users", teamLeader_id),
      members: members_ids.map((id: string) => doc(db, "users", id)),
      lastModified: serverTimestamp(),
      ...otherAttributes,
    });

    const updatePromises = members_ids.map(async (id: string) => {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        teams: arrayUnion(newTeamRef),
      });
    });

    await Promise.all(updatePromises);

    const newTeamDoc = await getDoc(newTeamRef);
    const newTeam = newTeamDoc.data();

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/** UPDATE team */
router.put("/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const { name, description, teamLeader_id, members_ids } = req.body;

  try {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);

    if (!teamDocSnapshot.exists()) {
      return res.status(404).json({ error: "Team not found" });
    }

    const updateData: { [key: string]: any } = {
      lastModified: serverTimestamp(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (teamLeader_id !== undefined)
      updateData.teamLeader = doc(db, "users", teamLeader_id);
    if (members_ids !== undefined)
      updateData.members = members_ids.map((id: string) =>
        doc(db, "users", id)
      );

    await updateDoc(teamDocRef, updateData);

    const updatePromises = members_ids.map(async (id: string) => {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        teams: arrayUnion(teamDocRef),
      });
    });

    await Promise.all(updatePromises);

    const updatedTeamDocSnapshot = await getDoc(teamDocRef);
    let updatedTeamData = updatedTeamDocSnapshot.data();

    if (updatedTeamData) updatedTeamData.id = teamId;

    return res.status(200).json(updatedTeamData);
  } catch (error) {
    console.error("Error updating team:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/** DELETE team */
router.delete("/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDocSnapshot = await getDoc(teamDocRef);

    if (!teamDocSnapshot.exists()) {
      return res.status(404).json({ error: "Team not found" });
    }

    await deleteDoc(teamDocRef);

    res.status(200).json();
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
