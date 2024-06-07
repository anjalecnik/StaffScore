import { CardWithIcon } from './CardWithIcon';
import EqualizerIcon from '@mui/icons-material/Equalizer';

interface Props {
  value?: string;
}

export const AvgEvaluation = (props: Props) => {
  const { value } = props;
  return (
    <CardWithIcon to="/users" icon={EqualizerIcon} title="Average Evaluation" subtitle={value} />
  );
};
