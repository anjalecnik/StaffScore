import { useState } from 'react';
import { Paper, Typography, Link as MuiLink, Box, Avatar } from '@mui/material';
import { useCreatePath, useRecordContext } from 'react-admin';
import { Link } from 'react-router-dom';
import { ISurvey } from '../../../types/ISurvey';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const SurveyCard = (props: { record?: ISurvey }) => {
  const [elevation, setElevation] = useState(1);
  const createPath = useCreatePath();
  const record = useRecordContext<ISurvey>(props);
  
  console.log('Record:', record);

  if (!record) return null;

  return (
    <MuiLink
      component={Link}
      to={createPath({
        resource: 'surveys',
        id: record.id,
        type: 'show'
      })}
      underline="none"
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
    >
      <Paper
        sx={{
          height: 170,
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
            sx={{
              bgcolor: 'black',
              '& img': { objectFit: 'contain' },
              marginTop: 4 
            }}
          >
            <AssessmentIcon />
          </Avatar>
          <Box textAlign="center" marginTop={3}>
            <Typography variant="subtitle1">{record.id}</Typography>
          </Box>
        </Box>
      </Paper>
    </MuiLink>
  );
};
