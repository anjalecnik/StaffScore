import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CardHeader, CardMedia, Card } from '@mui/material';
import { IDashboardStatistic } from '../../shared/types/IDashboardStatistic';

export const Statistics = (props: { data?: IDashboardStatistic[] }) => {
  return (
    <>
      <Card
        sx={{
          minHeight: 352,
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          '& a': {
            textDecoration: 'none',
            color: 'inherit'
          }
        }}
      >
        {props.data?.length ? (
          <>
            <CardHeader title="Average User Scores by Quarterly Periods" />
            <AreaChart
              width={630}
              height={250}
              data={props.data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#53A9EC" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#53A9EC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis dataKey="avgEv" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="avgEv"
                stroke="#53A9EC"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </>
        ) : (
          <>
            <CardHeader title="Average User Scores by Quarterly Periods" />
            <CardMedia
              image="https://user-images.githubusercontent.com/15953522/49493502-63e21d00-f882-11e8-911c-1d7655f393e8.png"
              sx={{ height: 250.5, width: 480.5, margin: 'auto' }}
            />
          </>
        )}
      </Card>
    </>
  );
};
