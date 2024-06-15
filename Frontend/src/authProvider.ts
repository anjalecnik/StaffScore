import { AuthProvider } from 'react-admin';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

export const authProvider: AuthProvider = {
  // called when the user attempts to log in
  login: ({ username }) => {
    cookies.set('sessionToken', username, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true
    });

    return Promise.resolve();
  },
  // called when the user clicks on the logout button
  logout: () => {
    cookies.remove('sessionToken');
    cookies.remove('permissions');
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      cookies.remove('sessionToken');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return cookies.get('sessionToken') ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => {
    const role = cookies.get('permissions') || [];
    return role ? Promise.resolve(role) : Promise.reject();
  }
};
