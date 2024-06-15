/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowBase, useShowContext } from 'react-admin';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  Theme
} from '@mui/material';
import { IUser } from '../../../shared/types/IUser';
import { Avatar } from './Avatar';
import Rating from '@mui/material/Rating';
import Aside from './Aside/Aside';
import BadgeIcon from '@mui/icons-material/Badge';
import { useEffect, useState } from 'react';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { BasicInformation } from './BasicInformation';
import { StatisticsChart } from './StatisticsChart/StatisticsChart';
import Alert from '@mui/material/Alert';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Button from '@mui/material/Button';

export const UserShow = () => (
  <ShowBase>
    <UserShowContent />
  </ShowBase>
);

const UserShowContent = () => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia('(orientation: landscape)').matches
  );

  const [tabValue, setTabValue] = useState(0);

  const { record } = useShowContext<IUser>();

  useEffect(() => {
    const handleOrientationChange = (e: any) => {
      setIsLandscape(e.matches);
    };

    const mediaQueryList = window.matchMedia('(orientation: landscape)');
    mediaQueryList.addListener(handleOrientationChange);

    return () => {
      mediaQueryList.removeListener(handleOrientationChange);
    };
  }, []);

  if (!record) return null;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const averageGrade: number = record.averageEvaluation || 0;

  let firstName: string = '';
  let lastName: string = '';

  if (record.displayName) {
    const nameParts: string[] = record.displayName.split(' ');

    if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else {
      firstName = record.displayName;
    }
  }

  return (
    <>
      <Box mt={2} display="flex">
        <Box flex="1">
          <Card>
            <CardContent>
              <Box display="flex">
                <Avatar />
                <Box ml={2} flex="1">
                  <Typography variant="h5">
                    {firstName} {lastName}
                  </Typography>
                </Box>
                <Box>
                  <Rating name="read-only" value={averageGrade} readOnly />
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab icon={<BadgeIcon />} aria-label="person" />
                <Tab icon={<AnalyticsIcon />} aria-label="analytics" />
                <Tab icon={<SummarizeIcon />} aria-label="reports" />
              </Tabs>
              <Divider />
              <TabPanel value={tabValue} index={0}>
                <CardContent>
                  <BasicInformation />
                </CardContent>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <CardContent>
                  {!isSmall || (isSmall && isLandscape) ? (
                    <div>
                      <StatisticsChart data={record?.statistics} />
                    </div>
                  ) : (
                    <Alert severity="warning">Rotate your device to view statistics.</Alert>
                  )}
                </CardContent>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <CardContent>
                  {record.pdfs && <OpenInNewTabButton pdfs={record.pdfs} />}
                </CardContent>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
        {!isSmall && <Aside />}
      </Box>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};

interface PdfProps {
  pdfs: { name: string; url: string }[];
}

const OpenInNewTabButton = ({ pdfs }: PdfProps) => {
  const sortedPDFs = [...pdfs].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <>
      {sortedPDFs.map((pdf, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => window.open(pdf.url, '_blank')}
            style={{ width: 'fit-content' }}
          >
            {pdf.name}
          </Button>
        </div>
      ))}
    </>
  );
};
