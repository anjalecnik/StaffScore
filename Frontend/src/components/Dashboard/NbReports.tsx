import SummarizeIcon from '@mui/icons-material/Summarize';
import { CardWithIcon } from './CardWithIcon';
import { usePermissions } from 'react-admin';
import { UserRoles } from '../../shared/auth/userRoles';

interface Props {
  value?: string;
}

export const NbReports = (props: Props) => {
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
          icon={SummarizeIcon}
          title="Questionnaire Reports"
          subtitle={value}
        />
      ) : (
        <CardWithIcon to="#" icon={SummarizeIcon} title="Questionnaire Reports" subtitle={value} />
      )}
    </>
  );
};
