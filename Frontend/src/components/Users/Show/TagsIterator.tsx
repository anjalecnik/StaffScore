import { useRecordContext } from 'react-admin';
import { Chip, Box, Typography } from '@mui/material';
import { IUser } from '../../../types/IUser';

export const TagsIterator = () => {
  const record = useRecordContext<IUser>();

  if (!record.tags || record.tags.length === 0) {
    return (
      <Box>
        <Typography component="span" variant="body2" color="textSecondary">
          No tags
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {record.tags?.map(tag => (
        <Box mt={1} mb={1} key={tag.id}>
          <Chip
            size="small"
            variant="outlined"
            label={tag.name}
            style={{ backgroundColor: tag.color, border: 0 }}
          />
        </Box>
      ))}
    </>
  );
};
