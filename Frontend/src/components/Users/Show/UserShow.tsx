/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowBase, useShowContext } from 'react-admin';
import { Box, Card, CardContent, Typography, Tabs, Tab, Divider } from '@mui/material';
import { IUser } from '../../../types/IUser';
import { Avatar } from './Avatar';
import Rating from '@mui/material/Rating';
import Aside from './Aside';
import BadgeIcon from '@mui/icons-material/Badge';
import { useState } from 'react';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export const UserShow = () => (
  <ShowBase>
    <UserShowContent />
  </ShowBase>
);

const UserShowContent = () => {
  const [tabValue, setTabValue] = useState(0);

  const { record } = useShowContext<IUser>();
  if (!record) return null;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const averageGrade: number = 2;

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
              </Tabs>
              <Divider />
              <TabPanel value={tabValue} index={0}>
                <CardContent>
                  <Typography variant="body1" component="div" gutterBottom>
                    {record.displayName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {record.email}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {record.phoneNumber}
                  </Typography>

                  {record.address ? (
                    <Box mt={3}>
                      <Typography variant="h6" gutterBottom>
                        Address
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {record.address}, {record.city}, {record.zipcode}
                      </Typography>
                    </Box>
                  ) : (
                    <Box mt={3} sx={{ fontStyle: 'italic' }}>
                      <Typography variant="body1" color="textSecondary">
                        No address
                      </Typography>
                    </Box>
                  )}
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
        <Aside />
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
