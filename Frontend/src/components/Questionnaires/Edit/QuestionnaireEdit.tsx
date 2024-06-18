import { Edit, Form, Toolbar, useEditController } from 'react-admin';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import { IQuestionnaireEdit } from '../../../shared/types/IQuestionnaireEdit';
import { QuestionnaireEditForm } from './QuestionnaireEditForm';

export const QuestionnaireEdit = (props: IQuestionnaireEdit) => {
  const { record } = useEditController(props);

  return (
    <Edit actions={false} redirect="list" {...props}>
      <Form>
        <CardContent>
          <Stack direction="row">
            <Avatar sx={{ mt: 1 }}>
              <AssignmentIcon />
            </Avatar>
            <Box ml={2} flex="1" maxWidth={796}>
              <QuestionnaireEditForm initialState={record} />
            </Box>
          </Stack>
        </CardContent>
        <Toolbar />
      </Form>
    </Edit>
  );
};
