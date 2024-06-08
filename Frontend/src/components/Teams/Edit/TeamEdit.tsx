import { Edit, Form, Toolbar } from 'react-admin';
import GroupsIcon from '@mui/icons-material/Groups';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { TeamForm } from '../Create/TeamForm';

export const TeamEdit = () => (
  <Edit actions={false} redirect="show">
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
  </Edit>
);
