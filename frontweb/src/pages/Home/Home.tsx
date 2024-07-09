import React from 'react';
import LoginComponent from '../LoginPages/LoginComponent';
import HomeJob from './HomeJob/HomeJob';
import PostJob from './PostJob/PostJob';
import SkillDevelopment from './SkillDevelopment/SkillDevelopment';
import EventsActivities from './EventsActivities/EventsActivities';
import Testimonials from './Testimonials/Testimonials';
import './Home.css';

const Home: React.FC = () => {
  const userId = '668ab4d812d1e419c0893543'; // Remplacez par l'ID de l'utilisateur
  const apiKey = '1bc965bc-b189-42f1-8ec0-1d1dc5ebece8'; // Remplacez par la clé API de l'utilisateur

  return (
    <div className="home-container">
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <div className="cards-container">
        <div className="card home-login-container">
          <LoginComponent />
        </div>
        <div className="card home-job-container">
          <HomeJob userId={userId} apiKey={apiKey} />
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
