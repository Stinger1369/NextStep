import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PasswordResetRequestComponent.css";

const PasswordResetRequestComponent: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
    },
    validationSchema: Yup.object({
      emailOrPhone: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await requestPasswordReset(values.emailOrPhone);
        localStorage.setItem("resetEmailOrPhone", values.emailOrPhone); // Stocker l'email dans le stockage local
        setMessage("Password reset link sent to your email.");
        navigate("/password-reset"); // Redirige vers la page de réinitialisation du mot de passe
      } catch (error) {
        console.error("Request password reset error:", error);
        setMessage("Error requesting password reset.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="password-reset-request-container">
      <h2>Request Password Reset</h2>
      {message && <div className="message">{message}</div>}
      <form
        onSubmit={formik.handleSubmit}
        className="password-reset-request-form"
      >
        <div className="form-field">
          <input
            type="text"
            id="emailOrPhone"
            {...formik.getFieldProps("emailOrPhone")}
            placeholder="Email or Phone"
            className={`input ${
              formik.touched.emailOrPhone && formik.errors.emailOrPhone
                ? "error-input"
                : ""
            }`}
          />
          {formik.touched.emailOrPhone && formik.errors.emailOrPhone ? (
            <div className="error">{formik.errors.emailOrPhone}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequestComponent;
