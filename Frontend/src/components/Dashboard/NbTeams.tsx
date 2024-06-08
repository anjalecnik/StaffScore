import GroupsIcon from '@mui/icons-material/Groups';
import { CardWithIcon } from './CardWithIcon';

interface Props {
  value?: string;
}

export const NbTeams = (props: Props) => {
  const { value } = props;
  return <CardWithIcon to="/teams" icon={GroupsIcon} title="Teams" subtitle={value} />;
};
