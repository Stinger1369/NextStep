import React from 'react';
import './FooterGlobal.css';
import { FaFacebook, FaGithub, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const FooterGlobal: React.FC = () => {
  return (
    <footer className="footer-global">
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="http://localhost:3000/about">About</a>
        <a href="http://localhost:3000/job-offers">job-offers</a>
        <a href="/contact">Assistant</a>
      </div>
      <div className="container text-center">
        <span>© 2024 NextStep.fr</span>
      </div>
      <div className="social-links">
        <a href="https://www.facebook.com" aria-label="Facebook">
          <FaFacebook />
        </a>
        <a href="https://github.com" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://www.whatsapp.com" aria-label="WhatsApp">
          <FaWhatsapp />
        </a>
        <a href="mailto:contact@nextstep.fr" aria-label="Email">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default FooterGlobal;
