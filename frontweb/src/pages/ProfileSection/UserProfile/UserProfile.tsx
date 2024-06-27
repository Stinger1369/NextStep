import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { getUserById } from '../../../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserById(authUser._id));
    }
  }, [dispatch, authUser?._id]);

  useEffect(() => {
    if (user?.images) {
      console.log('User images:', user.images);
    }
  }, [user]);

  const handleEditProfile = () => {
    navigate('/profile-edit-user/personal-info');
  };

  const handleNextImage = () => {
    if (user?.images && user.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % user.images!.length);
    }
  };

  const handlePrevImage = () => {
    if (user?.images && user.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + user.images!.length) % user.images!.length);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container container mt-5">
      <div className="profile-header text-center mb-4 position-relative">
        <button className="btn btn-outline-primary edit-profile-btn" onClick={handleEditProfile} style={{ position: 'absolute', right: '10px', top: '10px' }}>
          Edit My Profile
        </button>
        {user.images && user.images.length > 0 && (
          <div className="carousel mb-3">
            {user.images.length > 1 && (
              <button className="carousel-control-prev" onClick={handlePrevImage}>
                <FaArrowLeft />
              </button>
            )}
            <div className="carousel-image-container">
              <img src={user.images[currentImageIndex]} alt={`User ${currentImageIndex + 1}`} className="d-block w-100 rounded" />
            </div>
            {user.images.length > 1 && (
              <button className="carousel-control-next" onClick={handleNextImage}>
                <FaArrowRight />
              </button>
            )}
          </div>
        )}
        <h2 className="text-primary mt-3">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted">{user.profession}</p>
      </div>
      <div className="profile-section">
        <h3 className="text-secondary">Personal Information</h3>
        <p>
          <strong>Email:</strong> {user.emailOrPhone}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.zipCode}, {user.address?.country}
        </p>
      </div>
      <div className="profile-section mt-4">
        <h3 className="text-secondary">Professional Information</h3>
        <p>
          <strong>Profession:</strong> {user.profession}
        </p>
        <p>
          <strong>Bio:</strong> {user.bio}
        </p>
        <div>
          <strong>Experience:</strong>
          <ul>{user.experience?.map((exp, index) => <li key={index}>{exp}</li>)}</ul>
        </div>
        <div>
          <strong>Education:</strong>
          <ul>{user.education?.map((edu, index) => <li key={index}>{edu}</li>)}</ul>
        </div>
        <div>
          <strong>Skills:</strong>
          <ul>{user.skills?.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
        </div>
      </div>
      <div className="profile-section mt-4">
        <h3 className="text-secondary">Videos</h3>
        {user.videos && user.videos.length > 0 ? (
          <div className="video-gallery d-flex overflow-auto">
            {user.videos.map((video, index) => (
              <video key={index} controls className="video-thumbnail mr-2 mb-2">
                <track kind="captions" />
              </video>
            ))}
          </div>
        ) : (
          <p>No videos available</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
