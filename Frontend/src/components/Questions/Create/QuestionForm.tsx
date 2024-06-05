import { RadioButtonGroupInput, TextInput, required, FormDataConsumer } from 'react-admin';
import { Grid } from '@mui/material';

export const QuestionForm = () => (
  <>
    <TextInput source="question" validate={required()} fullWidth />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <RadioButtonGroupInput
          source="type"
          choices={[
            { id: 'binary', name: 'Binary (yes/no)' },
            { id: 'rating', name: 'Rating (1-5)' }
          ]}
          validate={required()}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData.type === 'binary' ? (
              <RadioButtonGroupInput
                source="optimalResponse"
                label="Optimal Response"
                choices={[
                  { id: 'yes', name: 'Yes' },
                  { id: 'no', name: 'No' }
                ]}
                validate={required()}
                {...rest}
              />
            ) : formData.type === 'rating' ? (
              <RadioButtonGroupInput
                source="optimalResponse"
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
    </Grid>
  </>
);
