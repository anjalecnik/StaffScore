/* eslint-disable react-hooks/rules-of-hooks */
import { EditButton, Button, useNotify } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './../../../assets/questionaireView.css';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../dataProvider';
import { IQuestion } from '../../../types/IQuestion';
import { Alert } from '@mui/material';
import './../../../assets/questionnaireSolve.css';

interface Questionnaire {
  id: string;
  name: string;
  questions: IQuestion[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export const QuestionnaireSolve = () => {
  const url = window.location.href;
  const parts = url.split('/solve/')[1];
  const [questionnaireId, userId] = parts.split('/user/');

  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (questionnaireId) {
        try {
          const response = await fetch(`${API_URL}/questionnaires/solve/${questionnaireId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestionnaire(data);
        } catch (error) {
          console.error('Error fetching questionnaire:', error);
        }
      }
    };

    fetchQuestionnaire();
  }, [questionnaireId]);

  return (
    <Card sx={{ marginTop: '20px' }}>
      {questionnaire && (
        <>
          <QuestionnaireSolveContent
            questionnaire={questionnaire}
            questionnaireId={questionnaireId}
            userId={userId}
          />
        </>
      )}
    </Card>
  );
};

interface QuestionnaireSolveProps {
  questionnaire: Questionnaire;
  questionnaireId: string;
  userId: string;
}

const QuestionnaireSolveContent = ({
  questionnaire,
  questionnaireId,
  userId
}: QuestionnaireSolveProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formValues, setFormValues] = useState<any>({});
  if (!questionnaire) return null;

  const notify = useNotify();
  const navigate = useNavigate();

  const onFormControlChange = (questionId: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/questionnaires/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formValues, questionnaireId, userId })
      });

      if (response.ok) {
        navigate(`/users/${userId}/show`);
      } else {
        notify(
          <Alert severity="error">
            An error occurred while trying to submit the questionnaire. Please try again.
          </Alert>,
          { autoHideDuration: 5000 }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box mt={2} display="flex">
        <Box flex="1">
          <Card>
            <CardContent>
              <Box display="flex">
                <Box ml={2} flex="1">
                  <Typography variant="h5">{questionnaire.name}</Typography>
                </Box>
                <Box>
                  <EditButton label="Edit Questionnaire" />
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <Box ml={2} flex="1" sx={{ maxWidth: '500px' }}>
                {questionnaire.questions.map((question, index) => (
                  <Question
                    key={index}
                    question={question}
                    onFormControlChange={onFormControlChange}
                  />
                ))}
              </Box>
              <Button
                onClick={handleSubmit}
                type="submit"
                label="Submit"
                variant="contained"
                sx={{ marginTop: '15px', marginLeft: '15px' }}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

interface QuestionTemplateProps {
  question: IQuestion;
  onFormControlChange: (questionId: string, value: string) => void;
}

const Question = ({ question, onFormControlChange }: QuestionTemplateProps) => {
  const { type } = question;

  switch (type) {
    case 'binary':
      return <BinaryQuestion question={question} onFormControlChange={onFormControlChange} />;
    case 'rating':
      return <RatingQuestion question={question} onFormControlChange={onFormControlChange} />;
    default:
      return <div></div>;
  }
};

const BinaryQuestion = ({ question, onFormControlChange }: QuestionTemplateProps) => {
  const { id } = question;

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onFormControlChange(id, value);
  };

  return (
    <>
      <Typography variant="body1" component="div" gutterBottom sx={{ marginTop: '20px' }}>
        {question.question || '/'}
      </Typography>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name={`row-radio-buttons-group-${id}`}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label="Yes"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            paddingRight: '15px',
            borderRadius: '5px',
            color: 'black'
          }}
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label="No"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            paddingRight: '15px',
            borderRadius: '5px',
            color: 'black'
          }}
        />
      </RadioGroup>
    </>
  );
};

const RatingQuestion = ({ question, onFormControlChange }: QuestionTemplateProps) => {
  const { id } = question;

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onFormControlChange(id, value);
  };

  return (
    <>
      <Typography variant="body1" component="div" gutterBottom sx={{ marginTop: '20px' }}>
        {question.question || '/'}
      </Typography>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue=""
        name={`radio-buttons-group-${id}`}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value="1"
          control={<Radio />}
          label="Strongly Disagree"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            borderRadius: '5px',
            color: 'black'
          }}
        />
        <FormControlLabel
          value="2"
          control={<Radio />}
          label="Disagree"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            borderRadius: '5px'
          }}
        />
        <FormControlLabel
          value="3"
          control={<Radio />}
          label="Neutral"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            borderRadius: '5px'
          }}
        />
        <FormControlLabel
          value="4"
          control={<Radio />}
          label="Agree"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            borderRadius: '5px'
          }}
        />
        <FormControlLabel
          value="5"
          control={<Radio />}
          label="Strongly Agree"
          className="customDisabledClass"
          sx={{
            backgroundColor: '#D0D2D4',
            marginLeft: '5px',
            marginTop: '2px',
            borderRadius: '5px'
          }}
        />
      </RadioGroup>
    </>
  );
};
