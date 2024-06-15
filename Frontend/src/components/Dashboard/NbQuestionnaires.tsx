import AssignmentIcon from '@mui/icons-material/Assignment';
import { CardWithIcon } from './CardWithIcon';
import { usePermissions } from 'react-admin';
import { QuestionnaireRoles } from '../../shared/auth/questionnaireRoles';

interface Props {
  value?: string;
}

export const NbQuestionnaires = (props: Props) => {
  const { value } = props;

  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  return (
    <>
      {permissions.includes(QuestionnaireRoles.Questionnaire_CanView) ? (
        <CardWithIcon
          to="/questionnaires"
          icon={AssignmentIcon}
          title="Unique Questionnaires"
          subtitle={value}
        />
      ) : (
        <CardWithIcon to="#" icon={AssignmentIcon} title="Unique Questionnaires" subtitle={value} />
      )}
    </>
  );
};
