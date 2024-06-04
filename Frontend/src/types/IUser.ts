import { Identifier } from 'react-admin';
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
  employmentDate: Date;
  cardIdentifier: string;
  timeSpaceIdentifier: string;
  teamworkIdentifier: string;
  tags: ITag[];
  tags_ids: Identifier[];
  teams: ITeam[];
}
