// ImageUpload.tsx

import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FormikProps } from 'formik';
import './ImageUpload.css';

interface ImageUploadProps {
  formik: FormikProps<{ images: File[] }>;
  handleImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSaveDisabled: boolean;
  userData: { images: string[] };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  formik,
  handleImagesChange,
  isSaveDisabled,
  userData
}) => {
  return (
    <div className="ImageUpload-form-group">
      <label htmlFor="images">Upload Images (up to 5)</label>
      <div className="ImageUpload-upload-icon-container">
        <FaPlus className="ImageUpload-upload-icon" />
        <span className="ImageUpload-upload-text">Select Image</span>{' '}
        {/* Ajout d'un texte de bouton */}
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="ImageUpload-form-control"
          disabled={userData?.images?.length !== undefined && userData.images.length >= 5}
        />
      </div>
      {formik.touched.images && formik.errors.images ? (
        <div className="ImageUpload-text-danger">
          {Array.isArray(formik.errors.images) &&
            formik.errors.images.map((error, index) => (
              <div key={index}>{typeof error === 'string' ? error : 'Invalid file type'}</div>
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
