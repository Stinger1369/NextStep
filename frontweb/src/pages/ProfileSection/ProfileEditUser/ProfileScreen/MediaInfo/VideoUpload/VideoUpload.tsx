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

  // Fonction pour démarrer l'enregistrement vidéo
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
        handleVideoUpload(file); // Envoie de la vidéo enregistrée
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

  // Fonction pour arrêter l'enregistrement vidéo
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  // Fonction pour gérer l'upload de fichier vidéo
  const handleFileUpload = async (file: File) => {
    handleVideoUpload(file); // Envoie de la vidéo sélectionnée

    // Simulation de la progression de l'upload
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
    <div className="MediaInfoVideoUpload-form-group">
      <label htmlFor="video">Télécharger ou enregistrer une vidéo (maximum 2 minutes)</label>
      <div className="MediaInfoVideoUpload-options">
        {/* Bouton pour ouvrir le modal vidéo */}
        <button
          className="MediaInfoVideoUpload-button btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <FaVideo className="MediaInfoVideoUpload-upload-icon" />
          <span className="MediaInfoVideoUpload-upload-text">Sélectionner une vidéo</span>
        </button>
        {recording && (
          <button
            className="MediaInfoVideoUpload-stop-button btn btn-danger"
            onClick={stopRecording}
          >
            Arrêter l'enregistrement
          </button>
        )}
      </div>
      <ProgressBar
        className="MediaInfoVideoUpload-progress-bar"
        now={uploadProgress}
        label={`${uploadProgress}%`}
      />

      {showModal && (
        <VideoModal
          show={showModal}
          onHide={handleModalClose}
          onUpload={handleFileUpload}
          onRecord={handleRecord}
        />
      )}
      {errorMessage && <div className="MediaInfoVideoUpload-text-danger">{errorMessage}</div>}
    </div>
  );
};

export default VideoUpload;
