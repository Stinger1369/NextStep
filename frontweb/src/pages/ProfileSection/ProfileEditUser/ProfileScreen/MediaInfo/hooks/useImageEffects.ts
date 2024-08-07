import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { FormikProps } from 'formik'; // Import FormikProps from formik
import { useDispatch } from 'react-redux'; // Import useDispatch
import { AppDispatch } from '../../../../../../redux/store'; // Import AppDispatch from your store
import { getUserById } from '../../../../../../redux/features/user/userSlice'; // Import getUserById action
import ImagePreviewItem  from '../MediaInfo'; // Import ImagePreviewItem if it's defined elsewhere

// Define the interface for image previews if not already defined
interface ImagePreviewItem {
  src: string;
  file: File;
}

interface UseImageEffectsProps {
  user: { _id: string } | null; // Allow null type for user
  dispatch: AppDispatch; // Correct type for dispatch
  userData: { images: string[] } | null; // Allow null type for userData
  setImagePreviews: Dispatch<SetStateAction<ImagePreviewItem[]>>; // Correct type
  setIsSaveDisabled: Dispatch<SetStateAction<boolean>>;
  croppingImage: string | null;
  formik: FormikProps<{ images: File[] }>; // Correct type for Formik
}

const useImageEffects = ({
  user,
  dispatch,
  userData,
  setImagePreviews,
  setIsSaveDisabled,
  croppingImage,
  formik
}: UseImageEffectsProps) => {
  useEffect(() => {
    if (user && user._id) {
      dispatch(getUserById(user._id)); // Dispatch getUserById action
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData && userData.images) {
      // Update this part to set ImagePreviewItem
      const imagePreviewItems: ImagePreviewItem[] = userData.images.map((imageSrc) => ({
        src: imageSrc,
        file: new File([], 'dummy') // Dummy file; replace with actual file if needed
      }));
      setImagePreviews(imagePreviewItems);
    }
  }, [userData, setImagePreviews]);

  useEffect(() => {
    setIsSaveDisabled(
      croppingImage !== null ||
        formik.values.images.length === 0 ||
        (userData?.images?.length ?? 0) >= 5
    );
  }, [croppingImage, formik.values.images, userData, setIsSaveDisabled]);
};

export default useImageEffects;
