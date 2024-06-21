import axiosInstance from "../../axiosConfig";

export const login = async (
  emailOrPhone: string,
  password: string,
  setUser: Function,
  setToken: Function
) => {
  const response = await axiosInstance.post("/auth/login", {
    emailOrPhone,
    password,
  });
  setToken(response.data.token);
  setUser(response.data.user);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${response.data.token}`;
};
