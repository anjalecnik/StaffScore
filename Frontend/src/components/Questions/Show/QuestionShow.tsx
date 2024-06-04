import { ShowBase, useShowContext, EditButton } from 'react-admin';
import { Box, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Slider } from '@mui/material';
import { IQuestion } from '../../../types/IQuestion';

export const QuestionShow = () => (
  <ShowBase>
    <QuestionShowContent />
  </ShowBase>
);

const QuestionShowContent = () => {
  const { record } = useShowContext<IQuestion>();
  if (!record) return null;

  return (
    <>
      <Box mt={2} display="flex">
        <Box flex="1">
          <Card>
            <CardContent>
              <Box display="flex">
                <Box flex="1">
                  <Typography variant="h5" gutterBottom>
                    Question: {record.question}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Text: {record.question}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Type: {record.type === 'scale_1_5' ? 'Scale 1-5' : 'Yes/No'}
                  </Typography>
                  {record.type === 'yes_no' ? (
                    <RadioGroup row aria-label="yes_no" name="yes_no" defaultValue="yes">
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" disabled />
                      <FormControlLabel value="no" control={<Radio />} label="No" disabled />
                    </RadioGroup>
                  ) : (
                    record.type === 'scale_1_5' && (
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
                        disabled
                      />
                    )
                  )}
                </Box>
                <Box>
                  <EditButton label="Edit Question" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
