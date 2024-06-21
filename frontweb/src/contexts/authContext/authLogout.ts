import axiosInstance from "../../axiosConfig";

export const logout = (setUser: Function, setToken: Function) => {
  setToken(null);
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axiosInstance.defaults.headers.common["Authorization"];
};
