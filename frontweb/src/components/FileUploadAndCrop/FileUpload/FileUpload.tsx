import React, { useState } from 'react';
import FileUploadCrop from '../CropImage/FileUploadCrop';
import './FileUpload.css';
import { Area } from 'react-easy-crop/types';

interface FileUploadProps {
  onImagesChange: (files: File[]) => void;
  onVideoChange: (file: File | null) => void;
  onRemoveImage: (index: number) => void;
  onRemoveVideo: () => void;
  imagePreviews: string[];
  videoPreview: string | null;
  uploadProgress: number[];
  videoProgress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImagesChange, onVideoChange, onRemoveImage, onRemoveVideo, imagePreviews, videoPreview, uploadProgress, videoProgress }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const newFiles = Array.from(files);
      onImagesChange([...newFiles]);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onVideoChange(file);
    }
  };

  const openCropModal = (src: string) => {
    setCroppingImage(src);
  };

  const handleCropComplete = (croppedImage: Blob) => {
    const newFile = new File([croppedImage], 'cropped.jpg', {
      type: 'image/jpeg'
    });
    onImagesChange([newFile]);
    setCroppingImage(null);
  };

  return (
    <div>
      <div className="form-field">
        <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageChange} className="profile-input" />
        <div className="previews">
          {imagePreviews.map((src, index) => (
            <div key={index} className="preview">
              <img src={src} alt={`Preview ${index}`} onClick={() => openCropModal(src)} />
              <button className="remove-button" onClick={() => onRemoveImage(index)}>
                X
              </button>
              <progress value={uploadProgress[index]} max="100" />
            </div>
          ))}
        </div>
      </div>
      <div className="form-field">
        <input type="file" id="video" name="video" accept="video/*" onChange={handleVideoChange} className="profile-input" />
        {videoPreview && (
          <div className="preview">
            <video src={videoPreview} controls width="300">
              Your browser does not support the video tag.
            </video>
            <button className="remove-button" onClick={onRemoveVideo}>
              X
            </button>
            <progress value={videoProgress} max="100" />
          </div>
        )}
      </div>

      {croppingImage && <FileUploadCrop imageSrc={croppingImage} onCropComplete={handleCropComplete} onClose={() => setCroppingImage(null)} />}
    </div>
  );
};

export default FileUpload;
