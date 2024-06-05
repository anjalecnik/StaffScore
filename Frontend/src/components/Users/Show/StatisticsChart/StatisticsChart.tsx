import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IStatistic } from '../../../../types/IStatistic';
import { useNavigate } from 'react-router-dom';
import { CardHeader, CardMedia } from '@mui/material';
import { DataKey } from 'recharts/types/util/types';

interface StatisticsChartProps {
  data: IStatistic[];
}

export const StatisticsChart = ({ data }: StatisticsChartProps) => {
  const navigate = useNavigate();

  const colors = ['#ff7f50', '#8884d8', '#82ca9d', '#9acd32', '#ffdab9', '#2f4f4f', '#daa520'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLegendIconClick = (data?: DataKey<any>) => {
    if (data)
      //TODO: Navigate to questionnaire details/show
      navigate('/');
  };

  return (
    <>
      {data?.length ? (
        <>
          <CardHeader
            title="Average Quarterly Scores Based on Questionnaire Evaluations"
            titleTypographyProps={{ variant: 'subtitle1' }}
          />
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {colors.map((color, index) => (
                <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend onClick={data => onLegendIconClick(data?.dataKey)} />
            {data[0]
              ? Object.keys(data[0]).map((key, index) => {
                  if (key !== 'name') {
                    if (key === 'avgEv') {
                      return (
                        <Area
                          key={index}
                          type="monotone"
                          dataKey={key}
                          stroke="red"
                          fillOpacity={0}
                          connectNulls
                          name="Average"
                        />
                      );
                    } else {
                      const color = colors[index % colors.length];
                      return (
                        <Area
                          key={index}
                          type="monotone"
                          dataKey={key}
                          stroke={color}
                          fillOpacity={1}
                          fill={`url(#color${index})`}
                          connectNulls
                          name="Questionnaire "
                        />
                      );
                    }
                  }
                  return null;
                })
              : ''}
          </AreaChart>
        </>
      ) : (
        <CardMedia
          image="https://user-images.githubusercontent.com/15953522/49493502-63e21d00-f882-11e8-911c-1d7655f393e8.png"
          sx={{ height: 241.5, width: 465.5 }}
        />
      )}
    </>
  );
};
