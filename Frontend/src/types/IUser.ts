import { ITag } from './ITag';

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
}
