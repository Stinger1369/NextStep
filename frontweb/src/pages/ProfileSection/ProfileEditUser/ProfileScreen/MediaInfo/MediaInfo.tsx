import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MediaInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateUser, getUserById } from '../../../../../redux/features/user/userSlice';
import { addImage, addImages, deleteImage } from '../../../../../redux/features/image/imageSlice';
import { userFriendlyMessages } from '../../../../../utils/errorMessages';
import { encodeFileToBase64 } from '../../../../../utils/fileUtils';
import { handleImageErrors, ImageError } from '../../../../../utils/errorHandler';
import FileUploadCrop from '../../../../../components/FileUploadAndCrop/CropImage/FileUploadCrop';

interface FormValues {
  images: File[];
}

const MediaInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
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
      }
    }
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData?.images) {
      setImagePreviews(userData.images);
    }
  }, [userData]);

  useEffect(() => {
    setIsSaveDisabled(formik.values.images.length === 0 || (userData?.images?.length ?? 0) >= 5);
  }, [formik.values.images, userData]);

  const handleSingleImageUpload = async (image: { imageName: string; imageBase64: string }) => {
    if (user?._id && userData) {
      try {
        const imageUrl = await dispatch(addImage({ userId: user._id, ...image })).unwrap();
        console.log('Uploaded image URL:', imageUrl);
        const updatedValues = {
          ...userData,
          images: Array.from(new Set([...(userData.images || []), imageUrl]))
        };
        console.log('Updating user with media info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error adding image:', error.message);
        } else {
          console.error('Unexpected error adding image:', error);
        }
      }
    }
  };

  const handleMultipleImagesUpload = async (images: { imageName: string; imageBase64: string }[]) => {
    if (user?._id && userData) {
      try {
        const results = await dispatch(addImages({ userId: user._id, images })).unwrap();
        console.log('Uploaded images results:', results);

        const successfulImages = results.filter((result) => result.status === 'success').map((result) => result.url as string);

        const updatedValues = {
          ...userData,
          images: Array.from(new Set([...(userData.images || []), ...successfulImages]))
        };
        console.log('Updating user with media info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));

        const fixedResults: ImageError[] = results.map((result) => ({
          ...result,
          message: result.message || 'Unknown error occurred',
          code: result.code || null // Assurez-vous que 'code' est soit une chaîne, soit null
        }));

        handleImageErrors(fixedResults);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error adding images:', error.message);
        } else {
          console.error('Unexpected error adding images:', error);
        }
      }
    }
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    const validFiles = files.slice(0, 5 - (userData?.images?.length || 0));
    console.log('Selected image files:', validFiles);

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    formik.setFieldValue('images', validFiles);
    setIsSaveDisabled(validFiles.length === 0);
  };

  const handleDeleteImage = async (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from propagating to parent elements
    if (user?._id) {
      try {
        const imageName = imageUrl.split('/').pop(); // Extract image name correctly
        if (!imageName) {
          throw new Error('Invalid image URL');
        }

        await dispatch(deleteImage({ userId: user._id, imageName })).unwrap();
        await dispatch(getUserById(user._id));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting image:', error.message);
        } else {
          console.error('Unexpected error deleting image:', error);
        }
      }
    }
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    const newFile = new File([croppedImage], croppingFile?.name || 'cropped.jpg', {
      type: croppingFile?.type || 'image/jpeg'
    });
    const preview = URL.createObjectURL(newFile);
    if (currentImageIndex !== null && userData?.images) {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[currentImageIndex] = preview;
      setImagePreviews(updatedPreviews);
      const base64 = await encodeFileToBase64(newFile);
      if (user) {
        try {
          // First, delete the old image
          const oldImageUrl = userData.images[currentImageIndex];
          const oldImageName = oldImageUrl.split('/').pop();
          if (oldImageName) {
            await dispatch(deleteImage({ userId: user._id, imageName: oldImageName })).unwrap();
          }

          // Then, add the new cropped image
          await dispatch(addImage({ userId: user._id, imageName: newFile.name, imageBase64: base64 })).unwrap();

          // Refresh the user data to get the updated image URLs
          await dispatch(getUserById(user._id));
        } catch (error) {
          console.error('Error updating image:', error);
        }
      }
    } else {
      setImagePreviews((prevPreviews) => [...prevPreviews, preview]);
      formik.setFieldValue('images', [...formik.values.images, newFile]);
    }
    setCroppingImage(null);
    setCroppingFile(null);
    setCurrentImageIndex(null);
  };

  const openCropModal = (src: string, index: number) => {
    setCroppingImage(src);
    setCurrentImageIndex(index);
    const file = formik.values.images[index];
    setCroppingFile(file);
  };

  return (
    <div className="media-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate('/profile-edit-user/bio-skills-info')} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <form onSubmit={formik.handleSubmit} className="media-info-form">
        <div className="form-group">
          <label htmlFor="images">Upload Images (up to 5)</label>
          <div className="upload-icon-container">
            <FaPlus className="upload-icon" />
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="form-control"
              disabled={userData?.images?.length !== undefined && userData.images.length >= 5}
            />
          </div>
          {formik.touched.images && formik.errors.images ? (
            <div className="text-danger">
              {Array.isArray(formik.errors.images) && formik.errors.images.map((error, index) => <div key={index}>{typeof error === 'string' ? error : 'Invalid file type'}</div>)}
            </div>
          ) : null}
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
                      Error: {userFriendlyMessages[error.code as keyof typeof userFriendlyMessages] || error.message.split(':')[0]}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {imageError && (
          <div className="alert alert-danger" role="alert">
            {userFriendlyMessages[imageError.code as keyof typeof userFriendlyMessages] || imageError.message.split(':')[0]}
          </div>
        )}

        <div className="button-container">
          <button type="submit" className="btn btn-primary" disabled={isSaveDisabled || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn btn-success ms-2" onClick={() => navigate(`/user-profile/${user?._id}`)}>
            Finish
          </button>
        </div>
      </form>

      {showSuccessMessage && (
        <div className="success-message mt-3">
          <p>Your image has been added successfully.</p>
        </div>
      )}

      {croppingImage && <FileUploadCrop imageSrc={croppingImage} onCropComplete={handleCropComplete} onClose={() => setCroppingImage(null)} />}
    </div>
  );
};

export default MediaInfo;
