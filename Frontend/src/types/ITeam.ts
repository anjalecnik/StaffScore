import { IUser } from './IUser';

export interface ITeam {
  id: string;
  name: string;
  description: string;
  members: IUser[];
}
