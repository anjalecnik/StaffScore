import { DateInput, ReferenceArrayInput, SelectArrayInput, TextInput, required } from 'react-admin';
import { Divider, Stack, Grid } from '@mui/material';
import { ITag } from '../../../shared/types/ITag';

const roles = [
  { id: 'User_CanManage', name: 'User_CanManage' },
  { id: 'User_CanView', name: 'User_CanView' },
  { id: 'Team_CanManage', name: 'Team_CanManage' },
  { id: 'Team_CanView', name: 'Team_CanView' },
  { id: 'Tag_CanManage', name: 'Tag_CanManage' },
  { id: 'Tag_CanView', name: 'Tag_CanView' },
  { id: 'Question_CanManage', name: 'Question_CanManage' },
  { id: 'Question_CanView', name: 'Question_CanView' },
  { id: 'Questionnaire_CanManage', name: 'Questionnaire_CanManage' },
  { id: 'Questionnaire_CanView', name: 'Questionnaire_CanView' }
];

export const UserForm = () => (
  <>
    <TextInput source="displayName" validate={required()} fullWidth />
    <Divider sx={{ mb: 2, width: '100%' }} />

    <TextInput source="address" fullWidth helperText={false} />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextInput fullWidth source="city" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextInput fullWidth source="zipcode" />
      </Grid>
    </Grid>
    <Divider sx={{ mb: 2, width: '100%' }} />

    <TextInput source="email" validate={required()} fullWidth helperText={false} />
    <Divider sx={{ mb: 2, width: '100%' }} />
    <Stack direction="row">
      <TextInput source="phoneNumber" helperText={false} sx={{ width: 200 }} />
    </Stack>
    <Divider sx={{ mb: 2, width: '100%' }} />

    <DateInput source="employmentDate" validate={required()} />
    <TextInput source="cardIdentifier" fullWidth helperText={false} />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextInput source="timeSpaceIdentifier" fullWidth helperText={false} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput source="teamworkIdentifier" fullWidth helperText={false} />
      </Grid>
    </Grid>

    <Divider sx={{ mb: 2, width: '100%' }} />
    <ReferenceArrayInput source="tags_ids" reference="tags">
      <SelectArrayInput
        label="Tags"
        helperText={false}
        optionText={(tags: ITag) => `${tags.name}`}
        fullWidth
      />
    </ReferenceArrayInput>
    <Divider sx={{ mb: 2, width: '100%' }} />

    <SelectArrayInput source="roles" choices={roles} fullWidth />
  </>
);
