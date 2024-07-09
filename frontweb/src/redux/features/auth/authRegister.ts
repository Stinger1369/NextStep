import { AppDispatch } from '../../store';
import { register } from './authSlice';
import { ApiError } from '../../../../src/types';

export const registerUser = async (formData: FormData, dispatch: AppDispatch) => {
  try {
    console.log('Dispatching register action with formData:', formData);
    await dispatch(register(formData)).unwrap();
  } catch (error) {
    console.log('Error caught in registerUser:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    } else if (error && typeof error === 'object' && 'message' in error) {
      const apiError = error as ApiError;
      console.error('Error object message:', apiError.message);
      throw new Error(apiError.message);
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unknown error occurred.');
    }
  }
};
