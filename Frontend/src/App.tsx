import { Admin, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import UserIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import { Dashboard } from './components/Dashboard';
import { authProvider } from './authProvider';
import { LoginPage } from './components/LoginPage';
import { TeamList } from './components/Teams/List/Teams';
import { UserList } from './components/Users/List/Users';
import { TeamShow } from './components/Teams/TeamShow';
import { UserCreate } from './components/Users/Create/UserCreate';

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
          create={UserCreate}
          recordRepresentation="name"
          icon={UserIcon}
        />
        <Resource
          name="teams"
          list={TeamList}
          show={TeamShow}
          recordRepresentation="name"
          icon={GroupsIcon}
        />
      </Admin>
    </>
  );
}

0;
