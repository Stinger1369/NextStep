import React, { useCallback, useState, useEffect } from 'react';
import { useRecordWebcam, STATUS } from 'react-record-webcam';
import { FaVideo, FaPause, FaPlay } from 'react-icons/fa';
import './VideoRecord.css';

interface VideoRecordProps {
  setRecordedVideo: (file: File) => void;
}

const VideoRecord: React.FC<VideoRecordProps> = ({ setRecordedVideo }) => {
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    download,
    activeRecordings,
    clearAllRecordings,
    errorMessage
  } = useRecordWebcam({
    options: { fileName: 'custom-name', fileType: 'webm' },
    mediaRecorderOptions: { mimeType: 'video/webm; codecs=vp8' },
    mediaTrackConstraints: {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: 16 / 9,
        frameRate: { ideal: 30 },
        facingMode: 'user'
      },
      audio: true
    } as MediaTrackConstraints
  });

  const [countdown, setCountdown] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [cameraOpened, setCameraOpened] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    let recordingTimer: NodeJS.Timeout;
    if (isRecording && recordingTime < 120) {
      // 120 seconds = 2 minutes
      recordingTimer = setTimeout(() => {
        setRecordingTime(recordingTime + 1);
      }, 1000);
    } else if (recordingTime >= 120) {
      handleStopRecording();
    }

    return () => clearTimeout(recordingTimer);
  }, [isRecording, recordingTime]);

  const handleOpenCamera = useCallback(async () => {
    console.log('Opening camera...');
    const recording = await createRecording();
    if (recording) {
      console.log('Camera opened, recording ID:', recording.id);
      await openCamera(recording.id);
      setCameraOpened(true);
      setShowMessage(false);
    } else {
      console.error('Failed to create recording');
    }
  }, [createRecording, openCamera]);

  const handleStartRecording = useCallback(async () => {
    if (!cameraOpened) {
      setShowMessage(true);
      return;
    }
    console.log('Starting recording...');
    setCountdown(3);
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownTimer);
          const recording = activeRecordings.find((recording) => recording.status === STATUS.OPEN);
          if (recording) {
            startRecording(recording.id);
            setIsRecording(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [activeRecordings, cameraOpened, startRecording]);

  const handlePauseRecording = useCallback(async () => {
    if (!cameraOpened) {
      setShowMessage(true);
      return;
    }
    console.log('Pausing recording...');
    const recording = activeRecordings.find((recording) => recording.status === STATUS.RECORDING);
    if (recording) {
      await pauseRecording(recording.id);
      console.log('Recording paused, recording ID:', recording.id);
      setIsRecording(false);
    } else {
      console.error('No recording in progress found');
    }
  }, [activeRecordings, cameraOpened, pauseRecording]);

  const handleResumeRecording = useCallback(async () => {
    if (!cameraOpened) {
      setShowMessage(true);
      return;
    }
    console.log('Resuming recording...');
    const recording = activeRecordings.find((recording) => recording.status === STATUS.PAUSED);
    if (recording) {
      await resumeRecording(recording.id);
      console.log('Recording resumed, recording ID:', recording.id);
      setIsRecording(true);
    } else {
      console.error('No paused recording found');
    }
  }, [activeRecordings, cameraOpened, resumeRecording]);

  const handleStopRecording = useCallback(async () => {
    if (!cameraOpened) {
      setShowMessage(true);
      return;
    }
    console.log('Stopping recording...');
    const recording = activeRecordings.find(
      (recording) => recording.status === STATUS.RECORDING || recording.status === STATUS.PAUSED
    );
    if (recording) {
      const recordedVideo = await stopRecording(recording.id);
      setIsRecording(false);
      setRecordingTime(0);
      if (recordedVideo && recordedVideo.blob) {
        console.log('Recording stopped, creating file...');
        const file = new File([recordedVideo.blob], 'recorded-video.webm', { type: 'video/webm' });
        setRecordedVideo(file);
      } else {
        console.error('No video blob found');
      }
    } else {
      console.error('No recording in progress found');
    }
  }, [activeRecordings, cameraOpened, stopRecording, setRecordedVideo]);

  const downloadVideo = async (id: string) => {
    console.log('Downloading video, recording ID:', id);
    await download(id);
  };

  return (
    <div className="video-record-form-group">
      <h2>Record a video (max 2 minutes)</h2>
      <div className="video-record-options">
        <button className="video-record-button btn btn-secondary" onClick={handleOpenCamera}>
          <FaVideo className="video-record-icon" />
          Open Camera
        </button>
        <button
          className="video-record-button btn btn-success"
          onClick={handleStartRecording}
          disabled={isRecording || countdown > 0}
        >
          <FaVideo className="video-record-icon" />
          {countdown > 0 ? `Starting in ${countdown}` : 'Start Recording'}
        </button>
        <button
          className="video-record-button btn btn-warning"
          onClick={handlePauseRecording}
          disabled={!isRecording}
        >
          <FaPause className="video-record-icon" />
          Pause
        </button>
        <button
          className="video-record-button btn btn-success"
          onClick={handleResumeRecording}
          disabled={isRecording || countdown > 0}
        >
          <FaPlay className="video-record-icon" />
          Resume
        </button>
        <button
          className="video-record-button btn btn-danger"
          onClick={handleStopRecording}
          disabled={countdown > 0}
        >
          Stop Recording
        </button>
        <button
          className="video-record-button btn btn-warning"
          onClick={clearAllRecordings}
          disabled={isRecording || countdown > 0}
        >
          Clear All Recordings
        </button>
      </div>
      {showMessage && <div className="message">Please open your webcam</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="video-display">
        {activeRecordings.map((recording) => (
          <div key={recording.id}>
            <video ref={recording.webcamRef} autoPlay muted />
            <video ref={recording.previewRef} controls />
            <button
              className="video-record-button btn btn-info"
              onClick={() => downloadVideo(recording.id)}
              disabled={isRecording || countdown > 0}
            >
              Download Video
            </button>
          </div>
        ))}
      </div>
      {isRecording && (
        <div className="recording-timer">
          Recording Time: {Math.floor(recordingTime / 60)}:
          {recordingTime % 60 < 10 ? `0${recordingTime % 60}` : recordingTime % 60}
        </div>
      )}
    </div>
  );
};

export default VideoRecord;
