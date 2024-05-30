import { List, TopToolbar, ExportButton, CreateButton, SortButton } from 'react-admin';
import { ImageList } from './GridList';

export const TeamList = () => {
  return (
    <List actions={<TeamListActions />}>
      <ImageList />
    </List>
  );
};

const TeamListActions = () => {
  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      <CreateButton variant="contained" label="New Team" sx={{ marginLeft: 2 }} />
    </TopToolbar>
  );
};
