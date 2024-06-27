import React from 'react';
import './PostJob.css';

const PostJob: React.FC = () => {
  return (
    <div className="post-job-container">
      <h3>Publish Your Job Offer</h3>
      <p>Reach millions of people with your job posting</p>
      <button className="post-job-button">Post a Job</button>
    </div>
  );
};

export default PostJob;
