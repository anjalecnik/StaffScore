import { useState, useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { TextInput, required, ReferenceInput, SelectInput } from 'react-admin';
import { Divider, Typography, IconButton, Switch, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Box, MenuItem, Grid, Select } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IQuestion } from '../../../types/IQuestion';

interface SurveyFormProps {
  setSurveyData: (data: any) => void;
  record?: any;
}

export const SurveyForm = ({ setSurveyData, record }: SurveyFormProps) => {
  const { getValues, setValue } = useFormContext();
  const [questions, setQuestions] = useState([{ id: 1, creatingNew: false }]);
  const [questionTypes, setQuestionTypes] = useState<string[]>(['']);
  const [weights, setWeights] = useState<number[]>([0.1]);

  useEffect(() => {
    const formValues = getValues();
    const surveyData = {
      name: formValues.name,
      questions: questions.map((question, index) => ({
        creatingNew: question.creatingNew,
        questionId: formValues[`question_id_${question.id}`],
        newQuestion: formValues[`new_question_${question.id}`],
        questionType: questionTypes[index],
        weight: weights[index]
      }))
    };
    setSurveyData(surveyData);
  }, [questions, questionTypes, weights, getValues, setSurveyData]);

  useEffect(() => {
    if (record && record.questions) {
      const existingQuestions = record.questions.map((question: any, index: number) => ({
        id: index + 1,
        creatingNew: !question.questionId,
        questionId: question.questionId || '',
        newQuestion: question.newQuestion || '',
        questionType: question.type || '',
        weight: question.weight || 0.1
      }));
      setQuestions(existingQuestions);
    }
  }, [record]);

  useEffect(() => {
    if (record && record.questions) {
      const existingQuestionTypes = record.questions.map((question: any) => question.type || '');
      setQuestionTypes(existingQuestionTypes);
    }
  }, [record]);

  useEffect(() => {
    if (record && record.questions) {
      const existingWeights = record.questions.map((question: any) => question.weight || 0.1);
      setWeights(existingWeights);
    }
  }, [record]);

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, creatingNew: false }]);
    setQuestionTypes([...questionTypes, '']);
    setWeights([...weights, 0.1]);
  };

  const toggleCreatingNew = (index: any) => {
    const updatedQuestions = questions.map((question, i) =>
      i === index ? { ...question, creatingNew: !question.creatingNew } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleWeightChange = (index: number, value: number) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = value;
    setWeights(updatedWeights);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <TextInput source="name" validate={required()} fullWidth />
        {questions.map((question, index) => (
          <Box key={question.id} marginBottom={2}>
            <Typography>Question {question.id}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={question.creatingNew}
                  onChange={() => toggleCreatingNew(index)}
                  name="createNewQuestion"
                  color="primary"
                />
              }
              label={question.creatingNew ? 'Pick existing question' : 'Create New Question'}
            />
            <Box display="flex" alignItems="center" marginTop={2} marginBottom={2} width={500}>
              {!question.creatingNew ? (
                <>
                  <Box flex={1} marginRight={2}>
                    <ReferenceInput source={`question_id_${question.id}`} reference="questions">
                      <SelectInput
                        label="Question"
                        helperText={false}
                        optionText={(questions: IQuestion) => `${questions.question}`}
                        fullWidth
                      />
                    </ReferenceInput>
                  </Box>
                  <Box flex={1} marginLeft={2} marginBottom={3}>
                    <Typography>Weight</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={weights[index]}
                        onChange={(e) => handleWeightChange(index, parseFloat(e.target.value as string))}
                        fullWidth
                      >
                        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((value) => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              ) : (
                <>
                  <Box flex={1} marginRight={2}>
                    <TextInput source={`new_question_${question.id}`} label="New Question" fullWidth />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Question Type</FormLabel>
                      <RadioGroup
                        value={questionTypes[index] || ''}
                        onChange={(e) => {
                          const newTypes = [...questionTypes];
                          newTypes[index] = e.target.value;
                          setQuestionTypes(newTypes);
                          setValue(`question_type_${question.id}`, e.target.value);
                        }}
                        row
                      >
                        <FormControlLabel value="scale_1_5" control={<Radio />} label="Scale 1-5" />
                        <FormControlLabel value="yes_no" control={<Radio />} label="Yes/No" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                  <Box flex={1} marginLeft={2} marginBottom={16}>
                    <Typography>Weight</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={weights[index]}
                        onChange={(e) => handleWeightChange(index, parseFloat(e.target.value as string))}
                        fullWidth
                      >
                        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((value) => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}
            </Box>
            <Divider />
          </Box>
        ))}

        <IconButton onClick={addQuestion} color="primary">
          <AddCircleIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};
