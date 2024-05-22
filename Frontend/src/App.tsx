import { Admin, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { UserList } from './components/Users';
import { PostCreate, PostEdit, PostList } from './components/Posts';
import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Group';
import { Dashboard } from './components/Dashboard';
import { authProvider } from './authProvider';
import './assets/auth.css';
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
        layout={Layout}
      >
        <Resource
          name="posts"
          list={PostList}
          edit={PostEdit}
          create={PostCreate}
          icon={PostIcon}
        />
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
