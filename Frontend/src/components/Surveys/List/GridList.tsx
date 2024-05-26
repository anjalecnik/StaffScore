import { Box, Paper } from '@mui/material';
import { RecordContextProvider, useListContext } from 'react-admin';
import { ISurvey } from '../../../types/ISurvey';
import { SurveyCard } from './SurveyCard'; 

const LoadingGridList = () => (
  <Box display="flex" flexWrap="wrap" width={1008} gap={1}>
    {Array.from({ length: 15 }, (_, key) => (
      <Paper
        sx={{
          height: 200,
          width: 194,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'grey[200]'
        }}
        key={key}
      />
    ))}
  </Box>
);

const LoadedGridList = () => {
  const { data, isLoading } = useListContext<ISurvey>();

  if (isLoading) return null;

  return (
    <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
      {data.map(survey => (
        <RecordContextProvider key={survey.id} value={survey}>
          <SurveyCard record={survey} />
        </RecordContextProvider>
      ))}
    </Box>
  );
};

export const ImageList = () => {
  const { isLoading } = useListContext();
  return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};