import React from 'react';
import { useOutletContext } from 'react-router-dom';

interface User {
  bio?: string;
  experience?: string[];
  education?: string[];
  hobbies?: string[];
}

const BioSection: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();

  return (
    <div>
      <h2>Bio</h2>
      <p>{user.bio}</p>
      <h3>Experience</h3>
      <ul>{user.experience?.map((exp, index) => <li key={index}>{exp}</li>)}</ul>
      <h3>Education</h3>
      <ul>{user.education?.map((edu, index) => <li key={index}>{edu}</li>)}</ul>
      <h3>Hobbies</h3>
      <ul>{user.hobbies?.map((hobby, index) => <li key={index}>{hobby}</li>)}</ul>
    </div>
  );
};

export default BioSection;
