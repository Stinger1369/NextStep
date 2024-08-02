// frontweb/src/pages/JobSection/JobEdit/JobEdit.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchJobById, updateJob } from '../../../redux/features/jobs/jobSlice';
import { RootState, AppDispatch } from '../../../redux/store';

interface Params {
  id: string;
  [key: string]: string | undefined;
}

const JobEdit: React.FC = () => {
  const { id } = useParams<Params>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const job = useSelector((state: RootState) => state.jobs.jobs.find((job) => job.id === id));

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [dispatch, id]);

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
      if (id) {
        const requirementsArray = values.requirements.split(',').map((req) => req.trim());
        await dispatch(
          updateJob({
            id,
            jobData: {
              title: values.title,
              description: values.description,
              requirements: requirementsArray,
              company: values.company,
              location: values.location,
              salary: Number(values.salary)
            }
          })
        );
        navigate('/jobs');
      }
    }
  });

  useEffect(() => {
    if (job) {
      formik.setValues({
        title: job.title,
        description: job.description,
        requirements: job.requirements.join(', '),
        company: job.company,
        location: job.location,
        salary: job.salary.toString()
      });
    }
  }, [job]);

  if (!job) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Job</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
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
            name="requirements"
            type="text"
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
            name="company"
            type="text"
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
            name="location"
            type="text"
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
            name="salary"
            type="number"
            value={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.salary && formik.errors.salary ? (
            <div className="text-danger">{formik.errors.salary}</div>
          ) : null}
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default JobEdit;
