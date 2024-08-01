// src/pages/ProfileSection/UserProfile/components/VideoGallery/VideoGallery.tsx

import React from 'react';
import './VideoGallery.css';

interface VideoGalleryProps {
  videos: string[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  return (
    <div className="video-gallery">
      <h3 className="text-secondary">Videos</h3>
      {videos.length > 0 ? (
        <div className="video-container">
          {videos.map((video, index) => (
            <video key={index} controls className="video-thumbnail">
              <source src={video} type="video/mp4" />
              <track kind="captions" />
            </video>
          ))}
        </div>
      ) : (
        <p>No videos available</p>
      )}
    </div>
  );
};

export default VideoGallery;
