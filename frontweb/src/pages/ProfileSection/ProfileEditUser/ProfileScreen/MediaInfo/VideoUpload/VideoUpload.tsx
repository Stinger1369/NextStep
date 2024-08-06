// VideoUpload.tsx

import React, { useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import VideoModal from './VideoModal/VideoModal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './VideoUpload.css';

interface VideoUploadProps {
  handleVideoUpload: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ handleVideoUpload }) => {
  const [showModal, setShowModal] = useState(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRecord = async () => {
    setErrorMessage(null);
    setRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const recorder = new MediaRecorder(stream);

      let chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', {
          type: 'video/webm'
        });
        handleVideoUpload(file);
        setRecording(false);
        setMediaRecorder(null);
        setShowModal(false);
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (err) {
      setErrorMessage(
        "Erreur d'accès à la caméra. Veuillez vérifier les autorisations de votre appareil."
      );
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleFileUpload = async (file: File) => {
    handleVideoUpload(file);

    // Simulation de la progression du téléchargement
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  return (
    <div className="VideoUpload-form-group">
      <label htmlFor="video">Télécharger ou enregistrer une vidéo (maximum 2 minutes)</label>
      <div className="VideoUpload-options">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaVideo className="VideoUpload-upload-icon" />
          <span className="VideoUpload-upload-text">Sélectionner une vidéo</span>
        </button>
        {recording && (
          <button className="btn btn-danger" onClick={stopRecording}>
            Arrêter l'enregistrement
          </button>
        )}
      </div>
      <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />

      {showModal && (
        <VideoModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onUpload={handleFileUpload}
          onRecord={handleRecord}
        />
      )}
      {errorMessage && <div className="VideoUpload-text-danger">{errorMessage}</div>}
    </div>
  );
};

export default VideoUpload;
