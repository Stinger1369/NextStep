// src/pages/activities/CreateActivity/CoOrganizersAndParticipants/CoOrganizersAndParticipants.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './CoOrganizersAndParticipants.css';

const CoOrganizersAndParticipants: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="co-organizers-participants-container">
      <div className="card co-organizers-participants-card">
        <div className="card-header">Co-organizers and Participants</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="coOrganizers">Co-organizers</label>
            <input
              id="coOrganizers"
              name="coOrganizers"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={Array.isArray(values.coOrganizers) ? values.coOrganizers.join(', ') : ''}
              className="form-control"
            />
            {touched.coOrganizers && errors.coOrganizers && <div className="text-danger">{errors.coOrganizers}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="unApprovedUsers">Unapproved Users</label>
            <input
              id="unApprovedUsers"
              name="unApprovedUsers"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={Array.isArray(values.unApprovedUsers) ? values.unApprovedUsers.join(', ') : ''}
              className="form-control"
            />
            {touched.unApprovedUsers && errors.unApprovedUsers && <div className="text-danger">{errors.unApprovedUsers}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="unApprovedCoOrganizers">Unapproved Co-organizers</label>
            <input
              id="unApprovedCoOrganizers"
              name="unApprovedCoOrganizers"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={Array.isArray(values.unApprovedCoOrganizers) ? values.unApprovedCoOrganizers.join(', ') : ''}
              className="form-control"
            />
            {touched.unApprovedCoOrganizers && errors.unApprovedCoOrganizers && <div className="text-danger">{errors.unApprovedCoOrganizers}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="attendees">Attendees</label>
            <input
              id="attendees"
              name="attendees"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={Array.isArray(values.attendees) ? values.attendees.join(', ') : ''}
              className="form-control"
            />
            {touched.attendees && errors.attendees && <div className="text-danger">{errors.attendees}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="waitingList">Waiting List</label>
            <input
              id="waitingList"
              name="waitingList"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={Array.isArray(values.waitingList) ? values.waitingList.join(', ') : ''}
              className="form-control"
            />
            {touched.waitingList && errors.waitingList && <div className="text-danger">{errors.waitingList}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoOrganizersAndParticipants;
