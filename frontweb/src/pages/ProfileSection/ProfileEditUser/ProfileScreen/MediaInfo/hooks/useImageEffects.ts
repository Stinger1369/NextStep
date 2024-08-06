// hooks/useImageEffects.ts

import { useEffect } from 'react';
import { getUserById } from '../../../../../../redux/features/user/userSlice';
import { AppDispatch } from '../../../../../../redux/store';
import { FormikProps } from 'formik';

interface UseImageEffectsProps {
  user: { _id: string } | null; // Allow null type for user
  dispatch: AppDispatch;
  userData: { images: string[] } | null; // Allow null type for userData
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  croppingImage: string | null;
  formik: FormikProps<{ images: File[] }>;
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
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData && userData.images) {
      setImagePreviews(userData.images);
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
