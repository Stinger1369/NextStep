import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import './ImageUpload.css';
import { RootState } from '../../../../../../../redux/store';

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
  const error = useSelector((state: RootState) => state.images.error); // Access error state

  return (
    <div className="ImageUpload-form-group">
      <label htmlFor="images">Upload Images (up to 5)</label>
      <div className="ImageUpload-upload-icon-container">
        <FaPlus className="ImageUpload-upload-icon" />
        <span className="ImageUpload-upload-text">Select Image</span>
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
      {error && (
        <div className="ImageUpload-error-message">
          <h4>Error Code: {error.code}</h4>
          <p>{error.message}</p>
        </div>
      )}
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
