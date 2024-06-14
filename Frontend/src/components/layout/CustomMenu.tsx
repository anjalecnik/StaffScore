import { Menu } from 'react-admin';
import { Submenu } from './Submenu.tsx';
import ForumIcon from '@mui/icons-material/Forum';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Divider } from '@mui/material';

export const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Divider sx={{ mb: 2, width: '100%', borderStyle: 'dashed' }} />
    <Submenu text="Questionnaires" icon={<ForumIcon />}>
      <Menu.ResourceItem name="questionnaires" />
      <Menu.ResourceItem name="questions" />
    </Submenu>
    <Submenu text="User Management" icon={<ManageAccountsIcon />}>
      <Menu.ResourceItem name="users" />
      <Menu.ResourceItem name="teams" />
      <Menu.ResourceItem name="tags" />
    </Submenu>
  </Menu>
);
