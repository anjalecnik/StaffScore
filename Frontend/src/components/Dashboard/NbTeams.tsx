import GroupsIcon from '@mui/icons-material/Groups';
import { CardWithIcon } from './CardWithIcon';
import { TeamRoles } from '../../shared/auth/teamRoles';
import { usePermissions } from 'react-admin';

interface Props {
  value?: string;
}

export const NbTeams = (props: Props) => {
  const { value } = props;

  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <>
      {permissions.includes(TeamRoles.Team_CanView) ? (
        <CardWithIcon to="/teams" icon={GroupsIcon} title="Teams" subtitle={value} />
      ) : (
        <CardWithIcon to="#" icon={GroupsIcon} title="Teams" subtitle={value} />
      )}
    </>
  );
};
