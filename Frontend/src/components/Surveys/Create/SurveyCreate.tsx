import { Create, Form, Toolbar } from 'react-admin';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import { SurveyForm } from './SurveyForm';

export const SurveyCreate = () => (
  <Create actions={false} redirect="show">
    <Form>
      <CardContent>
        <Stack direction="row">
          <Avatar sx={{ mt: 1 }}>
            <PollIcon />
          </Avatar>
          <Box ml={2} flex="1" maxWidth={796}>
            <SurveyForm />
          </Box>
        </Stack>
      </CardContent>
      <Toolbar />
    </Form>
  </Create>
);