import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchDropdown.css';

const SearchDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="search-dropdown">
      <button className="btn" onClick={toggleDropdown} aria-expanded={isOpen} aria-label="Toggle search dropdown">
        <FaSearch />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="/search-site">Search the site</a>
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            Search Google
          </a>
          <a href="/search-jobs">Search for a job</a>
          <a href="/search-activities">Search for an activity</a>
          <a href="/search-members">Search for a member</a>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
