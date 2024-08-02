import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getUsers } from '../../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import './Members.css';

const Members: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.user.users);
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleUserClick = (userId: string) => {
    navigate(`/user-profile/${userId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, userId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/user-profile/${userId}`);
    }
  };

  return (
    <div className="members-container">
      <h2>Members</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      <div className="members-grid">
        {users
          .filter((user) => user.firstName && user.lastName)
          .map((user) => (
            <div
              key={user._id}
              className="member-card"
              onClick={() => handleUserClick(user._id)}
              onKeyDown={(event) => handleKeyDown(event, user._id)}
              tabIndex={0}
              role="button"
            >
              <img
                src={user.images && user.images.length > 0 ? user.images[0] : '/default-avatar.png'}
                alt={`${user.firstName} ${user.lastName}`}
                className="member-image"
              />
              <div className="member-info">
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Members;
