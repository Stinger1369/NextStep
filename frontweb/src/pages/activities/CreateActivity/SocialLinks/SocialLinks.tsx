// src/pages/activities/CreateActivity/SocialLinks/SocialLinks.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './SocialLinks.css';

const SocialLinks: React.FC = () => {
  const { values, handleChange, handleBlur, touched, errors } = useFormikContext<IActivity>();

  return (
    <div className="social-links-container">
      <div className="card social-links-card">
        <div className="card-header">Social Links</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="whatsappLink">WhatsApp Link</label>
            <input id="whatsappLink" name="whatsappLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.whatsappLink ?? ''} className="form-control" />
            {touched.whatsappLink && errors.whatsappLink && <div className="text-danger">{errors.whatsappLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="fbPageLink">Facebook Page Link</label>
            <input id="fbPageLink" name="fbPageLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.fbPageLink ?? ''} className="form-control" />
            {touched.fbPageLink && errors.fbPageLink && <div className="text-danger">{errors.fbPageLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="fbGroupLink">Facebook Group Link</label>
            <input id="fbGroupLink" name="fbGroupLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.fbGroupLink ?? ''} className="form-control" />
            {touched.fbGroupLink && errors.fbGroupLink && <div className="text-danger">{errors.fbGroupLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="meetupLink">Meetup Link</label>
            <input id="meetupLink" name="meetupLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.meetupLink ?? ''} className="form-control" />
            {touched.meetupLink && errors.meetupLink && <div className="text-danger">{errors.meetupLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="telegramLink">Telegram Link</label>
            <input id="telegramLink" name="telegramLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.telegramLink ?? ''} className="form-control" />
            {touched.telegramLink && errors.telegramLink && <div className="text-danger">{errors.telegramLink}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="otherLink">Other Links</label>
            <input id="otherLink" name="otherLink" type="text" onChange={handleChange} onBlur={handleBlur} value={values.otherLink ?? ''} className="form-control" />
            {touched.otherLink && errors.otherLink && <div className="text-danger">{errors.otherLink}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
