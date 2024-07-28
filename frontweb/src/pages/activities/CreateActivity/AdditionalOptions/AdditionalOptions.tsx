// src/pages/activities/CreateActivity/AdditionalOptions/AdditionalOptions.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './AdditionalOptions.css';

const AdditionalOptions: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="additional-options-container">
      <div className="card additional-options-card">
        <div className="card-header">Additional Options</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="buyTicketsLink">Buy Tickets Link</label>
            <input id="buyTicketsLink" name="buyTicketsLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.buyTicketsLink ?? ''} className="form-control" />
            {touched.buyTicketsLink && errors.buyTicketsLink && <div className="text-danger">{errors.buyTicketsLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="friendsNumber">Number of Friends</label>
            <input id="friendsNumber" name="friendsNumber" type="number" onChange={handleChange} onBlur={handleBlur} value={values.friendsNumber ?? ''} className="form-control" />
            {touched.friendsNumber && errors.friendsNumber && <div className="text-danger">{errors.friendsNumber}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="notifyPreviousAttendees">Notify Previous Attendees</label>
            <input
              id="notifyPreviousAttendees"
              name="notifyPreviousAttendees"
              type="checkbox"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values.notifyPreviousAttendees}
              className="form-check-input"
            />
            <label htmlFor="notifyPreviousAttendees" className="form-check-label">
              Notify Previous Attendees
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="inviteMore">Invite More</label>
            <input id="inviteMore" name="inviteMore" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.inviteMore} className="form-check-input" />
            <label htmlFor="inviteMore" className="form-check-label">
              Invite More
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="requestCoOrga">Request Co-Organization</label>
            <input id="requestCoOrga" name="requestCoOrga" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.requestCoOrga} className="form-check-input" />
            <label htmlFor="requestCoOrga" className="form-check-label">
              Request Co-Organization
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalOptions;
