// MediaInfo.tsx

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MediaInfo.css';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { getUserById } from '../../../../../redux/features/user/userSlice';
import FileUploadCrop from '../../../../../components/FileUploadAndCrop/CropImage/FileUploadCrop';
import ImageUpload from './ImageUpload/ImageUpload';
import ImagePreview from './ImagePreview/ImagePreview';
import NavigationIcons from './NavigationIcons/NavigationIcons';
import useImageHandlers from './hooks/useImageHandlers';
import useImageEffects from './hooks/useImageEffects';
import { encodeFileToBase64 } from '../../../../../utils/fileUtils'; // Ensure this import is correct

interface FormValues {
  images: File[];
}

interface User {
  _id: string;
  // Other properties if needed
}

interface UserData {
  images: string[];
  // Other properties if needed
}

const MediaInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as User | null; // Ensure correct typing
  const userData = useSelector((state: RootState) => state.user.user) as UserData | null; // Ensure correct typing
  const imageError = useSelector((state: RootState) => state.images.error);
  const imageErrors = useSelector((state: RootState) => state.images.imageErrors);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: { images: [] },
    validationSchema: Yup.object({
      images: Yup.array().max(5, 'You can upload up to 5 images')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log('Submitting form with values:', values);

      if (user && user._id && userData?.images) {
        const base64Images = await Promise.all(
          values.images.slice(0, 5 - userData.images.length).map(async (image) => {
            const base64 = await encodeFileToBase64(image);
            console.log(`Encoded base64 for ${image.name}`);
            return { imageName: image.name, imageBase64: base64 };
          })
        );

        try {
          if (base64Images.length === 1) {
            await handleSingleImageUpload(base64Images[0]);
          } else {
            await handleMultipleImagesUpload(base64Images);
          }
        } catch (error) {
          console.error('Error adding images:', error);
        }

        setIsSubmitting(false);
        setShowSuccessMessage(true);
        formik.setFieldValue('images', []); // Clear the images from formik after submission
      }
    }
  });

  useImageEffects({
    user,
    dispatch,
    userData,
    setImagePreviews,
    setIsSaveDisabled,
    croppingImage,
    formik
  });

  const {
    handleSingleImageUpload,
    handleMultipleImagesUpload,
    handleImagesChange,
    handleDeleteImage,
    handleCropComplete,
    openCropModal
  } = useImageHandlers({
    user,
    userData,
    formik,
    setIsSubmitting,
    setShowSuccessMessage,
    setImagePreviews,
    setCroppingImage,
    setIsSaveDisabled,
    setCroppingFile,
    setCurrentImageIndex,
    imagePreviews,
    croppingFile,
    currentImageIndex,
    croppingImage
  });


return (
  <div className="MediaInfo-container">
    <NavigationIcons navigate={navigate} />
    <form onSubmit={formik.handleSubmit} className="MediaInfo-form">
      <ImageUpload
        formik={formik}
        handleImagesChange={handleImagesChange}
        isSaveDisabled={isSaveDisabled}
        userData={userData || { images: [] }} // Provide a fallback for userData
      />
      <ImagePreview
        imagePreviews={imagePreviews}
        imageErrors={imageErrors}
        openCropModal={openCropModal}
        handleDeleteImage={handleDeleteImage}
      />
      <div className="MediaInfo-button-container">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSaveDisabled || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="btn btn-success ms-2"
          onClick={() => navigate(`/user-profile/${user?._id}`)}
        >
          Finish
        </button>
      </div>
    </form>

    {showSuccessMessage && (
      <div className="MediaInfo-success-message mt-3">
        <p>Your image has been added successfully.</p>
      </div>
    )}

    {croppingImage && (
      <FileUploadCrop
        imageSrc={croppingImage}
        onCropComplete={handleCropComplete}
        onClose={() => setCroppingImage(null)}
      />
    )}
  </div>
);
};

export default MediaInfo;
