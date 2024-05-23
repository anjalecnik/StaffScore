import { Admin, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import UserIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import { Dashboard } from './components/Dashboard';
import { authProvider } from './authProvider';
import { LoginPage } from './components/LoginPage';
import Layout from './layout/Layout';

export default function App() {
  return (
    <>
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        loginPage={LoginPage}
      >
        <Resource
          name="users"
          list={UserList}
          show={ShowGuesser}
          recordRepresentation="name"
          icon={UserIcon}
        />
      </Admin>
    </>
  );
}

0;
