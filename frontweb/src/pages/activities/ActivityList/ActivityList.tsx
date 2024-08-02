// src/pages/activities/ActivityList/ActivityList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchActivities } from '../../../redux/features/activity/activitySlice';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../ActivityCard/ActivityCard';
import LoginComponent from '../../LoginPages/LoginComponent';
import PostJob from '../../Home/PostJob/PostJob';
import Testimonials from '../../Home/Testimonials/Testimonials';
import './ActivityList.css';

const ActivityList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const activities = useSelector((state: RootState) => state.activities.activities);
  const loading = useSelector((state: RootState) => state.activities.loading);
  const error = useSelector((state: RootState) => state.activities.error);
  const user = useSelector((state: RootState) => state.auth.user);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    console.log('Fetching activities...');
    dispatch(fetchActivities());
  }, [dispatch]);

  if (loading) {
    console.log('Loading activities...');
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('Error fetching activities:', error);
    const errorMessage =
      typeof error === 'object' && error !== null ? JSON.stringify(error) : error;
    return <p>Error: {errorMessage}</p>;
  }

  const isProfileIncomplete = !user?.firstName || !user?.lastName;
  console.log('User profile complete:', !isProfileIncomplete);

  const handleCreateActivityClick = () => {
    console.log('Create Activity button clicked.');
    if (isProfileIncomplete) {
      console.log('Profile is incomplete. Showing tooltip...');
      setTooltipVisible(true);
      setTimeout(() => {
        console.log('Hiding tooltip...');
        setTooltipVisible(false);
      }, 5000);
    } else {
      console.log('Profile is complete. Navigating to create activity page...');
      navigate('/create-activity');
    }
  };

  return (
    <div className="container-fluid container-activity-list">
      <div className="row">
        <div className="col-md-3 activity-list-sidebar">
          <div className="activity-list-card">
            <LoginComponent />
          </div>
          <div className="activity-list-card">
            <a href="/skill-development" className="skill-development-link">
              <h3>Skill Development</h3>
              <p>Improve your skills with our online courses</p>
            </a>
          </div>
        </div>
        <div className="col-md-6 activity-list-main-content">
          <h1>Activities</h1>
          <div className="position-relative">
            <button
              type="button"
              className={`btn btn-primary mb-3`}
              onClick={handleCreateActivityClick}
            >
              + Create Activity
            </button>
            {tooltipVisible && (
              <div className="tooltip">
                You need to complete your profile to create an activity.
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate('/profile-edit-user/personal-info')}
                >
                  Complete your profile
                </button>
              </div>
            )}
          </div>
          <div className="row">
            {activities.map((activity) => (
              <div className="col-md-12 mb-3" key={activity._id}>
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-3 activity-list-sidebar">
          <div className="activity-list-card">
            <PostJob />
          </div>
          <div className="activity-list-card">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
