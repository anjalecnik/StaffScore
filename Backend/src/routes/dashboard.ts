import { Router } from "express";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  getCountFromServer,
  DocumentData,
} from "firebase/firestore";

const router: Router = Router();

interface IDashboardReport {
  teamsNo: string;
  avgEvaluation: string;
  questionnairesNo: string;
  reportsNo: string;
}

router.get("/", async (_req, res) => {
  try {
    const teamsRef = collection(db, "teams");
    const questionnairesRef = collection(db, "questionnaires");
    const statisticsRef = collection(db, "statistics");

    const [
      teamsCountSnapshot,
      questionnairesCountSnapshot,
      statisticsSnapshot,
    ] = await Promise.all([
      getCountFromServer(teamsRef),
      getCountFromServer(questionnairesRef),
      getDocs(statisticsRef),
    ]);

    const teamsCount: number = teamsCountSnapshot.data().count;
    const questionnairesCount: number =
      questionnairesCountSnapshot.data().count;

    let totalScore: number = 0;
    let count: number = 0;
    statisticsSnapshot.forEach((doc) => {
      const data: DocumentData = doc.data();
      const evaluation: number = data.evaluation;

      if (typeof evaluation === "number") {
        totalScore += evaluation;
        count++;
      }
    });

    const averageScore: number =
      count > 0 ? Math.round((totalScore / count) * 100) / 100 : 0;
    const reportsCount: number = statisticsSnapshot.size;

    const reports: IDashboardReport = {
      teamsNo: String(teamsCount),
      avgEvaluation: String(averageScore * 5),
      questionnairesNo: String(questionnairesCount),
      reportsNo: String(reportsCount),
    };

    res.json(reports);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/statistics/", async (_req, res) => {
  try {
    const statisticsSnapshot = await getDocs(collection(db, "statistics"));

    const statistics: IStatistic[] = statisticsSnapshot.docs.map((doc) => ({
      id: doc.id,
      evaluation: doc.data().evaluation,
      date: doc.data().timestamp.toDate(),
    }));

    const groupedByQuarter: { [key: string]: IStatistic[] } =
      statistics.reduce<{
        [key: string]: IStatistic[];
      }>((acc, stat) => {
        const quarterName = getQuarterName(stat.date);
        if (!acc[quarterName]) {
          acc[quarterName] = [];
        }
        acc[quarterName].push(stat);
        return acc;
      }, {});

    const result: IQuarterlyStatistic[] = Object.keys(groupedByQuarter).map(
      (quarter) => {
        const stats: IStatistic[] = groupedByQuarter[quarter];
        const totalEvaluation: number = stats.reduce(
          (sum, stat) => sum + stat.evaluation,
          0
        );
        const avgEv: number = totalEvaluation / stats.length;

        return { name: quarter, avgEv: avgEv };
      }
    );

    result.sort((a, b) => a.name.localeCompare(b.name));

    res.json(result);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

interface IStatistic {
  id: string;
  evaluation: number;
  date: Date;
}

interface IQuarterlyStatistic {
  name: string;
  avgEv: number;
}

const getQuarterName = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth();
  const quarter: number = Math.floor(month / 3) + 1;
  return `${year}-Q${quarter}`;
};

export default router;
