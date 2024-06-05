import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import UserIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import SellIcon from '@mui/icons-material/Sell';
import { Dashboard } from './components/Dashboard/Dashboard';
import { authProvider } from './authProvider';
import { LoginPage } from './components/LoginPage';
import { TeamList } from './components/Teams/List/Teams';
import { UserList } from './components/Users/List/Users';
import { TeamShow } from './components/Teams/Show/TeamShow';
import { UserCreate } from './components/Users/Create/UserCreate';
import { UserEdit } from './components/Users/Edit/UserEdit';
import { UserShow } from './components/Users/Show/UserShow';
import { TeamCreate } from './components/Teams/Create/TeamCreate';
import { TeamEdit } from './components/Teams/Edit/TeamEdit';
import { TagList } from './components/Tags/List/Tags';
import { TagCreate } from './components/Tags/Create/TagCreate';
import { TagEdit } from './components/Tags/Edit/TagEdit';
import { QuestionList } from './components/Questions/List/Questions';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { QuestionCreate } from './components/Questions/Create/QuestionCreate';
import { QuestionEdit } from './components/Questions/Edit/QuestionEdit';

export default function App() {
  return (
    <>
      <Admin
        title="StaffScore"
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        loginPage={LoginPage}
      >
        <Resource
          name="users"
          list={UserList}
          show={UserShow}
          create={UserCreate}
          edit={UserEdit}
          recordRepresentation="name"
          icon={UserIcon}
        />
        <Resource
          name="teams"
          list={TeamList}
          show={TeamShow}
          create={TeamCreate}
          edit={TeamEdit}
          recordRepresentation="displayName"
          icon={GroupsIcon}
        />
        <Resource
          name="tags"
          list={TagList}
          create={TagCreate}
          edit={TagEdit}
          recordRepresentation="name"
          icon={SellIcon}
        />
        <Resource
          name="questions"
          list={QuestionList}
          create={QuestionCreate}
          edit={QuestionEdit}
          recordRepresentation="name"
          icon={QuestionMarkIcon}
        />
      </Admin>
    </>
  );
}
