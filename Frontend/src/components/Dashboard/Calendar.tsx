import { useState } from 'react';
import { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import ErrorIcon from '@mui/icons-material/Error';

const markedMonths = [2, 5, 8, 11];

export const Calendar = () => {
  const [highlightedDays] = useState([15]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        views={['month', 'day']}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay
        }}
        slotProps={{
          day: {
            highlightedDays
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        }}
        readOnly
        sx={{ color: 'secondary.main', paddingLeft: '34px' }}
      />
    </LocalizationProvider>
  );
};

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isMarkedMonth = markedMonths.includes(day.month());
  const isSelected = !outsideCurrentMonth && isMarkedMonth && highlightedDays.includes(day.date());

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <ErrorIcon fontSize="small" color="primary" /> : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default Calendar;
