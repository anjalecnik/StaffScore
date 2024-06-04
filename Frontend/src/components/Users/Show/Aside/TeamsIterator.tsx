import { useCreatePath, useRecordContext } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { IUser } from '../../../../types/IUser';
import { Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export const TeamsIterator = () => {
  const record = useRecordContext<IUser>();
  const createPath = useCreatePath();

  if (!record.teams || record.teams.length === 0) {
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
      {record.teams?.map(team => (
        <Box mt={1} mb={1} key={team.id}>
          <MuiLink
            component={Link}
            to={createPath({
              resource: 'teams',
              id: team.id,
              type: 'show'
            })}
            color="inherit"
            underline="hover"
          >
            <Typography key={team.id}>{team.name}</Typography>
          </MuiLink>
        </Box>
      ))}
    </>
  );
};
