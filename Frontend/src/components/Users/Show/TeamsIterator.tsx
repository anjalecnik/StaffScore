import { useRecordContext } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { IUser } from '../../../types/IUser';
import { useEffect, useState } from 'react';
import { ITeam } from '../../../types/ITeam';

export const TeamsIterator = () => {
  const record = useRecordContext<IUser>();
  const [teams] = useState<ITeam[]>([]);

  useEffect(() => {
    // const fetchTeams = async () => {
    //   try {
    //     if (record.id) {
    //       const response = await dataProvider.get(`/api/teams/get-user-teams/${record.id}`);
    //       setTeams(response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching teams:', error);
    //   }
    // };

    if (record.id) {
      //fetchTeams();
    }
  }, [record]);

  if (!teams || teams.length === 0) {
    return (
      <Box>
        <Typography component="span" variant="body2" color="textSecondary">
          No teams
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {teams?.map(team => (
        <Box mt={1} mb={1} key={team.id}>
          <Typography key={team.id}>{team.name}</Typography>
        </Box>
      ))}
    </>
  );
};
