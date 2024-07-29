import React from 'react';
import { Link } from 'react-router-dom';
import LoginComponent from '../LoginPages/LoginComponent';
import HomeJob from './PostScreen/PostNews';
import PostJob from './PostJob/PostJob';
import EventsActivities from './EventsActivities/EventsActivities';
import Testimonials from './Testimonials/Testimonials';
import './Home.css';

const Home = () => {
  React.useEffect(() => {
    console.log('Rendering Home component');
  }, []);

  return (
    <div className="container-fluid home-container">
      <div className="row">
        <div className="col-md-3 home-sidebar">
          <div className="home-component">
            <LoginComponent />
          </div>
          <div className="home-component">
            <Link to="/skill-development" className="skill-development-link">
              <h3>Skill Development</h3>
              <p>Improve your skills with our online courses</p>
            </Link>
          </div>
          <div className="home-component">
            <EventsActivities />
          </div>
        </div>
        <div className="col-md-6 home-main-content">
          <HomeJob />
        </div>
        <div className="col-md-3 home-sidebar">
          <div className="home-component">
            <PostJob />
          </div>
          <div className="home-component">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
