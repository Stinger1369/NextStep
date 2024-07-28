import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchActivityById } from '../../../redux/features/activity/activitySlice';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const activity = useSelector((state: RootState) => state.activities.activity);
  const loading = useSelector((state: RootState) => state.activities.loading);
  const error = useSelector((state: RootState) => state.activities.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivityById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {activity ? (
        <div>
          <h1>{activity.title}</h1>
          <p>{activity.description}</p>
          <p>{new Date(activity.date).toLocaleDateString()}</p>
          <p>{activity.location.address}</p>
          {/* Affichez d'autres détails de l'activité ici */}
        </div>
      ) : (
        <p>Activity not found</p>
      )}
    </div>
  );
};

export default ActivityDetail;
