import { useRecordContext, EditButton, ShowButton } from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import { IUser } from '../../../../types/IUser';
import { TagsIterator } from './TagsIterator';
import { TeamsIterator } from './TeamsIterator';

const Aside = ({ link = 'edit' }: { link?: 'edit' | 'show' }) => {
  const record = useRecordContext<IUser>();

  return (
    <Box ml={4} width={250} minWidth={250}>
      <Box textAlign="center" mb={2}>
        {link === 'edit' ? <EditButton label="Edit User" /> : <ShowButton label="Show User" />}
      </Box>
      <Box mb={3}>
        <Typography variant="subtitle2">Tags</Typography>
        <Divider />
        <TagsIterator />
      </Box>
      <Box mb={3}>
        <Typography variant="subtitle2">{record.displayName}'s teams:</Typography>
        <Divider />
        <TeamsIterator />
      </Box>
    </Box>
  );
};

export default Aside;
