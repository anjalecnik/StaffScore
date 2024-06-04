import { List, useMediaQuery, Theme, Box, Link } from '@mui/material';
import {
  List as RaList,
  SimpleList,
  Datagrid,
  TextField,
  CreateButton,
  ExportButton,
  TopToolbar,
  SortButton
} from 'react-admin';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export const QuestionList = () => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  return (
    <RaList actions={<QuestionListActions />}>
      <Box display="flex" alignItems="center">
        <Box ml={2} mr={2} display="flex">
          <HelpCenterIcon color="disabled" fontSize="large" />
        </Box>
        <Link underline="none" variant="h5" color="textSecondary">
          <h5>Questions</h5>
        </Link>
      </Box>

      <List>
        {isSmall ? (
          <SimpleList
            primaryText={record => record.question}
            secondaryText={record => record.type}
          />
        ) : (
          <Datagrid rowClick="show">
            <TextField source="question" />
            <TextField source="type" />
          </Datagrid>
        )}
      </List>
    </RaList>
  );
};

const QuestionListActions = () => (
  <TopToolbar>
    <SortButton fields={['question', 'type']} />
    <ExportButton />
    <CreateButton variant="contained" label="New Question" sx={{ marginLeft: 2 }} />
  </TopToolbar>
);
