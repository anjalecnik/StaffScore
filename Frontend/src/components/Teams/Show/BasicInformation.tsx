import { useRecordContext } from 'react-admin';
import { Typography, useMediaQuery, Theme } from '@mui/material';
import './../../../assets/details.css';
import { ITeam } from '../../../types/ITeam';

export const BasicInformation = () => {
  const record = useRecordContext<ITeam>();
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  return (
    <>
      {isSmall ? (
        <div>
          <Typography variant="body1" component="div" gutterBottom>
            Name: {record.name || '/'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Description: {record.description || '/'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Team leader: {record.teamLeader.displayName || '/'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            No. of members: {record.members.length || '0'}
          </Typography>
        </div>
      ) : (
        <div>
          <ul className="label-value-list">
            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Name
                </Typography>
              </div>
              <div className="value">{record.name || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Description
                </Typography>
              </div>
              <div className="value">{record.description || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Team leader
                </Typography>
              </div>
              <div className="value"> {record.teamLeader.displayName || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  No. of members
                </Typography>
              </div>
              <div className="value">{record.members.length || '0'}</div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
