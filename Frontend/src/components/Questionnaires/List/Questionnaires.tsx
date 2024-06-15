import { List, TopToolbar, ExportButton, CreateButton, SortButton, SearchInput } from 'react-admin';
import { ImageList } from './GridList';
import { usePermissions } from 'react-admin';
import { QuestionnaireRoles } from '../../../shared/auth/questionnaireRoles';

export const QuestionnaireList = () => {
  return (
    <List filters={questionnairesFilters} actions={<TeamListActions />}>
      <ImageList />
    </List>
  );
};

const questionnairesFilters = [<SearchInput source="q" alwaysOn />];

const TeamListActions = () => {
  const { permissions } = usePermissions();

  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      {permissions.includes(QuestionnaireRoles.Questionnaire_CanManage) && (
        <CreateButton variant="contained" label="New Questionnaire" sx={{ marginLeft: 2 }} />
      )}
    </TopToolbar>
  );
};
