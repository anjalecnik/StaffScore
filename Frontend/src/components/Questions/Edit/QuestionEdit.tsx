import { Edit, Form, Toolbar } from 'react-admin';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { QuestionForm } from '../Create/QuestionForm';

export const QuestionEdit = () => (
  <Edit actions={false} redirect="list">
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
  </Edit>
);
