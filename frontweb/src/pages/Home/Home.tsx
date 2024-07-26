import React from 'react';
import LoginComponent from '../LoginPages/LoginComponent';
import HomeJob from './PostScreen/PostNews';
import PostJob from './PostJob/PostJob';
import SkillDevelopment from './SkillDevelopment/SkillDevelopment';
import EventsActivities from './EventsActivities/EventsActivities';
import Testimonials from './Testimonials/Testimonials';
import './Home.css';

const Home = () => {
  return (
    <div className="container-fluid home-container">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <LoginComponent />
          </div>
          <div className="card">
            <SkillDevelopment />
          </div>
          <div className="card">
            <EventsActivities />
          </div>
        </div>
        <div className="col-md-6">
          <HomeJob />
        </div>
        <div className="col-md-3">
          <div className="card">
            <PostJob />
          </div>
          <div className="card">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
