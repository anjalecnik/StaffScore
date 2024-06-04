import { Edit, Form, Toolbar } from 'react-admin';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { QuestionForm } from '../Create/QuestionForm';

export const QuestionEdit = () => (
  <Edit actions={false} redirect="show">
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
  </Edit>
);
