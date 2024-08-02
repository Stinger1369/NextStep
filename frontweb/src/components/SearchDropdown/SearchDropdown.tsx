import React, { useState, useRef, useEffect, RefObject } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchDropdown.css';

const SearchDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  const toggleDropdown = () => {
    console.log('Toggle dropdown');
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('Clicked outside dropdown');
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <button
        className="btn"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Toggle search dropdown"
      >
        <FaSearch />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="/search-site" onClick={() => console.log('Search the site clicked')}>
            Search the site
          </a>
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => console.log('Search Google clicked')}
          >
            Search Google
          </a>
          <a href="/search-jobs" onClick={() => console.log('Search for a job clicked')}>
            Search for a job
          </a>
          <a
            href="/search-activities"
            onClick={() => console.log('Search for an activity clicked')}
          >
            Search for an activity
          </a>
          <a href="/search-members" onClick={() => console.log('Search for a member clicked')}>
            Search for a member
          </a>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
