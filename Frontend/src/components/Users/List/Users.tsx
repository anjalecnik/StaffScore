import { List, useMediaQuery, Theme, Box, Link } from '@mui/material';
import {
  List as RaList,
  SimpleList,
  Datagrid,
  TextField,
  CreateButton,
  ExportButton,
  TopToolbar,
  SortButton
} from 'react-admin';
import UserIcon from '@mui/icons-material/Group';

export const UserList = () => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  return (
    <RaList actions={<UserListActions />}>
      <Box display="flex" alignItems="center">
        <Box ml={2} mr={2} display="flex">
          <UserIcon color="disabled" fontSize="large" />
        </Box>
        <Link underline="none" variant="h5" color="textSecondary">
          <h5>Users</h5>
        </Link>
      </Box>

      <List>
        {isSmall ? (
          <SimpleList
            primaryText={record => record.displayName}
            secondaryText={record => record.email}
          />
        ) : (
          <Datagrid rowClick="show">
            <TextField source="displayName" />
            <TextField source="email" />
          </Datagrid>
        )}
      </List>
    </RaList>
  );
};

const UserListActions = () => (
  <TopToolbar>
    <SortButton fields={['displayName', 'email']} />
    <ExportButton />
    <CreateButton variant="contained" label="New User" sx={{ marginLeft: 2 }} />
  </TopToolbar>
);