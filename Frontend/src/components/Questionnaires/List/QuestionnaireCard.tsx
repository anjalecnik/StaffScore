import { useState } from 'react';
import { Paper, Typography, Link as MuiLink, Box, Avatar } from '@mui/material';
import { useCreatePath, useRecordContext } from 'react-admin';
import { Link } from 'react-router-dom';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { IQuestionnaire } from '../../../types/IQuestionnaire';

export const QuestionnaireCard = (props: { record?: IQuestionnaire }) => {
  const [elevation, setElevation] = useState(1);
  const createPath = useCreatePath();
  const record = useRecordContext<IQuestionnaire>(props);
  if (!record) return null;

  let noOfQuestions = 0;
  if (record.questions) {
    noOfQuestions = record.questions.length;
  }

  return (
    <MuiLink
      component={Link}
      to={createPath({
        resource: 'questionnaires',
        id: record.id,
        type: 'edit'
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
            <QuestionMarkIcon color="disabled" sx={{ mr: 1 }} />
            <div>
              <Typography variant="subtitle2" sx={{ mb: -1 }}>
                {noOfQuestions}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {noOfQuestions == 1 ? 'question' : 'questions'}
              </Typography>
            </div>
          </Box>
        </Box>
      </Paper>
    </MuiLink>
  );
};
