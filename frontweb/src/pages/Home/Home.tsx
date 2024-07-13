import React from 'react';
import LoginComponent from '../LoginPages/LoginComponent';
import HomeJob from './HomeJob/PostNews';
import PostJob from './PostJob/PostJob';
import SkillDevelopment from './SkillDevelopment/SkillDevelopment';
import EventsActivities from './EventsActivities/EventsActivities';
import Testimonials from './Testimonials/Testimonials';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <div className="cards-container">
        <div className="card home-login-container">
          <LoginComponent />
        </div>
        <div className="card home-job-container">
          <HomeJob />
        </div>
        <div className="card post-job-container">
          <PostJob />
        </div>
        <div className="card skill-development-container">
          <SkillDevelopment />
        </div>
        <div className="card events-activities-container">
          <EventsActivities />
        </div>
        <div className="card testimonials-container">
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default Home;
