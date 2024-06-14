import { Layout } from 'react-admin';
import { CustomMenu } from './CustomMenu';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomLayout = (props: any) => <Layout {...props} menu={CustomMenu} />;
