import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import VideoModal from '../VideoModal/VideoModal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './VideoUpload.css';

interface VideoUploadProps {
  handleVideoUpload: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ handleVideoUpload }) => {
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    handleVideoUpload(file); // Send selected video

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrorMessage(null);
    setUploadProgress(0);
  };

  return (
    <div className="VideoUpload-form-group">
      <label htmlFor="video">Upload or Record a Video (max 2 minutes)</label>
      <div className="VideoUpload-options">
        <button className="VideoUpload-button btn btn-primary" onClick={() => setShowModal(true)}>
          <FaVideo className="VideoUpload-upload-icon" />
          <span className="VideoUpload-upload-text">Select Video</span>
        </button>
      </div>
      <ProgressBar
        className="VideoUpload-progress-bar"
        now={uploadProgress}
        label={`${uploadProgress}%`}
      />

      {showModal && (
        <VideoModal
          show={showModal}
          onHide={handleModalClose}
          onUpload={handleFileUpload}
          onRecord={() => {
            // Open the recording modal
            setShowModal(false); // Close upload modal before recording
            // Implement opening the recording modal here
          }}
        />
      )}
      {errorMessage && <div className="VideoUpload-text-danger">{errorMessage}</div>}
    </div>
  );
};

export default VideoUpload;
