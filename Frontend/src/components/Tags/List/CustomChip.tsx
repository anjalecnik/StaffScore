import { useRecordContext } from 'react-admin';
import { Chip } from '@mui/material';

export const CustomChip = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      variant="outlined"
      label={record.name}
      style={{ backgroundColor: record.color, border: 0 }}
    />
  );
};
