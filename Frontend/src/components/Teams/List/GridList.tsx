import { Box, Paper } from '@mui/material';
import { RecordContextProvider, useListContext } from 'react-admin';

import { TeamCard } from './TeamCard';
import { ITeam } from '../../../types/ITeam';

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
  const { data, isLoading } = useListContext<ITeam>();

  if (isLoading) return null;

  return (
    <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
      {data.map(record => (
        <RecordContextProvider key={record.id} value={record}>
          <TeamCard />
        </RecordContextProvider>
      ))}
    </Box>
  );
};

export const ImageList = () => {
  const { isLoading } = useListContext();
  return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};