import { Edit, Form, Toolbar } from 'react-admin';
import SellIcon from '@mui/icons-material/Sell';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { TagForm } from '../Create/TagForm';

export const TagEdit = () => (
  <Edit actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <SellIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <TagForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Edit>
);
