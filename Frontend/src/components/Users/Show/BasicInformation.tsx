import { useRecordContext } from 'react-admin';
import { IUser } from '../../../types/IUser';
import { Typography, useMediaQuery, Theme, Box } from '@mui/material';
import './../../../assets/details.css';

export const BasicInformation = () => {
  const record = useRecordContext<IUser>();
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  let recordFullAddress = '/';
  if (record.address && record.zipcode && record.city)
    recordFullAddress = record?.address + ', ' + record?.zipcode + ' ' + record?.city;

  return (
    <>
      {isSmall ? (
        <div>
          <Typography variant="body1" component="div" gutterBottom>
            Display name: {record.displayName || '/'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {record.email || '/'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Phone number: {record.phoneNumber ? record.phoneNumber : '/'}
          </Typography>

          {record.address ? (
            <Box mt={3}>
              <Typography variant="body1" color="textSecondary">
                Address: {record.address}, {record.city}, {record.zipcode}
              </Typography>
            </Box>
          ) : (
            <Box mt={3}>
              <Typography variant="body1" color="textSecondary">
                Address: /
              </Typography>
            </Box>
          )}

          <Box mt={3}>
            <Typography variant="body1" color="textSecondary">
              Employment date: {record.employmentDate?.toLocaleString() || '/'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Card identifier: {record.cardIdentifier || '/'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Time&Space identifier: {record.timeSpaceIdentifier || '/'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Teamwork identifier: {record.teamworkIdentifier || '/'}
            </Typography>
          </Box>
        </div>
      ) : (
        <div>
          <ul className="label-value-list">
            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Display name
                </Typography>
              </div>
              <div className="value">{record.displayName || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Email
                </Typography>
              </div>
              <div className="value">{record.email || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Phone number
                </Typography>
              </div>
              <div className="value"> {record.phoneNumber || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Address
                </Typography>
              </div>
              <div className="value">{recordFullAddress}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Employment date
                </Typography>
              </div>
              <div className="value">{record.employmentDate?.toLocaleString() || '/'}</div>
            </li>
          </ul>

          <ul className="label-value-list-2">
            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Employment date
                </Typography>
              </div>
              <div className="value">{record.employmentDate?.toLocaleString() || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Card identifier
                </Typography>
              </div>
              <div className="value">{record.cardIdentifier || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Time&Space identifier
                </Typography>
              </div>
              <div className="value"> {record.timeSpaceIdentifier || '/'}</div>
            </li>

            <li className="label-value-item">
              <div className="label">
                <Typography variant="body1" color="textSecondary">
                  Teamwork identifier
                </Typography>
              </div>
              <div className="value">{record.teamworkIdentifier || '/'}</div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
