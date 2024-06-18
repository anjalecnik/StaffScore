import { List, Box, Link, useMediaQuery, Theme } from '@mui/material';
import {
  List as RaList,
  CreateButton,
  ExportButton,
  TopToolbar,
  SortButton,
  Datagrid,
  SearchInput,
  TextField
} from 'react-admin';
import SellIcon from '@mui/icons-material/Sell';
import { CustomChip } from './CustomChip';
import { ColorField } from 'react-admin-color-picker';
import { usePermissions } from 'react-admin';
import { TagRoles } from '../../../shared/auth/tagRoles';

export const TagList = () => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

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
        {isSmall ? (
          <Datagrid rowClick={permissions.includes(TagRoles.Tag_CanManage) ? 'edit' : undefined}>
            <CustomChip />
          </Datagrid>
        ) : (
          <Datagrid rowClick="edit">
            <TextField source="name" />
            <ColorField source="color" />
          </Datagrid>
        )}
      </List>
    </RaList>
  );
};

const tagFilters = [<SearchInput source="q" alwaysOn />];

const TagListActions = () => {
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <TopToolbar>
      <SortButton fields={['name']} />
      <ExportButton />
      {permissions.includes(TagRoles.Tag_CanManage) && (
        <CreateButton variant="contained" label="New Tag" sx={{ marginLeft: 2 }} />
      )}
    </TopToolbar>
  );
};
