import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PersonalInfo.css";

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      sex: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      phone: Yup.string(),
      dateOfBirth: Yup.date(),
      sex: Yup.string(),
    }),
    onSubmit: (values) => {
      // Save and navigate to next step
      console.log("Personal Info:", values);
      navigate("/profile-edit-user/address-info");
    },
  });

  const handleSave = () => {
    console.log("Saved Info:", formik.values);
    // Add any save logic here if necessary
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="personal-info-form container"
    >
      <div className="row">
        <div className="col-md-6 form-field">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-danger">{formik.errors.firstName}</div>
          ) : null}
        </div>

        <div className="col-md-6 form-field">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-danger">{formik.errors.lastName}</div>
          ) : null}
        </div>

        <div className="col-md-6 form-field">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="form-control"
            {...formik.getFieldProps("phone")}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-danger">{formik.errors.phone}</div>
          ) : null}
        </div>

        <div className="col-md-6 form-field">
          <label htmlFor="dateOfBirth" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            className="form-control"
            {...formik.getFieldProps("dateOfBirth")}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <div className="text-danger">{formik.errors.dateOfBirth}</div>
          ) : null}
        </div>

        <div className="col-md-6 form-field">
          <label htmlFor="sex" className="form-label">
            Sex
          </label>
          <select
            id="sex"
            className="form-control"
            {...formik.getFieldProps("sex")}
          >
            <option value="" label="Select sex" />
            <option value="male" label="Male" />
            <option value="female" label="Female" />
            <option value="other" label="Other" />
          </select>
          {formik.touched.sex && formik.errors.sex ? (
            <div className="text-danger">{formik.errors.sex}</div>
          ) : null}
        </div>
      </div>

      <div className="button-container mt-3">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  );
};

export default PersonalInfo;
