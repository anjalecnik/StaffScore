import { List, TopToolbar, ExportButton, CreateButton, SortButton, SearchInput } from 'react-admin';
import { ImageList } from './GridList';

export const TeamList = () => {
  return (
    <List filters={teamsFilters} actions={<TeamListActions />}>
      <ImageList />
    </List>
  );
};

const teamsFilters = [<SearchInput source="q" alwaysOn />];

const TeamListActions = () => {
  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      <CreateButton variant="contained" label="New Team" sx={{ marginLeft: 2 }} />
    </TopToolbar>
  );
};
