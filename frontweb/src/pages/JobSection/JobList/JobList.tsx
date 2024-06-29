// frontweb/src/pages/JobSection/JobList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../../redux/features/jobs/jobSlice';
import { RootState, AppDispatch } from '../../../redux/store';
import { Link } from 'react-router-dom';

const JobList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const loading = useSelector((state: RootState) => state.jobs.loading);
  const error = useSelector((state: RootState) => state.jobs.error);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Job Listings</h1>
      <Link to="/jobs/create">Create New Job</Link>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <Link to={`/jobs/edit/${job.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
