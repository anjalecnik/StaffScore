import { useState } from 'react';
import {
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required
} from 'react-admin';
import { Divider, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import QuestionForm from './QuestionForm';
import { IQuestion } from '../../../types/IQuestion';

export const SurveyForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [allQuestions, setQuestions] = useState<IQuestion[]>([]);


  const handleQuestionCreated = (newQuestion: IQuestion) => {
    setQuestions([...allQuestions, newQuestion]);
  };

  const handleClickOpen = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <TextInput source="name" label="Survey Name" validate={required()} fullWidth />

      <Divider sx={{ mb: 2, width: '100%' }} />

      <ReferenceArrayInput source="questions_ids" reference="questions">
        <SelectArrayInput
          label="Questions"
          optionText="question"
          fullWidth
        />
      </ReferenceArrayInput>

      <Divider sx={{ my: 2, width: '100%' }} />

      <IconButton onClick={handleClickOpen}>
        <AddCircleIcon />
      </IconButton>

      <QuestionForm open={showDialog} onClose={handleClose} onQuestionCreated={handleQuestionCreated} />
    </>
  );
};
