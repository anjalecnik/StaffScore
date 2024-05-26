import { useState } from 'react';
import { Paper, Typography, Link as MuiLink, Box, Avatar } from '@mui/material';
import ContactsIcon from '@mui/icons-material/AccountCircle';
import { useCreatePath, useRecordContext } from 'react-admin';
import { Link } from 'react-router-dom';
import { ITeam } from '../../../types/ITeam';
import InsightsIcon from '@mui/icons-material/Insights';

export const TeamCard = (props: { record?: ITeam }) => {
  const [elevation, setElevation] = useState(1);
  const createPath = useCreatePath();
  const record = useRecordContext<ITeam>(props);
  if (!record) return null;

  let membersLength = 0;
  if (record.members) {
    membersLength = record.members.length;
  }

  return (
    <MuiLink
      component={Link}
      to={createPath({
        resource: 'teams',
        id: record.id,
        type: 'show'
      })}
      underline="none"
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
    >
      <Paper
        sx={{
          height: 200,
          width: 195,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1em'
        }}
        elevation={elevation}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src="./inovait.jpg"
            alt="InovaIT"
            sx={{
              bgcolor: 'aliceblue',
              '& img': { objectFit: 'contain' }
            }}
          />
          <Box textAlign="center" marginTop={2}>
            <Typography variant="subtitle1">{record.name}</Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-around" width="100%">
          <Box display="flex" alignItems="center">
            <ContactsIcon color="disabled" sx={{ mr: 1 }} />
            <div>
              <Typography variant="subtitle2" sx={{ mb: -1 }}>
                {membersLength}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {membersLength == 1 ? 'member' : 'members'}
              </Typography>
            </div>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
            <InsightsIcon color="disabled" sx={{ mr: 1 }} />
            <div>
              <Typography variant="subtitle2" sx={{ mb: -1 }}>
                0
              </Typography>
              <Typography variant="caption" color="textSecondary">
                grade
              </Typography>
            </div>
          </Box>
        </Box>
      </Paper>
    </MuiLink>
  );
};
