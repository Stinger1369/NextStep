import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  getCompanyById,
  updateCompany,
} from "../../../redux/features/company/companySlice";
import { useParams } from "react-router-dom";
import "./ProfileEditRecruits.css";

const ProfileEditRecruits: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const company = useSelector((state: RootState) => state.company.company);
  const status = useSelector((state: RootState) => state.company.status);
  const error = useSelector((state: RootState) => state.company.error);

  useEffect(() => {
    if (id) {
      dispatch(getCompanyById(id));
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyRegistrationNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      numberOfEmployees: 0,
      industryType: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      description: "",
      foundedDate: "" as string | Date,
      logo: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      instagram: "",
      companySize: "small" as "small" | "medium" | "large" | undefined,
      headquarterLocation: "",
      subsidiaries: [] as string[],
      certifications: [] as string[],
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Required"),
      companyRegistrationNumber: Yup.string().required("Required"),
      street: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zipCode: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      numberOfEmployees: Yup.number().required("Required"),
      industryType: Yup.string().required("Required"),
      contactEmail: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      contactPhone: Yup.string().required("Required"),
      website: Yup.string().url("Invalid URL"),
      description: Yup.string(),
      foundedDate: Yup.date().nullable(),
      logo: Yup.string().url("Invalid URL"),
      linkedin: Yup.string().url("Invalid URL"),
      facebook: Yup.string().url("Invalid URL"),
      twitter: Yup.string().url("Invalid URL"),
      instagram: Yup.string().url("Invalid URL"),
      companySize: Yup.string()
        .oneOf(["small", "medium", "large"])
        .required("Required") as Yup.StringSchema<"small" | "medium" | "large">,
      headquarterLocation: Yup.string(),
      subsidiaries: Yup.array().of(Yup.string()),
      certifications: Yup.array().of(Yup.string()),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedValues = {
          ...values,
          foundedDate: values.foundedDate
            ? new Date(values.foundedDate)
            : undefined,
          companySize: values.companySize as
            | "small"
            | "medium"
            | "large"
            | undefined,
        };

        await dispatch(
          updateCompany({ id: company?._id || "", companyData: updatedValues })
        ).unwrap();
        setSubmitting(false);
        // Navigate to another page or show a success message
      } catch (error) {
        setSubmitting(false);
        // Handle the error
      }
    },
  });

  useEffect(() => {
    if (company) {
      formik.setValues({
        companyName: company.companyName || "",
        companyRegistrationNumber: company.companyRegistrationNumber || "",
        street: company.address.street || "",
        city: company.address.city || "",
        state: company.address.state || "",
        zipCode: company.address.zipCode || "",
        country: company.address.country || "",
        numberOfEmployees: company.numberOfEmployees || 0,
        industryType: company.industryType || "",
        contactEmail: company.contactEmail || "",
        contactPhone: company.contactPhone || "",
        website: company.website || "",
        description: company.description || "",
        foundedDate: company.foundedDate ? new Date(company.foundedDate) : "",
        logo: company.logo || "",
        linkedin: company.socialMediaLinks?.linkedin || "",
        facebook: company.socialMediaLinks?.facebook || "",
        twitter: company.socialMediaLinks?.twitter || "",
        instagram: company.socialMediaLinks?.instagram || "",
        companySize: company.companySize || "small",
        headquarterLocation: company.headquarterLocation || "",
        subsidiaries: company.subsidiaries || [],
        certifications: company.certifications || [],
      });
    }
  }, [company]);
  return (
    <div className="profile-edit-recruits-container">
      <h1>Edit Company Profile</h1>
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <form
        onSubmit={formik.handleSubmit}
        className="profile-edit-recruits-form"
      >
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            {...formik.getFieldProps("companyName")}
            className={
              formik.touched.companyName && formik.errors.companyName
                ? "error-input"
                : ""
            }
          />
          {formik.touched.companyName && formik.errors.companyName ? (
            <div className="error">{formik.errors.companyName}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="companyRegistrationNumber">
            Company Registration Number
          </label>
          <input
            type="text"
            id="companyRegistrationNumber"
            {...formik.getFieldProps("companyRegistrationNumber")}
            className={
              formik.touched.companyRegistrationNumber &&
              formik.errors.companyRegistrationNumber
                ? "error-input"
                : ""
            }
          />
          {formik.touched.companyRegistrationNumber &&
          formik.errors.companyRegistrationNumber ? (
            <div className="error">
              {formik.errors.companyRegistrationNumber}
            </div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            {...formik.getFieldProps("street")}
            className={
              formik.touched.street && formik.errors.street ? "error-input" : ""
            }
          />
          {formik.touched.street && formik.errors.street ? (
            <div className="error">{formik.errors.street}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            {...formik.getFieldProps("city")}
            className={
              formik.touched.city && formik.errors.city ? "error-input" : ""
            }
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="error">{formik.errors.city}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            {...formik.getFieldProps("state")}
            className={
              formik.touched.state && formik.errors.state ? "error-input" : ""
            }
          />
          {formik.touched.state && formik.errors.state ? (
            <div className="error">{formik.errors.state}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            {...formik.getFieldProps("zipCode")}
            className={
              formik.touched.zipCode && formik.errors.zipCode
                ? "error-input"
                : ""
            }
          />
          {formik.touched.zipCode && formik.errors.zipCode ? (
            <div className="error">{formik.errors.zipCode}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            {...formik.getFieldProps("country")}
            className={
              formik.touched.country && formik.errors.country
                ? "error-input"
                : ""
            }
          />
          {formik.touched.country && formik.errors.country ? (
            <div className="error">{formik.errors.country}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="numberOfEmployees">Number of Employees</label>
          <input
            type="number"
            id="numberOfEmployees"
            {...formik.getFieldProps("numberOfEmployees")}
            className={
              formik.touched.numberOfEmployees &&
              formik.errors.numberOfEmployees
                ? "error-input"
                : ""
            }
          />
          {formik.touched.numberOfEmployees &&
          formik.errors.numberOfEmployees ? (
            <div className="error">{formik.errors.numberOfEmployees}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="industryType">Industry Type</label>
          <input
            type="text"
            id="industryType"
            {...formik.getFieldProps("industryType")}
            className={
              formik.touched.industryType && formik.errors.industryType
                ? "error-input"
                : ""
            }
          />
          {formik.touched.industryType && formik.errors.industryType ? (
            <div className="error">{formik.errors.industryType}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            {...formik.getFieldProps("contactEmail")}
            className={
              formik.touched.contactEmail && formik.errors.contactEmail
                ? "error-input"
                : ""
            }
          />
          {formik.touched.contactEmail && formik.errors.contactEmail ? (
            <div className="error">{formik.errors.contactEmail}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Contact Phone</label>
          <input
            type="text"
            id="contactPhone"
            {...formik.getFieldProps("contactPhone")}
            className={
              formik.touched.contactPhone && formik.errors.contactPhone
                ? "error-input"
                : ""
            }
          />
          {formik.touched.contactPhone && formik.errors.contactPhone ? (
            <div className="error">{formik.errors.contactPhone}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            {...formik.getFieldProps("website")}
            className={
              formik.touched.website && formik.errors.website
                ? "error-input"
                : ""
            }
          />
          {formik.touched.website && formik.errors.website ? (
            <div className="error">{formik.errors.website}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...formik.getFieldProps("description")}
            className={
              formik.touched.description && formik.errors.description
                ? "error-input"
                : ""
            }
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="error">{formik.errors.description}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="foundedDate">Founded Date</label>
          <input
            type="date"
            id="foundedDate"
            {...formik.getFieldProps("foundedDate")}
            className={
              formik.touched.foundedDate && formik.errors.foundedDate
                ? "error-input"
                : ""
            }
          />
          {formik.touched.foundedDate && formik.errors.foundedDate ? (
            <div className="error">{formik.errors.foundedDate}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="logo">Logo URL</label>
          <input
            type="url"
            id="logo"
            {...formik.getFieldProps("logo")}
            className={
              formik.touched.logo && formik.errors.logo ? "error-input" : ""
            }
          />
          {formik.touched.logo && formik.errors.logo ? (
            <div className="error">{formik.errors.logo}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="url"
            id="linkedin"
            {...formik.getFieldProps("linkedin")}
            className={
              formik.touched.linkedin && formik.errors.linkedin
                ? "error-input"
                : ""
            }
          />
          {formik.touched.linkedin && formik.errors.linkedin ? (
            <div className="error">{formik.errors.linkedin}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="url"
            id="facebook"
            {...formik.getFieldProps("facebook")}
            className={
              formik.touched.facebook && formik.errors.facebook
                ? "error-input"
                : ""
            }
          />
          {formik.touched.facebook && formik.errors.facebook ? (
            <div className="error">{formik.errors.facebook}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="url"
            id="twitter"
            {...formik.getFieldProps("twitter")}
            className={
              formik.touched.twitter && formik.errors.twitter
                ? "error-input"
                : ""
            }
          />
          {formik.touched.twitter && formik.errors.twitter ? (
            <div className="error">{formik.errors.twitter}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="instagram">Instagram</label>
          <input
            type="url"
            id="instagram"
            {...formik.getFieldProps("instagram")}
            className={
              formik.touched.instagram && formik.errors.instagram
                ? "error-input"
                : ""
            }
          />
          {formik.touched.instagram && formik.errors.instagram ? (
            <div className="error">{formik.errors.instagram}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="companySize">Company Size</label>
          <select
            id="companySize"
            {...formik.getFieldProps("companySize")}
            className={
              formik.touched.companySize && formik.errors.companySize
                ? "error-input"
                : ""
            }
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          {formik.touched.companySize && formik.errors.companySize ? (
            <div className="error">{formik.errors.companySize}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="headquarterLocation">Headquarter Location</label>
          <input
            type="text"
            id="headquarterLocation"
            {...formik.getFieldProps("headquarterLocation")}
            className={
              formik.touched.headquarterLocation &&
              formik.errors.headquarterLocation
                ? "error-input"
                : ""
            }
          />
          {formik.touched.headquarterLocation &&
          formik.errors.headquarterLocation ? (
            <div className="error">{formik.errors.headquarterLocation}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="subsidiaries">Subsidiaries</label>
          <textarea
            id="subsidiaries"
            {...formik.getFieldProps("subsidiaries")}
            className={
              formik.touched.subsidiaries && formik.errors.subsidiaries
                ? "error-input"
                : ""
            }
          />
          {formik.touched.subsidiaries && formik.errors.subsidiaries ? (
            <div className="error">{formik.errors.subsidiaries}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="certifications">Certifications</label>
          <textarea
            id="certifications"
            {...formik.getFieldProps("certifications")}
            className={
              formik.touched.certifications && formik.errors.certifications
                ? "error-input"
                : ""
            }
          />
          {formik.touched.certifications && formik.errors.certifications ? (
            <div className="error">{formik.errors.certifications}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="save-button"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditRecruits;
