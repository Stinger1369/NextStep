// src/pages/activities/CreateActivity/PriceAndLinks/PriceAndLinks.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './PriceAndLinks.css';

const PriceAndLinks: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="price-and-links-container">
      <div className="card price-and-links-card">
        <div className="card-header">Price and Links</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="hasPrice">Paid Activity</label>
            <input id="hasPrice" name="hasPrice" type="checkbox" onChange={handleChange} onBlur={handleBlur} checked={values.hasPrice} className="form-check-input" />
            <label htmlFor="hasPrice" className="form-check-label">
              Paid Activity
            </label>
          </div>
          {values.hasPrice && (
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" onChange={handleChange} onBlur={handleBlur} value={values.price ?? ''} className="form-control" />
              {touched.price && errors.price && <div className="text-danger">{errors.price}</div>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="ticketLink">Ticket Link</label>
            <input id="ticketLink" name="ticketLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.ticketLink ?? ''} className="form-control" />
            {touched.ticketLink && errors.ticketLink && <div className="text-danger">{errors.ticketLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="infoLine">Info Line</label>
            <input id="infoLine" name="infoLine" type="text" onChange={handleChange} onBlur={handleBlur} value={values.infoLine ?? ''} className="form-control" />
            {touched.infoLine && errors.infoLine && <div className="text-danger">{errors.infoLine}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="howToFind">How to Find</label>
            <input id="howToFind" name="howToFind" type="text" onChange={handleChange} onBlur={handleBlur} value={values.howToFind ?? ''} className="form-control" />
            {touched.howToFind && errors.howToFind && <div className="text-danger">{errors.howToFind}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAndLinks;
