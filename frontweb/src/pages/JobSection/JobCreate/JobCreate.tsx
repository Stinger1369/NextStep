// frontweb/src/pages/JobSection/JobCreate.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createJob } from '../../../redux/features/jobs/jobSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../redux/store';

const JobCreate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      requirements: '',
      company: '',
      location: '',
      salary: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      requirements: Yup.string().required('Requirements are required'),
      company: Yup.string().required('Company ID is required'),
      location: Yup.string().required('Location is required'),
      salary: Yup.number()
        .required('Salary is required')
        .positive('Salary must be a positive number')
    }),
    onSubmit: async (values) => {
      const requirementsArray = values.requirements.split(',').map((req) => req.trim());
      await dispatch(
        createJob({
          title: values.title,
          description: values.description,
          requirements: requirementsArray,
          company: values.company,
          location: values.location,
          salary: Number(values.salary)
        })
      );
      navigate('/jobs');
    }
  });

  return (
    <div>
      <h1>Create Job</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-danger">{formik.errors.title}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-danger">{formik.errors.description}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="requirements">Requirements (comma separated)</label>
          <input
            id="requirements"
            type="text"
            name="requirements"
            value={formik.values.requirements}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.requirements && formik.errors.requirements ? (
            <div className="text-danger">{formik.errors.requirements}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="company">Company ID</label>
          <input
            id="company"
            type="text"
            name="company"
            value={formik.values.company}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.company && formik.errors.company ? (
            <div className="text-danger">{formik.errors.company}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.location && formik.errors.location ? (
            <div className="text-danger">{formik.errors.location}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.salary && formik.errors.salary ? (
            <div className="text-danger">{formik.errors.salary}</div>
          ) : null}
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default JobCreate;
