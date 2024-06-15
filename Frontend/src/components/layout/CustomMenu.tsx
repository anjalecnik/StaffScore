import { Menu } from 'react-admin';
import { Submenu } from './Submenu.tsx';
import ForumIcon from '@mui/icons-material/Forum';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Divider } from '@mui/material';
import { usePermissions } from 'react-admin';
import { TagRoles } from '../../shared/auth/tagRoles.ts';
import { TeamRoles } from '../../shared/auth/teamRoles.ts';
import { UserRoles } from '../../shared/auth/userRoles.ts';
import { QuestionnaireRoles } from '../../shared/auth/questionnaireRoles.ts';
import { QuestionRoles } from '../../shared/auth/questionRoles.ts';

export const CustomMenu = () => {
  const { permissions } = usePermissions();

  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  const hasQuestionnairePermissions = (): boolean => {
    return (
      permissions.includes(QuestionnaireRoles.Questionnaire_CanView) ||
      permissions.includes(QuestionRoles.Question_CanView)
    );
  };

  const hasUserManagementPermissions = (): boolean => {
    return (
      permissions.includes(UserRoles.User_CanView) ||
      permissions.includes(TeamRoles.Team_CanView) ||
      permissions.includes(TagRoles.Tag_CanView)
    );
  };

  return (
    <Menu>
      <Menu.DashboardItem />
      <Divider sx={{ mb: 2, width: '100%', borderStyle: 'dashed' }} />
      {hasQuestionnairePermissions() && (
        <Submenu text="Questionnaires" icon={<ForumIcon />}>
          {permissions.includes(QuestionnaireRoles.Questionnaire_CanView) && (
            <Menu.ResourceItem name="questionnaires" />
          )}
          {permissions.includes(QuestionRoles.Question_CanView) && (
            <Menu.ResourceItem name="questions" />
          )}
        </Submenu>
      )}

      {hasUserManagementPermissions() && (
        <Submenu text="User Management" icon={<ManageAccountsIcon />}>
          {permissions.includes(UserRoles.User_CanView) && <Menu.ResourceItem name="users" />}
          {permissions.includes(TeamRoles.Team_CanView) && <Menu.ResourceItem name="teams" />}
          {permissions.includes(TagRoles.Tag_CanView) && <Menu.ResourceItem name="tags" />}
        </Submenu>
      )}
    </Menu>
  );
};
