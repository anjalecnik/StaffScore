import { useShowController, SimpleShowLayout, TextField, Title } from 'react-admin';
import { Card, CardContent, Container } from '@mui/material';
import { ITeam } from '../../types/ITeam';

export const TeamShow = () => {
  const { record } = useShowController();
  console.log(record as ITeam);
  return (
    <Container>
      <Title title={`Team ${record?.name}`} />
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
