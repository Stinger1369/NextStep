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
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);
        navigate("/"); // Rediriger vers la page d'accueil après une connexion réussie
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response && error.response.status === 404) {
            setErrors({
              email: "Email does not exist. Would you like to register?",
            });
          } else if (error.response && error.response.status === 400) {
            setErrors({
              password: "Incorrect password. Forgot your password?",
            });
          } else {
            setErrors({ email: "An error occurred. Please try again." });
          }
        } else {
          setErrors({ email: "An unknown error occurred. Please try again." });
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
          <p>Welcome, {user.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="form-field">
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              placeholder="Email"
              className={`login-input ${
                formik.touched.email && formik.errors.email ? "error-input" : ""
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
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
