import { List, TopToolbar, ExportButton, CreateButton, SortButton, SearchInput } from 'react-admin';
import { ImageList } from './GridList';

export const QuestionnaireList = () => {
  return (
    <List filters={questionnairesFilters} actions={<TeamListActions />}>
      <ImageList />
    </List>
  );
};

const questionnairesFilters = [<SearchInput source="q" alwaysOn />];

const TeamListActions = () => {
  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      <CreateButton variant="contained" label="New Questionnaire" sx={{ marginLeft: 2 }} />
    </TopToolbar>
  );
};
