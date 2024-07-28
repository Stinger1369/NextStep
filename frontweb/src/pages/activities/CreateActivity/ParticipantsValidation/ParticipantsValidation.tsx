// src/pages/activities/CreateActivity/ParticipantsValidation/ParticipantsValidation.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './ParticipantsValidation.css';

const ParticipantsValidation: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="participants-validation-container">
      <div className="card participants-validation-card">
        <div className="card-header">Participants Validation</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="ageRestriction">Age Restriction</label>
            <input id="ageRestriction" name="ageRestriction" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.ageRestriction} className="form-check-input" />
            <label htmlFor="ageRestriction" className="form-check-label">
              Age Restriction
            </label>
          </div>
          {values.ageRestriction && (
            <div className="form-group">
              <label htmlFor="ages">Allowed Ages</label>
              <input id="ages" name="ages" type="text" onChange={handleChange} onBlur={handleBlur} value={Array.isArray(values.ages) ? values.ages.join(', ') : ''} className="form-control" />
              {touched.ages && errors.ages && <div className="text-danger">{errors.ages}</div>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="attendeesValidation">Attendees Validation</label>
            <input id="attendeesValidation" name="attendeesValidation" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.attendeesValidation} className="form-check-input" />
            <label htmlFor="attendeesValidation" className="form-check-label">
              Attendees Validation
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="attendeeLimit">Attendee Limit</label>
            <input id="attendeeLimit" name="attendeeLimit" type="number" onChange={handleChange} onBlur={handleBlur} value={values.attendeeLimit ?? ''} className="form-control" />
            {touched.attendeeLimit && errors.attendeeLimit && <div className="text-danger">{errors.attendeeLimit}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="allowGuests">Allow Guests</label>
            <input id="allowGuests" name="allowGuests" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.allowGuests} className="form-check-input" />
            <label htmlFor="allowGuests" className="form-check-label">
              Allow Guests
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsValidation;
