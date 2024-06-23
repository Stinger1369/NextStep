import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddressInfo.css";

const AddressInfo: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    validationSchema: Yup.object({
      street: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zipCode: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      // Save and navigate to next step
      console.log("Address Info:", values);
      navigate("/profile-edit-user/profession-info");
    },
  });

  const handleSave = () => {
    console.log("Saved Address Info:", formik.values);
    // Add any save logic here if necessary
  };

  return (
    <div className="address-info-container">
      <div className="header-icons">
        <FaArrowLeft
          className="icon"
          onClick={() => navigate("/profile-edit-user/personal-info")}
        />
        <FaTimes className="icon" onClick={() => navigate("/")} />
      </div>
      <form onSubmit={formik.handleSubmit} className="address-info-form">
        <div className="mb-3">
          <label htmlFor="street" className="form-label">
            Street
          </label>
          <input
            type="text"
            id="street"
            {...formik.getFieldProps("street")}
            className="form-control"
          />
          {formik.touched.street && formik.errors.street ? (
            <div className="text-danger">{formik.errors.street}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            id="city"
            {...formik.getFieldProps("city")}
            className="form-control"
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="text-danger">{formik.errors.city}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            type="text"
            id="state"
            {...formik.getFieldProps("state")}
            className="form-control"
          />
          {formik.touched.state && formik.errors.state ? (
            <div className="text-danger">{formik.errors.state}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="zipCode" className="form-label">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            {...formik.getFieldProps("zipCode")}
            className="form-control"
          />
          {formik.touched.zipCode && formik.errors.zipCode ? (
            <div className="text-danger">{formik.errors.zipCode}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            id="country"
            {...formik.getFieldProps("country")}
            className="form-control"
          />
          {formik.touched.country && formik.errors.country ? (
            <div className="text-danger">{formik.errors.country}</div>
          ) : null}
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
    </div>
  );
};

export default AddressInfo;
