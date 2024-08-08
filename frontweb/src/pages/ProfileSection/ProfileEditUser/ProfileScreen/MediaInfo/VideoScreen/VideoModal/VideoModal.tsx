import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface VideoModalProps {
  show: boolean;
  onHide: () => void;
  onUpload: (file: File) => void;
  onRecord: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ show, onHide, onUpload, onRecord }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Check file size (approximate limit for a 2-minute video)
      const maxSize = 200 * 1024 * 1024; // Approx 200MB for 2-minute video
      if (file.size > maxSize) {
        setErrorMessage('The video must not exceed 2 minutes.');
      } else {
        setErrorMessage(null);
        onUpload(file); // Send video after selecting file
        onHide(); // Close the modal after file selection
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload or Record Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="VideoModal-options">
          <label className="VideoModal-upload-button btn btn-primary">
            <input
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange} // File selection handler
            />
            Select Video
          </label>
          <Button className="VideoModal-record-button" variant="secondary" onClick={onRecord}>
            Record Video
          </Button>
        </div>
        {errorMessage && (
          <div className="VideoModal-error-message text-danger mt-2">{errorMessage}</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;
