// src/pages/activities/CreateActivity/LocationDetails/LocationDetails.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './LocationDetails.css';

const LocationDetails: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="location-details-container">
      <div className="card location-details-card">
        <div className="card-header">Location Details</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="location.address">Address</label>
            <input id="location.address" name="location.address" type="text" onChange={handleChange} onBlur={handleBlur} value={values.location.address} className="form-control" />
            {touched.location?.address && errors.location?.address && <div className="text-danger">{errors.location.address}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="metroStation">Nearest Metro Station</label>
            <input id="metroStation" name="metroStation" type="text" onChange={handleChange} onBlur={handleBlur} value={values.metroStation} className="form-control" />
            {touched.metroStation && errors.metroStation && <div className="text-danger">{errors.metroStation}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="isOnline">Online Activity</label>
            <input id="isOnline" name="isOnline" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.isOnline} />
          </div>
          <div className="form-group">
            <label htmlFor="addressOnlyForAttendees">Address Only For Attendees</label>
            <input id="addressOnlyForAttendees" name="addressOnlyForAttendees" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.addressOnlyForAttendees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
