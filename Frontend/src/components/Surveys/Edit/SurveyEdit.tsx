import { Edit, Form, Toolbar } from 'react-admin';
import PollIcon from '@mui/icons-material/GroupWork';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { SurveyForm } from '../../Surveys/Create/SurveyForm';

export const SurveyEdit = () => (
  <Edit actions={false} redirect="show">
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
  </Edit>
);