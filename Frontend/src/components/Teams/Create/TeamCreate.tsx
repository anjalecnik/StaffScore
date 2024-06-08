import { Create, Form, Toolbar } from 'react-admin';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { TeamForm } from './TeamForm';

export const TeamCreate = () => (
  <Create actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <GroupsIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <TeamForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Create>
);
