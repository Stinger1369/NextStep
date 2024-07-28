import React from 'react';
import { FaBriefcase, FaUserAlt, FaFileAlt, FaHeart, FaCalendarAlt, FaUsers, FaCode, FaSyncAlt, FaServer, FaPalette, FaLock } from 'react-icons/fa';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <h2>About NextStep</h2>
      <p>Learn more about the features and functionalities of NextStep.fr</p>
      <div className="card-container">
        <div className="card">
          <FaBriefcase className="card-icon" />
          <h3>Connecting Employers and Job Seekers</h3>
          <p>
            NextStep.fr facilitates meaningful connections between companies and potential employees. Companies can post job openings, search for potential candidates, and set up interviews, while job
            seekers can create profiles, upload resumes, and apply for jobs directly through the platform.
          </p>
        </div>
        <div className="card">
          <FaUserAlt className="card-icon" />
          <h3>Customizable Personal Portfolio</h3>
          <p>
            Each user can create their own customizable portfolio to showcase their skills, experiences, projects, and achievements. Users can choose different templates, add multimedia content, and
            share their portfolio with potential employers or collaborators.
          </p>
        </div>
        <div className="card">
          <FaFileAlt className="card-icon" />
          <h3>CV Creation Tool</h3>
          <p>
            Users can create their own CVs directly on the platform using our intuitive CV builder. The tool provides various templates and formats to choose from, ensuring that each CV is
            professional and tailored to the job seeker&apos;s needs.
          </p>
        </div>
        <div className="card">
          <FaHeart className="card-icon" />
          <h3>Professional and Romantic Networking</h3>
          <p>
            Our platform includes features for both professional networking and romantic connections. Users can join professional groups, attend networking events, and find potential romantic partners
            based on shared interests and professional goals.
          </p>
        </div>
        <div className="card">
          <FaCalendarAlt className="card-icon" />
          <h3>Activity Creation</h3>
          <p>
            Users can create and participate in various activities and events, such as workshops, webinars, social gatherings, and more. The platform supports event management features, including
            RSVPs, reminders, and notifications.
          </p>
        </div>
        <div className="card">
          <FaUsers className="card-icon" />
          <h3>Member Features</h3>
          <p>
            Learn more about the benefits and features available to our members, such as exclusive content, priority support, and access to premium tools and resources designed to enhance their job
            search and networking experience.
          </p>
        </div>
        <div className="card">
          <FaCode className="card-icon" />
          <h3>Technologies Used</h3>
          <p>
            Our platform is built with cutting-edge technologies including Java, Spring Boot, and WebSockets. These technologies enable real-time chat, posts, comments, likes, and other interactive
            features, ensuring a smooth and dynamic user experience.
          </p>
        </div>
        <div className="card">
          <FaSyncAlt className="card-icon" />
          <h3>Real-Time Updates</h3>
          <p>All interactions such as chat, posts, and likes happen in real-time thanks to WebSocket technology. This ensures instant communication and up-to-date information for all users.</p>
        </div>
        <div className="card">
          <FaServer className="card-icon" />
          <h3>Hosting on OVH</h3>
          <p>
            Our platform is securely hosted on OVH, ensuring reliability, performance, and data protection. OVH provides state-of-the-art infrastructure and robust security measures to keep your data
            safe.
          </p>
        </div>
        <div className="card">
          <FaPalette className="card-icon" />
          <h3>Customizable Themes</h3>
          <p>Users can personalize their experience with customizable themes. Choose from a variety of color schemes and layouts to make your profile and dashboard truly unique.</p>
        </div>
        <div className="card">
          <FaLock className="card-icon" />
          <h3>NSFW Image Server</h3>
          <p>
            We offer a dedicated NSFW image server built with Python, providing an exceptionally secure environment for managing sensitive content. Our robust security measures ensure that all content
            is handled safely and appropriately.
          </p>
        </div>
        <div className="card">
          <FaLock className="card-icon" />
          <h3>Ultra-Secure Backend with Node.js</h3>
          <p>
            Our backend is built with Node.js and employs ultra-secure REST APIs to protect user data and ensure seamless interactions. We prioritize security and performance in all aspects of our
            backend development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
