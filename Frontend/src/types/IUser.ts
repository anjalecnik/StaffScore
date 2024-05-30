import { ITag } from './ITag';
import { ITeam } from './ITeam';

export interface IUser {
  id: string;
  displayName: string;
  email: string;
  address: string;
  city: string;
  zipcode: string;
  photoUrl: string;
  phoneNumber: string;
  tags: ITag[];
  teams: ITeam[];
}
