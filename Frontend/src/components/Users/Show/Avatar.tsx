import { Avatar as MuiAvatar } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { IUser } from '../../../shared/types/IUser';

export const Avatar = (props: { record?: IUser }) => {
  const record = useRecordContext<IUser>(props);
  if (!record) return null;

  return <MuiAvatar src={record.photoUrl}>{record.displayName?.charAt(0)}</MuiAvatar>;
};
