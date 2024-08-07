import React, { useCallback } from 'react';
import { useRecordWebcam, STATUS } from 'react-record-webcam';
import { FaVideo } from 'react-icons/fa';
import './VideoRecord.css'; // Assurez-vous d'avoir des styles définis ici

interface VideoRecordProps {
  handleVideoUpload: (file: File) => void;
}

const VideoRecord: React.FC<VideoRecordProps> = ({ handleVideoUpload }) => {
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    download,
    activeRecordings,
    clearAllRecordings,
    errorMessage
  } = useRecordWebcam({
    options: { fileName: 'custom-name', fileType: 'webm' },
    mediaRecorderOptions: { mimeType: 'video/webm; codecs=vp8' },
    mediaTrackConstraints: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      aspectRatio: 16 / 9,
      frameRate: { ideal: 30 },
      facingMode: 'user'
    } as MediaTrackConstraints
  });

  // Fonction pour créer une nouvelle instance d'enregistrement et ouvrir la caméra
  const handleOpenCamera = useCallback(async () => {
    const recording = await createRecording();
    if (recording) {
      await openCamera(recording.id);
    }
  }, [createRecording, openCamera]);

  // Fonction pour démarrer l'enregistrement
  const handleStartRecording = useCallback(async () => {
    const recording = activeRecordings.find((recording) => recording.status === STATUS.OPEN);
    if (recording) {
      await startRecording(recording.id);
    }
  }, [activeRecordings, startRecording]);

  // Fonction pour arrêter l'enregistrement
  const handleStopRecording = useCallback(async () => {
    const recording = activeRecordings.find((recording) => recording.status === STATUS.RECORDING);
    if (recording) {
      const recordedVideo = await stopRecording(recording.id);
      if (recordedVideo && recordedVideo.blob) {
        const file = new File([recordedVideo.blob], 'recorded-video.webm', { type: 'video/webm' });
        handleVideoUpload(file);
      }
    }
  }, [activeRecordings, stopRecording, handleVideoUpload]);

  // Fonction pour télécharger la vidéo
  const downloadVideo = async (id: string) => {
    await download(id);
  };

  return (
    <div className="video-record-form-group">
      <h2>Enregistrer une vidéo (max 2 minutes)</h2>
      <div className="video-record-options">
        <button className="video-record-button btn btn-secondary" onClick={handleOpenCamera}>
          <FaVideo className="video-record-icon" />
          Ouvrir la caméra
        </button>
        <button className="video-record-button btn btn-success" onClick={handleStartRecording}>
          <FaVideo className="video-record-icon" />
          Démarrer l'enregistrement
        </button>
        <button className="video-record-button btn btn-danger" onClick={handleStopRecording}>
          Arrêter l'enregistrement
        </button>
        <button className="video-record-button btn btn-warning" onClick={clearAllRecordings}>
          Effacer tous les enregistrements
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="video-display">
        {activeRecordings.map((recording) => (
          <div key={recording.id}>
            <video ref={recording.webcamRef} autoPlay muted />
            <video ref={recording.previewRef} controls />
            <button
              className="video-record-button btn btn-info"
              onClick={() => downloadVideo(recording.id)}
            >
              Télécharger la vidéo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRecord;
