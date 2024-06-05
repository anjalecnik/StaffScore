import { useRecordContext } from 'react-admin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PinIcon from '@mui/icons-material/Pin';

export const CustomTypeIcon = () => {
  const record = useRecordContext();
  if (!record) return null;
  return record.type === 'binary' ? <RadioButtonCheckedIcon /> : <PinIcon />;
};
