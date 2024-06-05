import { Create, Form, Toolbar } from 'react-admin';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { QuestionnaireForm } from './QuestionnaireForm';

export const QuestionnaireCreate = () => (
  <Create actions={false} redirect="list">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <AssignmentIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <QuestionnaireForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Create>
);
