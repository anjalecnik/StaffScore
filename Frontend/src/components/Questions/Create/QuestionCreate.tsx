import { Create, Form, Toolbar } from 'react-admin';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { QuestionForm } from './QuestionForm';

export const QuestionCreate = () => (
  <Create actions={false} redirect="list">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <QuestionMarkIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <QuestionForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Create>
);
