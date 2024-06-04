import { TextInput, required } from 'react-admin';
import { Divider } from '@mui/material';
import { ColorInput } from 'react-admin-color-picker';
import './../../../assets/colorpicker.css';

export const TagForm = () => {
  return (
    <div className="create-page-sm">
      <TextInput source="name" fullWidth validate={required()} />
      <Divider sx={{ mb: 2, width: '100%' }} />
      <ColorInput
        source="color"
        picker="Circle"
        helperText="Color of the tag"
        validate={required()}
      />
    </div>
  );
};
