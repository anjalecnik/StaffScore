import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

type SubmenuProps = {
  text: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const Submenu = ({ text, icon, children }: SubmenuProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMoreIcon />}</ListItemIcon>
      </MenuItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          '& .RaMenuItemLink-icon': {
            paddingLeft: 4,
            marginRight: 1
          }
        }}
      >
        {children}
      </Collapse>
    </>
  );
};
