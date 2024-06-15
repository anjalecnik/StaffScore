import { List, TopToolbar, ExportButton, CreateButton, SortButton, SearchInput } from 'react-admin';
import { ImageList } from './GridList';
import { TeamRoles } from '../../../shared/auth/teamRoles';
import { usePermissions } from 'react-admin';

export const TeamList = () => {
  return (
    <List filters={teamsFilters} actions={<TeamListActions />}>
      <ImageList />
    </List>
  );
};

const teamsFilters = [<SearchInput source="q" alwaysOn />];

const TeamListActions = () => {
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      {permissions.includes(TeamRoles.Team_CanManage) && (
        <CreateButton variant="contained" label="New Team" sx={{ marginLeft: 2 }} />
      )}
    </TopToolbar>
  );
};
