import { DateInput, TextInput, required } from 'react-admin';
import { Divider, Stack, Grid } from '@mui/material';

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
  </>
);
