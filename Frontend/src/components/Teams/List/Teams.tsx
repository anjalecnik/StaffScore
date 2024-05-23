import { List } from 'react-admin';
import { ImageList } from './GridList';

export const TeamList = () => {
  //const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  return (
    // <List>
    //   {isSmall ? (
    //     <SimpleList
    //       primaryText={record => record.name}
    //       tertiaryText={record => record.members.length}
    //     />
    //   ) : (
    //     <Datagrid rowClick="show">
    //       <TextField source="name" />
    //       <TextField source="description" />
    //       <TeamsUrlField source="members" />
    //     </Datagrid>
    //   )}
    // </List>

    <List>
      <ImageList />
    </List>
  );
};
