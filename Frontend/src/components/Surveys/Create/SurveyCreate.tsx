import { useState } from 'react';
import { Create, SimpleForm, useRedirect } from 'react-admin';
import { CardContent, Stack, Avatar, Box } from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import { SurveyForm } from './SurveyForm';

interface Question {
  type?: string;
  question?: string;
  questionId?: string;
  weight?: number;
}

export const SurveyCreate = () => {
  const [surveyData, setSurveyData] = useState<any>({});
  const redirect = useRedirect();

  const saveSurvey = async () => {
    try {
      const { name, questions } = surveyData;
  
      if (!name) {
        throw new Error('Name is required');
      }
  
      const totalWeight = questions.reduce((sum: number, q: any) => sum + q.weight, 0);
      if (totalWeight !== 1.0) {
        throw new Error('The total weight must be exactly 1.0');
      }
  
      const formattedQuestions: Question[] = questions.map((question: any) => {
        if (question.creatingNew) {
          return {
            type: question.questionType,
            question: question.newQuestion,
            weight: question.weight,
          };
        } else {
          return {
            questionId: question.questionId,
            weight: question.weight,
          };
        }
      });
  
      const survey = {
        name,
        questions: formattedQuestions,
      };
  
      const response = await fetch('https://staff-score.vercel.app/api/questions', {
        //http://localhost:3000/api/surveys
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(survey),
      });
  
      if (!response.ok) {
        console.error('Failed to save survey');
      } else {
        console.log('Survey saved successfully');
        redirect("/surveys");
      }
    } catch (error) {
      console.error('Server error:', error);
      return { error: 'Internal Server Error' };
    }
  };
  

  return (
    <Create actions={false} redirect="list">
      <SimpleForm onSubmit={saveSurvey}>
        <CardContent>
          <Stack direction="row">
            <Avatar sx={{ mt: 1 }}>
              <PollIcon />
            </Avatar>
            <Box ml={2} flex="1" maxWidth={796}>
              <SurveyForm setSurveyData={setSurveyData} />
            </Box>
          </Stack>
        </CardContent>
      </SimpleForm>
    </Create>
  );
};
