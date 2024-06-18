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
import { usePermissions } from 'react-admin';
import { QuestionRoles } from '../../../shared/auth/questionRoles';

export const QuestionList = () => {
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

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
        <Datagrid
          rowClick={permissions.includes(QuestionRoles.Question_CanManage) ? 'edit' : undefined}
        >
          <TextField source="question" />
          <CustomTypeIcon />
        </Datagrid>
      </List>
    </RaList>
  );
};

const userFilters = [<SearchInput source="q" alwaysOn />];

const UserListActions = () => {
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <TopToolbar>
      <SortButton fields={['question']} />
      <ExportButton />
      {permissions.includes(QuestionRoles.Question_CanManage) && (
        <CreateButton variant="contained" label="New Question" sx={{ marginLeft: 2 }} />
      )}
    </TopToolbar>
  );
};
