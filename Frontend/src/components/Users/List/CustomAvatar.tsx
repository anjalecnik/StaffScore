import { useRecordContext } from 'react-admin';
import { Avatar } from '@mui/material';

export const CustomAvatar = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <Avatar src={record?.photoUrl} sx={{ width: 29, height: 29 }} />;
};
