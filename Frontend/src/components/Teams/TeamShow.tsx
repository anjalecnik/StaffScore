import { useShowController, SelectField, SimpleShowLayout, TextField, Title } from 'react-admin';
import { Card, CardContent, Container } from '@mui/material';

export const TeamShow = () => {
  const { record } = useShowController();
  return (
    <Container>
      <Title title={`Edit book ${record?.title}`} />
      <Card>
        <CardContent>
          <SimpleShowLayout record={record}>
            <TextField source="name" />
            <TextField source="description" />
          </SimpleShowLayout>
        </CardContent>
      </Card>
    </Container>
  );
};
