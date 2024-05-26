/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowBase, useShowContext, EditButton } from 'react-admin';
import { Box, Card, CardContent, Typography, Tabs, Tab, Divider } from '@mui/material';
import { ITeam } from '../../../types/ITeam';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useState } from 'react';

export const TeamShow = () => (
  <ShowBase>
    <TeamShowContent />
  </ShowBase>
);

const TeamShowContent = () => {
  const [tabValue, setTabValue] = useState(0);

  const { record } = useShowContext<ITeam>();
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
                <Tab icon={<AnalyticsIcon />} aria-label="analytics" />
              </Tabs>
              <Divider />
              <TabPanel value={tabValue} index={0}>
                <CardContent>
                  <Typography variant="body1" component="div" gutterBottom>
                    {record.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {record.description}
                  </Typography>
                </CardContent>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <CardContent>
                  <Typography variant="h5">Statistics</Typography>
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
