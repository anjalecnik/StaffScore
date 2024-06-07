import Welcome from './Welcome';
import { NbQuestionnaires } from './NbQuestionnaires';
import { useMediaQuery, Theme } from '@mui/material';
import { NbReports } from './NbReports';
import { NbTeams } from './NbTeams';
import { AvgEvaluation } from './AvgEvaluation';
import { CSSProperties, useEffect, useState } from 'react';
import { API_URL } from '../../dataProvider';
import { IDashboardData } from '../../types/IDashboardData';
import { IDashboardStatistic } from '../../types/IDashboardStatistic';
import { Statistics } from './Statistics';
import { CalendarComponent } from './CalendarComponent';

export const Dashboard = () => {
  const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const [data, setData] = useState<IDashboardData>({
    teamsNo: '0',
    avgEvaluation: '0',
    questionnairesNo: '0',
    reportsNo: '0'
  });

  const [graphData, setGraphData] = useState<IDashboardStatistic[]>();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const dashboardData = await response.json();
        setData(dashboardData);

        const graphResponse = await fetch(`${API_URL}/dashboard/statistics`);
        if (!graphResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const graphResponseData = await graphResponse.json();
        setGraphData(graphResponseData);
      } catch (error) {
        console.error('Error fetching questionnaire:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return isXSmall ? (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
        <NbTeams value={data.teamsNo} />
        <VerticalSpacer />
        <AvgEvaluation value={data.avgEvaluation} />
        <VerticalSpacer />
        <NbQuestionnaires value={data.questionnairesNo} />
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn as CSSProperties}>
      <div style={styles.singleCol}>
        <Welcome />
      </div>
      <div style={styles.flex}>
        <NbTeams value={data.teamsNo} />
        <Spacer />
        <AvgEvaluation value={data.avgEvaluation} />
      </div>
      <div style={styles.singleCol}>
        <NbQuestionnaires value={data.questionnairesNo} />
      </div>
      <div style={styles.singleCol}>
        <NbQuestionnaires value={data.questionnairesNo} />
      </div>
    </div>
  ) : (
    <>
      <Welcome />
      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <div style={styles.flex}>
            <NbTeams value={data.teamsNo} />
            <Spacer />
            <AvgEvaluation value={data.avgEvaluation} />
          </div>
          <div style={styles.singleCol}>
            <Statistics data={graphData} />
          </div>
        </div>
        <div style={styles.rightCol}>
          <div style={styles.flex}>
            <NbQuestionnaires value={data.questionnairesNo} />
            <Spacer />
            <NbReports value={data.reportsNo} />
          </div>
          <div style={styles.singleCol}>
            <CalendarComponent />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '0.5em' },
  rightCol: { flex: 1, marginLeft: '0.5em' },
  singleCol: { marginTop: '1em', marginBottom: '1em' }
};

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;
