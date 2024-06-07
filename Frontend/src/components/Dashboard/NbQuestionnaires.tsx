import AssignmentIcon from '@mui/icons-material/Assignment';
import { CardWithIcon } from './CardWithIcon';

interface Props {
  value?: string;
}

export const NbQuestionnaires = (props: Props) => {
  const { value } = props;
  return (
    <CardWithIcon
      to="/questionnaires"
      icon={AssignmentIcon}
      title="Unique Questionnaires"
      subtitle={value}
    />
  );
};
