import { List, Box, Link } from '@mui/material';
import {
  List as RaList,
  CreateButton,
  ExportButton,
  TopToolbar,
  SortButton,
  Datagrid,
  SearchInput
} from 'react-admin';
import SellIcon from '@mui/icons-material/Sell';
import { CustomChip } from './CustomChip';

export const TagList = () => {
  return (
    <RaList filters={tagFilters} actions={<TagListActions />}>
      <Box display="flex" alignItems="center">
        <Box ml={2} mr={2} display="flex">
          <SellIcon color="disabled" fontSize="large" />
        </Box>
        <Link underline="none" variant="h5" color="textSecondary">
          <h5>Tags</h5>
        </Link>
      </Box>

      <List>
        <Datagrid rowClick="edit">
          <CustomChip />
        </Datagrid>
      </List>
    </RaList>
  );
};

const tagFilters = [<SearchInput source="q" alwaysOn />];

const TagListActions = () => (
  <TopToolbar>
    <SortButton fields={['name']} />
    <ExportButton />
    <CreateButton variant="contained" label="New Tag" sx={{ marginLeft: 2 }} />
  </TopToolbar>
);
