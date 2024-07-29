// src/pages/activities/CreateActivity/NotificationAndManagement/NotificationAndManagement.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './NotificationAndManagement.css';

const NotificationAndManagement: React.FC = () => {
  const { values, handleChange, handleBlur, setFieldValue, touched, errors } = useFormikContext<IActivity>();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFieldValue(name, checked);
  };

  return (
    <div className="notification-management-container">
      <div className="card notification-management-card">
        <div className="card-header">Notification and Management</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="emailNotification">Email Notification</label>
            <input id="emailNotification" name="emailNotification" type="checkbox" onChange={handleCheckboxChange} onBlur={handleBlur} checked={values.emailNotification} />
          </div>
          <div className="form-group">
            <label htmlFor="pushNotification">Push Notification</label>
            <input id="pushNotification" name="pushNotification" type="checkbox" onChange={handleCheckboxChange} onBlur={handleBlur} checked={values.pushNotification} />
          </div>
          <div className="form-group">
            <label htmlFor="smsNotification">SMS Notification</label>
            <input id="smsNotification" name="smsNotification" type="checkbox" onChange={handleCheckboxChange} onBlur={handleBlur} checked={values.smsNotification} />
          </div>
          <div className="form-group">
            <label htmlFor="manageParityIsSelected">Manage Parity</label>
            <input id="manageParityIsSelected" name="manageParityIsSelected" type="checkbox" onChange={handleCheckboxChange} onBlur={handleBlur} checked={values.manageParityIsSelected} />
          </div>
          {values.manageParityIsSelected && (
            <>
              <div className="form-group">
                <label htmlFor="manageParityMalePercentage">Male Parity Percentage</label>
                <input
                  id="manageParityMalePercentage"
                  name="manageParityMalePercentage"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.manageParityMalePercentage}
                  className="form-control"
                />
                {touched.manageParityMalePercentage && errors.manageParityMalePercentage && <div className="text-danger">{errors.manageParityMalePercentage}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="manageParityInfoLine">Parity Info Line</label>
                <input id="manageParityInfoLine" name="manageParityInfoLine" type="text" onChange={handleChange} onBlur={handleBlur} value={values.manageParityInfoLine} className="form-control" />
                {touched.manageParityInfoLine && errors.manageParityInfoLine && <div className="text-danger">{errors.manageParityInfoLine}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="manageParityFriendsAllowed">Friends Allowed by Parity</label>
                <input
                  id="manageParityFriendsAllowed"
                  name="manageParityFriendsAllowed"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.manageParityFriendsAllowed}
                  className="form-control"
                />
                {touched.manageParityFriendsAllowed && errors.manageParityFriendsAllowed && <div className="text-danger">{errors.manageParityFriendsAllowed}</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationAndManagement;
