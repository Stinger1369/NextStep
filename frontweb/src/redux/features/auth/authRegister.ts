import { AppDispatch } from "../../store";
import { register } from "./authSlice";

export const registerUser = async (
  formData: FormData,
  dispatch: AppDispatch
) => {
  try {
    await dispatch(register(formData)).unwrap();
  } catch (error) {
    console.error("Register error:", error);
  }
};
