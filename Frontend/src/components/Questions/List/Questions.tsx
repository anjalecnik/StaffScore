import { List, Box, Link } from '@mui/material';
import {
  List as RaList,
  Datagrid,
  TextField,
  CreateButton,
  ExportButton,
  TopToolbar,
  SortButton,
  SearchInput
} from 'react-admin';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { CustomTypeIcon } from './CustomTypeIcon';

export const QuestionList = () => {
  return (
    <RaList filters={userFilters} actions={<UserListActions />}>
      <Box display="flex" alignItems="center">
        <Box ml={2} mr={2} display="flex">
          <QuestionMarkIcon color="disabled" fontSize="large" />
        </Box>
        <Link underline="none" variant="h5" color="textSecondary">
          <h5>Questions</h5>
        </Link>
      </Box>

      <List>
        <Datagrid rowClick="edit">
          <TextField source="question" />
          <CustomTypeIcon />
        </Datagrid>
      </List>
    </RaList>
  );
};

const userFilters = [<SearchInput source="q" alwaysOn />];

const UserListActions = () => (
  <TopToolbar>
    <SortButton fields={['question']} />
    <ExportButton />
    <CreateButton variant="contained" label="New Question" sx={{ marginLeft: 2 }} />
  </TopToolbar>
);
