// src/pages/activities/CreateActivity/CreateActivity.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { createActivity } from '../../../redux/features/activity/activitySlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IActivity } from '../../../types';

const CreateActivity: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formik = useFormik<IActivity>({
    initialValues: {
      title: '',
      description: '',
      date: '',
      startTime: { hour: 0, minute: 0 },
      endTime: { hour: 0, minute: 0 },
      location: { address: '', latitude: 0, longitude: 0 },
      isOnline: false
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      date: Yup.date().required('Required'),
      startTime: Yup.object().shape({
        hour: Yup.number().required('Required').min(0).max(23),
        minute: Yup.number().required('Required').min(0).max(59)
      }),
      endTime: Yup.object().shape({
        hour: Yup.number().required('Required').min(0).max(23),
        minute: Yup.number().required('Required').min(0).max(59)
      }),
      location: Yup.object().shape({
        address: Yup.string().required('Required'),
        latitude: Yup.number().required('Required'),
        longitude: Yup.number().required('Required')
      })
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(createActivity(values)).unwrap();
        formik.resetForm();
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Failed to create activity');
        }
      }
    }
  });

  return (
    <div>
      <h1>Create Activity</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title} />
          {formik.touched.title && formik.errors.title ? <div>{formik.errors.title}</div> : null}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} />
          {formik.touched.description && formik.errors.description ? <div>{formik.errors.description}</div> : null}
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.date} />
          {formik.touched.date && formik.errors.date ? <div>{formik.errors.date}</div> : null}
        </div>
        <div>
          <label htmlFor="startTime.hour">Start Time</label>
          <input id="startTime.hour" name="startTime.hour" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.startTime.hour} />
          <input id="startTime.minute" name="startTime.minute" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.startTime.minute} />
          {formik.touched.startTime && formik.errors.startTime ? (
            <div>
              {formik.errors.startTime.hour} {formik.errors.startTime.minute}
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="endTime.hour">End Time</label>
          <input id="endTime.hour" name="endTime.hour" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.endTime.hour} />
          <input id="endTime.minute" name="endTime.minute" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.endTime.minute} />
          {formik.touched.endTime && formik.errors.endTime ? (
            <div>
              {formik.errors.endTime.hour} {formik.errors.endTime.minute}
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="location.address">Address</label>
          <input id="location.address" name="location.address" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.location.address} />
          {formik.touched.location?.address && formik.errors.location?.address ? <div>{formik.errors.location.address}</div> : null}
        </div>
        <div>
          <label htmlFor="location.latitude">Latitude</label>
          <input id="location.latitude" name="location.latitude" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.location.latitude} />
          <label htmlFor="location.longitude">Longitude</label>
          <input id="location.longitude" name="location.longitude" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.location.longitude} />
          {formik.touched.location?.latitude && formik.errors.location?.latitude ? <div>{formik.errors.location.latitude}</div> : null}
          {formik.touched.location?.longitude && formik.errors.location?.longitude ? <div>{formik.errors.location.longitude}</div> : null}
        </div>
        <div>
          <label>
            <input type="checkbox" name="isOnline" checked={formik.values.isOnline} onChange={formik.handleChange} />
            Online Activity
          </label>
        </div>
        <button type="submit">Submit</button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CreateActivity;
