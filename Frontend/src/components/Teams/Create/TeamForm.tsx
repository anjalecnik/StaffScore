import {
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput
} from 'react-admin';
import { Divider } from '@mui/material';
import { IUser } from '../../../types/IUser';

export const TeamForm = () => (
  <>
    <TextInput source="name" validate={required()} fullWidth />
    <TextInput source="description" fullWidth />

    <Divider sx={{ mb: 2, width: '100%' }} />

    <ReferenceInput source="teamLeader_id" reference="users">
      <SelectInput
        label="Team Leader"
        helperText={false}
        optionText={(users: IUser) => `${users.displayName}`}
        fullWidth
      />
    </ReferenceInput>

    <ReferenceArrayInput source="members_ids" reference="users">
      <SelectArrayInput
        label="Team Members"
        helperText={false}
        optionText={(users: IUser) => `${users.displayName}`}
        fullWidth
      />
    </ReferenceArrayInput>
  </>
);
