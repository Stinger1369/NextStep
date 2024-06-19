import React from "react";
import "./HomeJob.css";

const HomeJob: React.FC = () => {
  return (
    <div className="home-job-container">
      <h3>Trouvez votre travail ou votre stage idéal</h3>
      <p>Suggestions de recherches</p>
      <ul>
        <li>Ingénierie</li>
        <li>Développement commercial</li>
        <li>Finance</li>
        <li>Adjoint administratif</li>
        <li>Vendeur</li>
        <li>Service clients</li>
        <li>Exploitation</li>
        <li>Technologies de l’information</li>
        <li>Marketing</li>
        <li>Ressources humaines</li>
        <li>
          <a href="#">Voir plus</a>
        </li>
      </ul>
    </div>
  );
};

export default HomeJob;
