import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchActivities } from '../../../redux/features/activity/activitySlice';
import { Link } from 'react-router-dom';

const ActivityList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activities = useSelector((state: RootState) => state.activities.activities);
  const loading = useSelector((state: RootState) => state.activities.loading);
  const error = useSelector((state: RootState) => state.activities.error);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Activities</h1>
      <Link to="/create-activity" className="btn btn-primary mb-3">
        + Create Activity
      </Link>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
            <p>{new Date(activity.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
