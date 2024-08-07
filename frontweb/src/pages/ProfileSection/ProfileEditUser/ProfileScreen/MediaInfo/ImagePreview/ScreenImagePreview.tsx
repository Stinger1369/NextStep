import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { userFriendlyMessages } from '../../../../../../utils/errorMessages';
import './ScreenImagePreview.css';
import { ERROR_CODES } from '../../../../../../utils/errorCodes';

// Define the interface for image previews
interface ImagePreviewItem {
  src: string; // Blob URL
  file: File; // Original file
}

// Updated interface for props
interface ImagePreviewProps {
  imagePreviews: ImagePreviewItem[]; // Array of ImagePreviewItem
  imageErrors: { imageName: string; code: string | null; message: string }[];
  openCropModal: (src: string, index: number) => void;
  handleDeleteImage: (imageUrl: string, e: React.MouseEvent) => void;
}

const ScreenImagePreview: React.FC<ImagePreviewProps> = ({
  imagePreviews,
  imageErrors,
  openCropModal,
  handleDeleteImage
}) => {
  // Filter previews to exclude those with errors
  const filteredPreviews = imagePreviews.filter(
    (preview) => !imageErrors.some((error) => error.imageName === preview.file.name)
  );

  return (
    <div className="screen-image-previews">
      {filteredPreviews.map((preview, index) => (
        <div
          key={index}
          className="screen-image-preview-container"
          role="button"
          tabIndex={0}
          onClick={() => openCropModal(preview.src, index)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openCropModal(preview.src, index);
            }
          }}
        >
          <img src={preview.src} alt={`Preview ${index}`} />
          <FaEdit className="screen-edit-icon" onClick={() => openCropModal(preview.src, index)} />
          <FaTrash
            className="screen-delete-icon"
            onClick={(e) => handleDeleteImage(preview.src, e)}
          />
        </div>
      ))}
      {/* Only display errors not related to NSFW */}
      {imageErrors
        .filter((error) => error.code !== ERROR_CODES.ErrImageNSFW)
        .map((error, index) => (
          <div key={index} className="screen-text-danger" style={{ fontSize: '0.8em' }}>
            Error:{' '}
            {userFriendlyMessages[error.code as keyof typeof userFriendlyMessages] || error.message}
          </div>
        ))}
    </div>
  );
};

export default ScreenImagePreview;
