import { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import QuizIcon from '@mui/icons-material/Quiz';
import { API_URL } from '../../../../dataProvider';
import { ITeam } from '../../../../types/ITeam';
import { IUser } from '../../../../types/IUser';
import { IQuestion } from '../../../../types/IQuestion';

interface OrgChartProps {
  record: ITeam;
}

export interface IQuestionnaire {
  id: string;
  name: string;
  lastModified: {
    seconds: number;
    nanoseconds: number;
  };
  questionWeights: Record<string, number>;
  questions: string[] | IQuestion[];
}

const fetchQuestionnaires = async (): Promise<IQuestionnaire[]> => {
  const response = await fetch(`${API_URL}/questionnaires`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.data;
};

export const OrganizationChart = ({ record }: OrgChartProps) => {
  return (
    <Tree label={<CardTemplate user={record.teamLeader} isTeamLeader={true} />}>
      {record.members.map(member => (
        <TreeNode key={member.id} label={<CardTemplate user={member} />} />
      ))}
    </Tree>
  );
};

interface CardTemplateProps {
  user: IUser;
  isTeamLeader?: boolean;
}

const CardTemplate = ({ user, isTeamLeader = false }: CardTemplateProps) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleShowButtonClick = () => {
    navigate(`/users/${user.id}/show`);
  };

  const handleQuestionnaireButtonClick = () => {
    setDialogOpen(true);
  };

  const handleQuestionnaireSelect = (questionnaireId: string) => {
    setDialogOpen(false);
    navigate(`/solve/${questionnaireId}/user/${user.id}`);
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
          {!isTeamLeader && (
            <Button startIcon={<QuizIcon />} onClick={handleQuestionnaireButtonClick} />
          )}
        </Box>
      </CardActions>
      {dialogOpen && (
        <QuestionnaireDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSelect={handleQuestionnaireSelect}
        />
      )}
    </Card>
  );
};

interface QuestionnaireDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (questionnaireId: string) => void;
}

const QuestionnaireDialog = ({ open, onClose, onSelect }: QuestionnaireDialogProps) => {
  const { data, error, isLoading } = useQuery('questionnaires', fetchQuestionnaires, {
    enabled: open
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questionnaires</div>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Questionnaire</DialogTitle>
      <DialogContent>
        <List>
          {data?.map(questionnaire => (
            <ListItem button key={questionnaire.id} onClick={() => onSelect(questionnaire.id)}>
              <ListItemText primary={questionnaire.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
