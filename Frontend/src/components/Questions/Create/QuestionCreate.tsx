import { Create, Form, Toolbar } from 'react-admin';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { QuestionForm } from './QuestionForm';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export const QuestionCreate = () => (
  <Create actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <HelpCenterIcon />
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
