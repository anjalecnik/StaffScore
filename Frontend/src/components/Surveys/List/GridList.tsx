import { Box, Typography, Paper, ButtonBase } from '@mui/material';
import { RecordContextProvider, useListContext, useRedirect } from 'react-admin';
import { ISurvey } from '../../../types/ISurvey';
import { SurveyCard } from './SurveyCard'; 
import AddIcon from '@mui/icons-material/Add';

const LoadingGridList = () => (
  <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
    {Array.from({ length: 15 }, (_, key) => (
      <SurveyCardPlaceholder key={key} />
    ))}
  </Box>
);

const SurveyCardPlaceholder = () => {
  const redirect = useRedirect();

  return (
    <Paper
      component={ButtonBase}
      onClick={() => redirect('/surveys/create')}
      sx={{
        height: 170,
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        bgcolor: 'grey.200',
      }}
    >
      <AddIcon sx={{ fontSize: 42 }} />
      <Typography variant="subtitle2" align="center">Add New Survey</Typography>
    </Paper>
  );
};

const LoadedGridList = () => {
  const { data, isLoading } = useListContext<ISurvey>();

  console.log(data);

  if (isLoading) return null;

  return (
    <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
      {data.map(survey => (
        <RecordContextProvider key={survey.id} value={survey}>
          <SurveyCard record={survey} />
        </RecordContextProvider>
      ))}
      <SurveyCardPlaceholder />
    </Box>
  );
};

export const ImageList = () => {
  const { isLoading } = useListContext();
  return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};
