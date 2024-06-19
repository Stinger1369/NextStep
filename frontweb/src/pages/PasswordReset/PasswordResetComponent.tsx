// src/pages/PasswordReset/PasswordResetComponent.tsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./PasswordResetComponent.css";

const PasswordResetComponent: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Ajouter la logique de récupération de mot de passe ici
      } catch (error) {
        setErrors({ email: "An error occurred. Please try again." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="password-reset-container">
      <form onSubmit={formik.handleSubmit} className="password-reset-form">
        <div className="form-field">
          <input
            type="email"
            id="email"
            {...formik.getFieldProps("email")}
            placeholder="Email"
            className={`reset-input ${
              formik.touched.email && formik.errors.email ? "error-input" : ""
            }`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="reset-button"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetComponent;
