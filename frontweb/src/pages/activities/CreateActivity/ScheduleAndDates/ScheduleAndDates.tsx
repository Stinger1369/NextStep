// src/pages/activities/CreateActivity/ScheduleAndDates/ScheduleAndDates.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './ScheduleAndDates.css';

const ScheduleAndDates: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="schedule-dates-container">
      <div className="card schedule-dates-card">
        <div className="card-header">Schedule and Dates</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.date}
              className="form-control"
            />
            {touched.date && errors.date && <div className="text-danger">{errors.date}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="startTime.hour">Start Time</label>
            <input
              id="startTime.hour"
              name="startTime.hour"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.startTime.hour}
              className="form-control"
            />
            <input
              id="startTime.minute"
              name="startTime.minute"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.startTime.minute}
              className="form-control"
            />
            {touched.startTime && errors.startTime && (
              <div className="text-danger">
                {errors.startTime.hour} {errors.startTime.minute}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="endTime.hour">End Time</label>
            <input
              id="endTime.hour"
              name="endTime.hour"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.endTime.hour}
              className="form-control"
            />
            <input
              id="endTime.minute"
              name="endTime.minute"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.endTime.minute}
              className="form-control"
            />
            {touched.endTime && errors.endTime && (
              <div className="text-danger">
                {errors.endTime.hour} {errors.endTime.minute}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="repeatEvent">Repeat Event</label>
            <input
              id="repeatEvent"
              name="repeatEvent"
              type="checkbox"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values.repeatEvent}
            />
          </div>
          {values.repeatEvent && (
            <>
              <div className="form-group">
                <label htmlFor="repeatEventFrequency">Repeat Frequency</label>
                <input
                  id="repeatEventFrequency"
                  name="repeatEventFrequency"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.repeatEventFrequency ?? ''}
                  className="form-control"
                />
                {touched.repeatEventFrequency && errors.repeatEventFrequency && (
                  <div className="text-danger">{errors.repeatEventFrequency}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="repeatEventDays">Repeat Days</label>
                <input
                  id="repeatEventDays"
                  name="repeatEventDays"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={
                    Array.isArray(values.repeatEventDays) ? values.repeatEventDays.join(', ') : ''
                  }
                  className="form-control"
                />
                {touched.repeatEventDays && errors.repeatEventDays && (
                  <div className="text-danger">{errors.repeatEventDays}</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleAndDates;
