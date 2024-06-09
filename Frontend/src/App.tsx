import { Admin, Resource, CustomRoutes, Layout } from 'react-admin';
import { dataProvider } from './dataProvider';
import UserIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import SellIcon from '@mui/icons-material/Sell';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AssignmentIcon from '@mui/icons-material/Assignment';
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
import { QuestionCreate } from './components/Questions/Create/QuestionCreate';
import { QuestionEdit } from './components/Questions/Edit/QuestionEdit';
import { QuestionnaireList } from './components/Questionnaires/List/Questionnaires';
import { QuestionnaireCreate } from './components/Questionnaires/Create/QuestionnaireCreate';
import { QuestionnaireEdit } from './components/Questionnaires/Edit/QuestionnaireEdit';
import { Route } from 'react-router-dom';
import { QuestionnaireSolve } from './components/Questionnaires/Solve/QuestionnaireSolve';
import { CustomAppBar } from './layout/CustomAppBar';

export default function App() {
  return (
    <>
      <Admin
        title="StaffScore"
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        loginPage={LoginPage}
        layout={CustomLayout}
        darkTheme={{ palette: { mode: 'dark' } }}
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
          name="questionnaires"
          list={QuestionnaireList}
          create={QuestionnaireCreate}
          edit={QuestionnaireEdit}
          recordRepresentation="name"
          icon={AssignmentIcon}
        />
        <Resource
          name="questions"
          list={QuestionList}
          create={QuestionCreate}
          edit={QuestionEdit}
          recordRepresentation="name"
          icon={QuestionMarkIcon}
        />
        <CustomRoutes>
          <Route path="/solve/:questionnaireId/user/:userId" element={<QuestionnaireSolve />} />
        </CustomRoutes>
      </Admin>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLayout = (props: any) => <Layout {...props} appBar={CustomAppBar} />;
