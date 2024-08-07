import { useDispatch } from 'react-redux';
import {
  addImage,
  addImages,
  deleteImage
} from '../../../../../../redux/features/image/imageSlice';
import { updateUser, getUserById } from '../../../../../../redux/features/user/userSlice';
import { encodeFileToBase64 } from '../../../../../../utils/fileUtils';
import { handleImageErrors, ImageError } from '../../../../../../utils/errorHandler';
import { FormikProps } from 'formik';
import { AppDispatch } from '../../../../../../redux/store';
import { ERROR_CODES } from '../../../../../../utils/errorCodes';

// Interface for image preview
interface ImagePreviewItem {
  src: string;
  file: File;
}

interface ErrorResponse {
  code: string;
  message: string;
}

interface UseImageHandlersProps {
  user: { _id: string } | null;
  userData: { images: string[] } | null;
  formik: FormikProps<{ images: File[] }>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setImagePreviews: React.Dispatch<React.SetStateAction<ImagePreviewItem[]>>; // Updated type
  setCroppingImage: React.Dispatch<React.SetStateAction<string | null>>;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setCroppingFile: React.Dispatch<React.SetStateAction<File | null>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  imagePreviews: ImagePreviewItem[]; // Updated type
  croppingFile: File | null;
  currentImageIndex: number | null;
  croppingImage: string | null;
}

const useImageHandlers = ({
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
}: UseImageHandlersProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSingleImageUpload = async (image: { imageName: string; imageBase64: string }) => {
    if (user && user._id && userData) {
      try {
        const imageUrl = await dispatch(addImage({ userId: user._id, ...image })).unwrap();
        const updatedValues = {
          ...userData,
          images: Array.from(new Set([...(userData.images || []), ...imageUrl.images]))
        };
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
        formik.setFieldValue('images', []); // Reset images after upload
      } catch (error) {
        if (error && typeof error === 'object' && 'code' in error) {
          const errorCode = (error as ErrorResponse).code;
          if (errorCode === ERROR_CODES.ErrImageNSFW) {
            const imageIndex = formik.values.images.findIndex(
              (img) => img.name === image.imageName
            );
            if (imageIndex !== -1) {
              setImagePreviews((prev) => prev.filter((_, index) => index !== imageIndex));
              formik.setFieldValue(
                'images',
                formik.values.images.filter((_, index) => index !== imageIndex)
              );
              console.info('Inappropriate image removed automatically');
            }

            // Clear the error for NSFW images
            formik.setFieldError('images', undefined); // Clear formik error if any
          }
        }
        console.info('Error occurred while uploading image:', error);
      }
    }
  };

  const handleMultipleImagesUpload = async (
    images: { imageName: string; imageBase64: string }[]
  ) => {
    if (user && user._id && userData) {
      try {
        const results = await dispatch(addImages({ userId: user._id, images })).unwrap();
        console.log('Uploaded images results:', results);

        const successfulImages = results
          .filter((result) => result.status === 'success')
          .map((result) => result.url as string);

        const updatedValues = {
          ...userData,
          images: Array.from(new Set([...(userData.images || []), ...successfulImages]))
        };
        console.log('Updating user with media info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));

        const fixedResults: ImageError[] = results.map((result) => ({
          ...result,
          message: result.message || 'Unknown error occurred',
          code: result.code || 'UNKNOWN_ERROR' // Provide a default string for code
        }));

        handleImageErrors(fixedResults);

        // Supprimer automatiquement les images inappropriées
        results.forEach((result) => {
          if (result.status === 'failed' && result.code === ERROR_CODES.ErrImageNSFW) {
            const imageIndex = formik.values.images.findIndex(
              (img) => img.name === result.imageName
            );
            if (imageIndex !== -1) {
              setImagePreviews((prev) => prev.filter((_, index) => index !== imageIndex));
              formik.setFieldValue(
                'images',
                formik.values.images.filter((_, index) => index !== imageIndex)
              );
              console.log('Inappropriate image removed automatically');
            }
          }
        });

        // Clear any remaining error for NSFW images
        formik.setFieldError('images', undefined);

        formik.setFieldValue('images', []); // Reset images after upload
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

    const previews: ImagePreviewItem[] = validFiles.map((file) => ({
      src: URL.createObjectURL(file),
      file
    }));

    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    formik.setFieldValue('images', validFiles);
    setIsSaveDisabled(validFiles.length === 0 && !croppingImage);
  };

  const handleDeleteImage = async (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user && user._id) {
      try {
        const imageName = imageUrl.split('/').pop();
        if (!imageName) {
          throw new Error('Invalid image URL');
        }

        await dispatch(deleteImage({ userId: user._id, imageName })).unwrap();
        await dispatch(getUserById(user._id)); // Refresh user data
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
      updatedPreviews[currentImageIndex] = { src: preview, file: newFile };
      setImagePreviews(updatedPreviews);
      const base64 = await encodeFileToBase64(newFile);
      if (user && user._id) {
        try {
          // First, delete the old image
          const oldImageUrl = userData.images[currentImageIndex];
          const oldImageName = oldImageUrl.split('/').pop();
          if (oldImageName) {
            await dispatch(deleteImage({ userId: user._id, imageName: oldImageName })).unwrap();
          }

          // Then, add the new cropped image
          await dispatch(
            addImage({ userId: user._id, imageName: newFile.name, imageBase64: base64 })
          ).unwrap();

          // Refresh the user data to get the updated image URLs
          await dispatch(getUserById(user._id));
        } catch (error) {
          console.error('Error updating image:', error);
        }
      }
    } else {
      setImagePreviews((prevPreviews) => [...prevPreviews, { src: preview, file: newFile }]);
      formik.setFieldValue('images', [...formik.values.images, newFile]);
    }
    setCroppingImage(null);
    setCroppingFile(null);
    setCurrentImageIndex(null);

    // Enable save button after cropping is done
    setIsSaveDisabled(false);
  };

  const openCropModal = (src: string, index: number) => {
    setCroppingImage(src);
    setCurrentImageIndex(index);
    const file = formik.values.images[index];
    setCroppingFile(file);
  };

  return {
    handleSingleImageUpload,
    handleMultipleImagesUpload,
    handleImagesChange,
    handleDeleteImage,
    handleCropComplete,
    openCropModal
  };
};

export default useImageHandlers;
