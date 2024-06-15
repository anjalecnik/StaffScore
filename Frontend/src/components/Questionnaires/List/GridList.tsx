import { Box, Paper, Link } from '@mui/material';
import { RecordContextProvider, useListContext } from 'react-admin';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { IQuestionnaire } from '../../../shared/types/IQuestionnaire';
import { QuestionnaireCard } from './QuestionnaireCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const times = (nbChildren: number, fn: (key: number) => any) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = () => (
  <Box display="flex" flexWrap="wrap" width={1008} gap={1}>
    {times(15, key => (
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
  const { data, isLoading } = useListContext<IQuestionnaire>();

  if (isLoading) return null;
  return (
    <>
      <Box display="flex" alignItems="center">
        <Box ml={2} mr={2} display="flex">
          <AssignmentIcon color="disabled" fontSize="large" />
        </Box>
        <Link underline="none" variant="h5" color="textSecondary">
          <h5>Questionnaires</h5>
        </Link>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        sx={{ boxShadow: 'none', paddingLeft: '12px', paddingBottom: '12px' }}
      >
        {data.map(record => (
          <RecordContextProvider key={record.id} value={record}>
            <QuestionnaireCard />
          </RecordContextProvider>
        ))}
      </Box>
    </>
  );
};

export const ImageList = () => {
  const { isLoading } = useListContext();
  return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};
