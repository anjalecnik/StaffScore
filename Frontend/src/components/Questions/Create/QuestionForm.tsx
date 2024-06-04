import { TextInput, required, RadioButtonGroupInput } from 'react-admin';
import { Divider } from '@mui/material';

export const QuestionForm = () => {

  return (
    <>
      <TextInput source="question" fullWidth validate={required()} />
      <Divider sx={{ mb: 2, width: '100%' }} />

      <RadioButtonGroupInput 
        source="type" 
        choices={[
          { id: 'yes_no', name: 'Yes/No' },
          { id: 'scale_1_5', name: 'Scale 1-5' }
        ]} 
        validate={required()} 
      />
    </>
  );
};
