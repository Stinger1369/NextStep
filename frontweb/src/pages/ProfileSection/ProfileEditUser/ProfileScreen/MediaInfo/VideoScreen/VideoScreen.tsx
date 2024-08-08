import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VideoScreen.css';
import { RootState, AppDispatch } from '../../../../../../redux/store';
import VideoUpload from './VideoUpload/VideoUpload';
import VideoRecord from './VideoRecord/VideoRecord';
import { handleVideoErrors } from '../../../../../../utils/errorHandler';
import NavigationIconsVideo from './NavigationIconsVideo/NavigationIconsVideo';

interface User {
  _id: string;
}

const VideoScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const videoError = useSelector((state: RootState) => state.videos.error);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<File | null>(null);

  const handleVideoUpload = async (file: File) => {
    if (!user?._id) {
      console.error('User ID is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('user_id', user._id);

      const response = await fetch('http://localhost:7000/server-video/ajouter-video', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        const errorResult = result as {
          errors: { videoName: string; message: string; code: string }[];
        };

        const mappedErrors = errorResult.errors.map((error) => ({
          ...error,
          status: 'failed'
        }));

        console.error('Error uploading video:', mappedErrors);
        handleVideoErrors(mappedErrors);
        setShowSuccessMessage(false);
      } else {
        console.log('Video uploaded successfully:', result.link);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
    setIsSubmitting(false);
  };

  const handleSave = async () => {
    if (recordedVideo) {
      await handleVideoUpload(recordedVideo);
    }
  };

  return (
    <div className="media-info-container">
      <NavigationIconsVideo navigate={navigate} />
      <div className="video-section">
        <h2>Upload or Record Video</h2>
        <VideoUpload handleVideoUpload={handleVideoUpload} />
        <VideoRecord setRecordedVideo={setRecordedVideo} />
      </div>
      <div className="media-info-button-container">
        <button
          type="button"
          className="btn btn-primary"
          disabled={isSubmitting}
          onClick={handleSave}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/media-info/images')}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-success ms-2"
          onClick={() => navigate(`/user-profile/${user?._id}`)}
        >
          Finish
        </button>
      </div>
      {showSuccessMessage && (
        <div className="media-info-success-message mt-3">
          <p>Your video has been added successfully.</p>
        </div>
      )}
      {videoError && (
        <div className="alert alert-danger mt-3" role="alert">
          {videoError.message}
        </div>
      )}
    </div>
  );
};

export default VideoScreen;
