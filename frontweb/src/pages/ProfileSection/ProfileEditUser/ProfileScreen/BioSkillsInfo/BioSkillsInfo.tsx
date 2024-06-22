import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BioSkillsInfo.css";

const BioSkillsInfo: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bio: "",
      experience: "",
      education: "",
      skills: "",
    },
    validationSchema: Yup.object({
      bio: Yup.string(),
      experience: Yup.string(),
      education: Yup.string(),
      skills: Yup.string(),
    }),
    onSubmit: (values) => {
      // Save and navigate to next step
      console.log("Bio and Skills Info:", values);
      navigate("/profile-edit-user/media-info");
    },
  });

  const handleSave = () => {
    console.log("Saved Bio and Skills Info:", formik.values);
    // Add any save logic here if necessary
  };

  return (
    <form onSubmit={formik.handleSubmit} className="bio-skills-form">
      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          {...formik.getFieldProps("bio")}
          className="form-control"
        />
        {formik.touched.bio && formik.errors.bio ? (
          <div className="text-danger">{formik.errors.bio}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="experience">Experience</label>
        <textarea
          id="experience"
          {...formik.getFieldProps("experience")}
          className="form-control"
        />
        {formik.touched.experience && formik.errors.experience ? (
          <div className="text-danger">{formik.errors.experience}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="education">Education</label>
        <textarea
          id="education"
          {...formik.getFieldProps("education")}
          className="form-control"
        />
        {formik.touched.education && formik.errors.education ? (
          <div className="text-danger">{formik.errors.education}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="skills">Skills (comma separated)</label>
        <input
          type="text"
          id="skills"
          {...formik.getFieldProps("skills")}
          className="form-control"
        />
        {formik.touched.skills && formik.errors.skills ? (
          <div className="text-danger">{formik.errors.skills}</div>
        ) : null}
      </div>

      <div className="button-container">
        <button
          type="button"
          className="btn btn-secondary"
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

export default BioSkillsInfo;
