import React from "react";
import LoginComponent from "../LoginPages/LoginComponent";
import HomeJob from "./HomeJob/HomeJob";
import PostJob from "./PostJob/PostJob";
import SkillDevelopment from "./SkillDevelopment/SkillDevelopment";
import EventsActivities from "./EventsActivities/EventsActivities";
import Testimonials from "./Testimonials/Testimonials";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <div className="cards-container">
        <div className="card">
          <LoginComponent />
        </div>
        <div className="card">
          <HomeJob />
        </div>
        <div className="card">
          <PostJob />
        </div>
        <div className="card">
          <SkillDevelopment />
        </div>
        <div className="card">
          <EventsActivities />
        </div>
        <div className="card">
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default Home;
