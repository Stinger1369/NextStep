import axiosInstance from "../../axiosConfig";

export const register = async (formData: FormData, setUser: Function) => {
  try {
    const response = await axiosInstance.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const userData = response.data.user;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
