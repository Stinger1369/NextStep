// ImagePreview/ImagePreview.tsx

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { userFriendlyMessages } from '../../../../../../utils/errorMessages';
import './ImagePreview.css';

interface ImagePreviewProps {
  imagePreviews: string[];
  imageErrors: { imageName: string; code: string | null; message: string }[]; // Allow null for code
  openCropModal: (src: string, index: number) => void;
  handleDeleteImage: (imageUrl: string, e: React.MouseEvent) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imagePreviews,
  imageErrors,
  openCropModal,
  handleDeleteImage
}) => {
  return (
    <div className="image-previews">
      {imagePreviews.map((src, index) => (
        <div
          key={index}
          className="image-preview-container"
          role="button"
          tabIndex={0}
          onClick={() => openCropModal(src, index)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openCropModal(src, index);
            }
          }}
        >
          <img src={src} alt={`Preview ${index}`} />
          <FaEdit className="edit-icon" onClick={() => openCropModal(src, index)} />
          <FaTrash className="delete-icon" onClick={(e) => handleDeleteImage(src, e)} />
          {imageErrors
            .filter((error) => error.imageName === src.split('/').pop())
            .map((error, i) => (
              <div key={i} className="text-danger" style={{ fontSize: '0.8em' }}>
                Error:{' '}
                {userFriendlyMessages[error.code as keyof typeof userFriendlyMessages] ||
                  error.message.split(':')[0]}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
