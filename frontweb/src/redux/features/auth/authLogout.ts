// src/redux/features/auth/authLogout.ts
import { AppDispatch } from "../../store";
import { logout } from "./authSlice";

export const performLogout = () => (dispatch: AppDispatch) => {
  dispatch(logout());
};
