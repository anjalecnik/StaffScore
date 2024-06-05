import { Tree, TreeNode } from 'react-organizational-chart';
import { ITeam } from '../../../../types/ITeam';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IUser } from '../../../../types/IUser';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';

interface OrgChartProps {
  record: ITeam;
}

export const OrganizationChart = ({ record }: OrgChartProps) => {
  return (
    <Tree label={<CardTemplate user={record.teamLeader} />}>
      {record.members.map(member => (
        <TreeNode key={member.id} label={<CardTemplate user={member} />} />
      ))}
    </Tree>
  );
};

interface CardTemplateProps {
  user: IUser;
}

const CardTemplate = ({ user }: CardTemplateProps) => {
  const navigate = useNavigate();

  const handleShowButtonClick = () => {
    navigate(`/users/${user.id}/show`);
  };

  const handleQuestionnaireButtonClick = () => {
    //TODO: navigate to questionnaire
  };

  return (
    <Card key={user.id}>
      <CardContent>
        <Box display="flex" justifyContent="center">
          <Avatar src={user?.photoUrl} />
        </Box>
        <Typography variant="h5" component="div">
          {user?.displayName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {user?.email}
        </Typography>
      </CardContent>
      <CardActions>
        <Box display="flex" justifyContent="center" width="100%">
          <Button startIcon={<AssignmentIndIcon />} onClick={handleShowButtonClick} />
          <Button startIcon={<QuizIcon />} onClick={handleQuestionnaireButtonClick} />
        </Box>
      </CardActions>
    </Card>
  );
};
