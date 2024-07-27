import React, { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Portfolio.css';
import PortfolioNavBar from './PortfolioNavBar/PortfolioNavBar';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  age?: number;
  showAge?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  profession?: string;
  bio?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
  hobbies?: string[];
  images: string[];
  videos: string[];
  isVerified: boolean;
  sex?: string;
  company?: string;
  companyId?: string;
  companies?: string[];
  socialMediaLinks?: {
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    discord?: string;
  };
  slug: string;
}

const Portfolio: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${slug}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('User not found');
      }
    };

    if (slug) {
      fetchUser();
    }
  }, [slug]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="portfolio-container">
      <PortfolioNavBar />
      {user ? <Outlet context={{ user }} /> : <p>Loading...</p>}
    </div>
  );
};

export default Portfolio;
