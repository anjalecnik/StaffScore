import { Create, Form, Toolbar } from 'react-admin';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { UserForm } from './UserForm';

export const UserCreate = () => (
  <Create actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <AccountBoxIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <UserForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Create>
);
