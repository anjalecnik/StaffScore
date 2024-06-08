import { Box, Card, Grid, Typography } from '@mui/material';
import { Calendar } from './Calendar';
import dayjs from 'dayjs';

export const CalendarComponent = () => {
  const nextEvaluationDate = getNextEvaluationDate();
  const daysUntilNextEvaluation = nextEvaluationDate
    ? nextEvaluationDate.diff(dayjs(), 'day')
    : null;

  return (
    <>
      <Card
        sx={{
          minHeight: 52,
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          '& a': {
            textDecoration: 'none',
            color: 'inherit'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .icon': {
              color: 'secondary.main'
            },
            '&:before': {
              position: 'absolute',
              top: '51%',
              left: -40,
              display: 'block',
              content: `''`,
              height: '135%',
              aspectRatio: '1',
              transform: 'translate(-30%, -60%)',
              borderRadius: '50%',
              backgroundColor: 'secondary.main',
              opacity: 0.15
            }
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Grid item sm={5}>
              <Box textAlign="right" sx={{ backgroundColor: '#FFFFFF', marginBottom: 10 }}>
                <Typography color="textSecondary">Days Untill Next Evaluation</Typography>
                <Typography variant="h5" component="h2">
                  {daysUntilNextEvaluation || '/'}
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={7}>
              <Calendar />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

const getNextEvaluationDate = () => {
  const today = dayjs();
  let nextEvaluationDate = null;

  for (let i = 0; i < 12; i++) {
    const month = (today.month() + i) % 12;
    if ([2, 5, 8, 11].includes(month)) {
      nextEvaluationDate = dayjs().set('month', month).set('date', 15);
      if (nextEvaluationDate.isAfter(today)) {
        break;
      }
    }
  }

  return nextEvaluationDate;
};
