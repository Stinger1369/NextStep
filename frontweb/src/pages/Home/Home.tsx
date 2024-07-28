import React from 'react';
import { Link } from 'react-router-dom';
import LoginComponent from '../LoginPages/LoginComponent';
import HomeJob from './PostScreen/PostNews';
import PostJob from './PostJob/PostJob';
import EventsActivities from './EventsActivities/EventsActivities';
import Testimonials from './Testimonials/Testimonials';
import './Home.css';

const Home = () => {
  return (
    <div className="container-fluid home-container">
      <div className="row">
        <div className="col-md-3 home-sidebar">
          <div className="home-card">
            <LoginComponent />
          </div>
          <div className="home-card">
            <Link to="/skill-development" className="skill-development-link">
              <h3>Skill Development</h3>
              <p>Improve your skills with our online courses</p>
            </Link>
          </div>
          <div className="home-card">
            <EventsActivities />
          </div>
        </div>
        <div className="col-md-6 home-main-content">
          <HomeJob />
        </div>
        <div className="col-md-3 home-sidebar">
          <div className="home-card">
            <PostJob />
          </div>
          <div className="home-card">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
