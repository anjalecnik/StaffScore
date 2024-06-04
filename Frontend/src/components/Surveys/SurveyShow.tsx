import { ShowBase, useShowContext, Title, EditButton, DeleteButton } from 'react-admin';
import { Card, CardContent, Container, Divider, Typography, Box, Slider, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { ISurvey } from '../../types/ISurvey';

export const SurveyShow = () => (
  <ShowBase>
    <SurveyShowContent />
  </ShowBase>
);

const SurveyShowContent = () => {
  const { record } = useShowContext<ISurvey>();

  if (!record || !Array.isArray(record.questions)) return null;

  return (
    <Container>
      <Title title={`Survey ${record.name}`} />
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {record.name}
          </Typography>
          <Box>
            <EditButton label="Edit Survey" />
            <DeleteButton/>
          </Box>
          <Divider />
          <Box mt={3}>
            {record.questions.map((question, index) => (
              <Box key={question.id} mb={3}>
                <Typography variant="h6" gutterBottom>
                  {`Question ${index + 1}`}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {question.question}
                </Typography>
                <Divider />
                <Box mt={2}>
                  {question.type === 'scale_1_5' && (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Choose a value</FormLabel>
                      <Slider
                        aria-label="Scale"
                        defaultValue={3}
                        min={1}
                        max={5}
                        step={1}
                        marks={[
                          { value: 1, label: '1' },
                          { value: 2, label: '2' },
                          { value: 3, label: '3' },
                          { value: 4, label: '4' },
                          { value: 5, label: '5' },
                        ]}
                        valueLabelDisplay="auto"
                      />
                    </FormControl>
                  )}
                  {question.type === 'yes_no' && (
                    <FormControl component="fieldset">
                      <RadioGroup row>
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
