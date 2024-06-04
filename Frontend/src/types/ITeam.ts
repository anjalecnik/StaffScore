import { Identifier } from 'react-admin';
import { IUser } from './IUser';
import { IStatistic } from './IStatistic';

export interface ITeam {
  id: string;
  name: string;
  description: string;
  teamLeader: IUser;
  teamLeader_id: Identifier;
  members: IUser[];
  members_ids: Identifier[];
  statistics: IStatistic[];
}
