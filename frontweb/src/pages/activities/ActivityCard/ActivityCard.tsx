import React from 'react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../types';
import './ActivityCard.css'; // Importez le fichier CSS

interface ActivityCardProps {
  activity: IActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="activity-card">
      {activity.activityImage && <img src={activity.activityImage} alt={activity.title} />}
      <h5>{activity.title}</h5>
      <p>{activity.description}</p>
      <p>
        <small>{new Date(activity.date).toLocaleDateString()}</small>
      </p>
      <Link to={`/activities/${activity._id}`}>View Details</Link>
    </div>
  );
};

export default ActivityCard;
