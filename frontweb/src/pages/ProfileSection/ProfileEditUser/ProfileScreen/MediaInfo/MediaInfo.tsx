import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MediaInfo.css';
import { RootState, AppDispatch } from '../../../../../redux/store';
import FileUploadCrop from '../../../../../components/FileUploadAndCrop/CropImage/FileUploadCrop';
import ImageUpload from './ImageUpload/ImageUpload';
import ImagePreview from './ImagePreview/ImagePreview';
import NavigationIcons from './NavigationIcons/NavigationIcons';
import VideoUpload from './VideoUpload/VideoUpload'; // Import the VideoUpload component
import useImageHandlers from './hooks/useImageHandlers';
import useImageEffects from './hooks/useImageEffects';
import { encodeFileToBase64 } from '../../../../../utils/fileUtils';
import { handleVideoErrors } from '../../../../../utils/errorHandler';

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
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const userData = useSelector((state: RootState) => state.user.user) as UserData | null;
  const imageError = useSelector((state: RootState) => state.images.error);
  const imageErrors = useSelector((state: RootState) => state.images.imageErrors);
  const videoError = useSelector((state: RootState) => state.videos.error); // Add video error selector

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

      // Using optional chaining (?.) for better readability
      if (user?._id && userData?.images) {
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

  // New function to handle video upload
  const handleVideoUpload = async (file: File) => {
    if (!user?._id) {
      // Using optional chaining
      console.error('User ID is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('user_id', user._id);

      const response = await fetch('http://localhost:7000/server-video/ajouter-video', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        const errorResult = result as {
          errors: { videoName: string; message: string; code: string }[];
        }; // Cast to expected error response

        // Map errors to include status
        const mappedErrors = errorResult.errors.map((error) => ({
          ...error,
          status: 'failed' // Add status to each error
        }));

        console.error('Error uploading video:', mappedErrors);
        handleVideoErrors(mappedErrors); // Handle video errors
        setShowSuccessMessage(false);
      } else {
        console.log('Video uploaded successfully:', result.link);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
    setIsSubmitting(false);
  };

  // Effect to clear the success message after a few seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  return (
    <div className="media-info-container">
      {' '}
      {/* Using kebab-case for BEM class names */}
      <NavigationIcons navigate={navigate} />
      <form onSubmit={formik.handleSubmit} className="media-info-form">
        {' '}
        {/* Using kebab-case for BEM class names */}
        {/* Bouton pour uploader des images */}
        <ImageUpload
          formik={formik}
          handleImagesChange={handleImagesChange}
          isSaveDisabled={isSaveDisabled}
          userData={userData || { images: [] }}
        />
        {/* Preview des images */}
        <ImagePreview
          imagePreviews={imagePreviews}
          imageErrors={imageErrors}
          openCropModal={openCropModal}
          handleDeleteImage={handleDeleteImage}
        />
        <div className="media-info-button-container">
          {' '}
          {/* Using kebab-case for BEM class names */}
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
            onClick={() => navigate(`/user-profile/${user?._id}`)} // Using optional chaining
          >
            Finish
          </button>
        </div>
      </form>
      {/* Bouton pour uploader des vidéos */}
      <VideoUpload handleVideoUpload={handleVideoUpload} />
      {showSuccessMessage && (
        <div className="media-info-success-message mt-3">
          {' '}
          {/* Using kebab-case for BEM class names */}
          <p>Your image or video has been added successfully.</p>
        </div>
      )}
      {imageError && (
        <div className="alert alert-danger mt-3" role="alert">
          {imageError.message}
        </div>
      )}
      {videoError && (
        <div className="alert alert-danger mt-3" role="alert">
          {videoError.message}
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
