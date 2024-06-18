import { CardWithIcon } from './CardWithIcon';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { usePermissions } from 'react-admin';
import { UserRoles } from '../../shared/auth/userRoles';

interface Props {
  value?: string;
}

export const AvgEvaluation = (props: Props) => {
  const { value } = props;

  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <>
      {permissions.includes(UserRoles.User_CanView) ? (
        <CardWithIcon
          to="/users"
          icon={EqualizerIcon}
          title="Average Evaluation"
          subtitle={value}
        />
      ) : (
        <CardWithIcon to="#" icon={EqualizerIcon} title="Average Evaluation" subtitle={value} />
      )}
    </>
  );
};
