import SummarizeIcon from '@mui/icons-material/Summarize';
import { CardWithIcon } from './CardWithIcon';

interface Props {
  value?: string;
}

export const NbReports = (props: Props) => {
  const { value } = props;
  return (
    <CardWithIcon to="/users" icon={SummarizeIcon} title="Questionnaire Reports" subtitle={value} />
  );
};
