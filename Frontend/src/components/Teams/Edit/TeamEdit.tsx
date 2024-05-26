import { Edit, Form, Toolbar } from 'react-admin';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { TeamForm } from '../Create/TeamForm';

export const TeamEdit = () => (
  <Edit actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <GroupWorkIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <TeamForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Edit>
);
