import { useState } from 'react';
import {
  TextInput,
  ReferenceInput,
  SelectInput,
  FormDataConsumer,
  RadioButtonGroupInput,
  required
} from 'react-admin';
import {
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IQuestionnaireEdit } from '../../../types/IQuestionnaireEdit';

interface FormProps {
  initialState: IQuestionnaireEdit;
}

export const QuestionnaireEditForm = ({ initialState }: FormProps) => {
  const [questions, setQuestions] = useState([...initialState.questions]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddQuestion = (type: string) => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        type,
        question: 'Question',
        weight: '',
        qType: '',
        optimalResponse: ''
      }
    ]);
    setDialogOpen(false);
  };

  const handleRemoveQuestion = (id: number | undefined, index: number) => {
    if (id) {
      setQuestions(questions.filter(q => q.id !== id));
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TextInput source="name" validate={required()} fullWidth />
      <Divider sx={{ mb: 2, width: '100%' }} />

      {questions.map((q, index) => (
        <Grid container spacing={2} key={q.id || index} alignItems="center">
          {q.type === 'new' ? (
            <>
              <Grid item xs={6} sm={6}>
                <TextInput
                  source={`questions[${index}].question`}
                  fullWidth
                  helperText={false}
                  label="Question"
                  validate={required()}
                />
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextInput
                  source={`questions[${index}].weight`}
                  fullWidth
                  helperText={false}
                  label="Weight"
                  validate={required()}
                />
              </Grid>
              <Grid item xs={2} sm={1}>
                <IconButton
                  onClick={() => handleRemoveQuestion(q.id, index)}
                  disabled={questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid item xs={6} sm={6}>
                <RadioButtonGroupInput
                  source={`questions[${index}].qType`}
                  label="Type"
                  choices={[
                    { id: 'binary', name: 'Binary (yes/no)' },
                    { id: 'rating', name: 'Rating (1-5)' }
                  ]}
                  validate={required()}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormDataConsumer>
                  {({ formData, ...rest }) =>
                    formData.questions && formData.questions[index].qType === 'binary' ? (
                      <RadioButtonGroupInput
                        source={`questions[${index}].optimalResponse`}
                        label="Optimal Response"
                        choices={[
                          { id: 'yes', name: 'Yes' },
                          { id: 'no', name: 'No' }
                        ]}
                        validate={required()}
                        {...rest}
                      />
                    ) : formData.questions && formData.questions[index].qType === 'rating' ? (
                      <RadioButtonGroupInput
                        source={`questions[${index}].optimalResponse`}
                        label="Optimal Response"
                        choices={[
                          { id: '1', name: '1' },
                          { id: '5', name: '5' }
                        ]}
                        validate={required()}
                        {...rest}
                      />
                    ) : null
                  }
                </FormDataConsumer>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6} sm={6}>
                <ReferenceInput source={`questions[${index}].question_id`} reference="questions">
                  <SelectInput
                    label="Question"
                    helperText={false}
                    optionText={question => `${question.question}`}
                    fullWidth
                    validate={required()}
                  />
                </ReferenceInput>
              </Grid>
              <Grid item xs={4} sm={4}>
                <TextInput
                  source={`questions[${index}].weight`}
                  fullWidth
                  helperText={false}
                  label="Weight"
                  validate={required()}
                />
              </Grid>
              <Grid item xs={2} sm={1}>
                <IconButton
                  onClick={() => handleRemoveQuestion(q.id, index)}
                  disabled={questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </>
          )}
        </Grid>
      ))}
      <Button onClick={handleDialogOpen} startIcon={<AddIcon />} style={{ marginTop: 16 }}>
        Add Question
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Question Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to create a new question or use an existing question?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAddQuestion('new')} color="primary">
            New Question
          </Button>
          <Button onClick={() => handleAddQuestion('existing')} color="primary">
            Existing Question
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
