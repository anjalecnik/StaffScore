import { Box, Card, Typography } from '@mui/material';

const Welcome = () => {
  return (
    <Card
      sx={{
        background: theme =>
          `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        color: theme => theme.palette.primary.contrastText,
        padding: '20px',
        marginTop: 2,
        marginBottom: '1em'
      }}
    >
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            Welcome to StaffScore
          </Typography>
          <Box maxWidth="40em">
            <Typography variant="body1" component="p" gutterBottom>
              Welcome to StaffScore, a web application designed to help team leaders track and
              evaluate the performance of their team members effortlessly.
            </Typography>
          </Box>
        </Box>
        <Box
          display={{ xs: 'none', sm: 'none', md: 'block' }}
          sx={{
            background: `url(./../../public/welcomeImage.jpg) top right / cover`,
            marginLeft: 'auto',
            marginRight: '15px',
            borderRadius: '5px'
          }}
          width="8em"
          height="8em"
          overflow="hidden"
        />
      </Box>
    </Card>
  );
};

export default Welcome;
