/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowBase, useShowContext, EditButton } from 'react-admin';
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
import { ITeam } from '../../../types/ITeam';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useEffect, useState } from 'react';
import { OrganizationChart } from './OrganizationChart/OrganizationChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Alert from '@mui/material/Alert';
import { BasicInformation } from './BasicInformation';
import { StatisticsChart } from './StatisticsChart/StatisticsChart';

export const TeamShow = () => (
  <ShowBase>
    <TeamShowContent />
  </ShowBase>
);

const TeamShowContent = () => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia('(orientation: landscape)').matches
  );

  const [tabValue, setTabValue] = useState(0);

  const { record } = useShowContext<ITeam>();

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

  return (
    <>
      <Box mt={2} display="flex">
        <Box flex="1">
          <Card>
            <CardContent>
              <Box display="flex">
                <Box ml={2} flex="1">
                  <Typography variant="h5">{record.name}</Typography>
                </Box>
                <Box>
                  <EditButton label="Edit Team" />
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
                <Tab icon={<InfoIcon />} aria-label="person" />
                <Tab icon={<AccountTreeIcon />} aria-label="tree" />
                <Tab icon={<AnalyticsIcon />} aria-label="analytics" />
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
                    <div style={{ maxWidth: '350px' }}>
                      <OrganizationChart record={record} />
                    </div>
                  ) : (
                    <Alert severity="warning">Rotate your device to view hierarchy.</Alert>
                  )}
                </CardContent>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
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
            </CardContent>
          </Card>
        </Box>
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
