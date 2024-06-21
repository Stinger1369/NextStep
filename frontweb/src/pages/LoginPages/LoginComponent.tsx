import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Importer AxiosError
import "./LoginComponent.css";

const LoginComponent: React.FC = () => {
  const { login, user, logout } = useAuth();
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
    validationSchema: Yup.object({
      emailOrPhone: Yup.string().required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.emailOrPhone, values.password);
        navigate("/"); // Rediriger vers la page d'accueil après une connexion réussie
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            setErrors({
              emailOrPhone:
                "Email or phone does not exist. Would you like to register?",
            });
          } else if (error.response && error.response.status === 400) {
            setErrors({
              password: "Incorrect password. Forgot your password?",
            });
          } else {
            setErrors({ emailOrPhone: "An error occurred. Please try again." });
          }
        } else {
          setErrors({
            emailOrPhone: "An unknown error occurred. Please try again.",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  function isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }

  return (
    <div className="login-container">
      {user ? (
        <div>
          <p>Welcome, {user.firstName ? user.firstName : user.emailOrPhone}!</p>
          <button onClick={() => navigate("/profile-edit")}>
            Complete your profile
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="form-field">
            <input
              type="text"
              id="emailOrPhone"
              {...formik.getFieldProps("emailOrPhone")}
              placeholder="Email or Phone"
              className={`login-input ${
                formik.touched.emailOrPhone && formik.errors.emailOrPhone
                  ? "error-input"
                  : ""
              }`}
            />
            {formik.touched.emailOrPhone && formik.errors.emailOrPhone ? (
              <div className="error">{formik.errors.emailOrPhone}</div>
            ) : null}
          </div>
          <div className="form-field">
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              placeholder="Password"
              className={`login-input ${
                formik.touched.password && formik.errors.password
                  ? "error-input"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
          <Link to="/password-reset" className="forgot-password-link">
            Forgot your password?
          </Link>
        </form>
      )}
    </div>
  );
};

export default LoginComponent;
