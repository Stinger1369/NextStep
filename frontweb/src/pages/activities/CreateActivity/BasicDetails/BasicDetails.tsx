// src/pages/activities/CreateActivity/BasicDetails/BasicDetails.tsx
import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './BasicDetails.css';

const BasicDetails: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  return (
    <div className="basic-details-container">
      <div className="card basic-details-card">
        <div className="card-header">Basic Details</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" onChange={handleChange} onBlur={handleBlur} value={values.title} className="form-control" />
            {touched.title && errors.title && <div className="error">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" onChange={handleChange} onBlur={handleBlur} value={values.description} className="form-control" />
            {touched.description && errors.description && <div className="error">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="createAtivityType">Activity Type</label>
            <input id="createAtivityType" name="createAtivityType" type="text" onChange={handleChange} onBlur={handleBlur} value={values.createAtivityType} className="form-control" />
            {touched.createAtivityType && errors.createAtivityType && <div className="error">{errors.createAtivityType}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="activityImage">Activity Image URL</label>
            <input id="activityImage" name="activityImage" type="text" onChange={handleChange} onBlur={handleBlur} value={values.activityImage} className="form-control" />
            {touched.activityImage && errors.activityImage && <div className="error">{errors.activityImage}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input id="author" name="author" type="text" value={user ? `${user.firstName} ${user.lastName}` : 'Loading...'} className="form-control" disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
