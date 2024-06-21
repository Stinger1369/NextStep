import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../../components/FileUploadAndCrop/FileUpload/FileUpload";
import "./ProfileEdit.css";

const ProfileEdit: React.FC = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
      profession: user?.profession || "",
      company: user?.company || "",
      bio: user?.bio || "",
      experience: user?.experience || "",
      education: user?.education || "",
      skills: user?.skills ? user.skills.join(", ") : "",
      images: [], // Initialiser les images
      video: null, // Initialiser la vidéo
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      phone: Yup.string(),
      dateOfBirth: Yup.date(),
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zipCode: Yup.string(),
      country: Yup.string(),
      profession: Yup.string(),
      company: Yup.string(),
      bio: Yup.string(),
      experience: Yup.string(),
      education: Yup.string(),
      skills: Yup.string(),
      images: Yup.array().max(5, "You can upload up to 5 images"),
      video: Yup.mixed(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          dateOfBirth: new Date(values.dateOfBirth),
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
          },
          profession: values.profession,
          company: values.company,
          bio: values.bio,
          experience: values.experience,
          education: values.education,
          skills: values.skills.split(",").map((skill) => skill.trim()),
          images: values.images,
          video: values.video,
        };
        await updateUser(user?._id || "", updatedUserData);
        navigate("/");
      } catch (error) {
        console.error("Error updating profile", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImagesChange = (newFiles: File[]) => {
    const updatedFiles = [...formik.values.images, ...newFiles].slice(0, 5); // Merge new files with existing ones
    formik.setFieldValue("images", updatedFiles);

    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setUploadProgress(new Array(updatedFiles.length).fill(0));

    // Simulate upload progress
    updatedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadstart = () => updateProgress(index, 0);
      reader.onprogress = (e) =>
        updateProgress(index, Math.round((e.loaded / e.total) * 100));
      reader.onloadend = () => updateProgress(index, 100);
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (file: File | null) => {
    formik.setFieldValue("video", file);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setVideoProgress(0);

      // Simulate upload progress
      const reader = new FileReader();
      reader.onloadstart = () => setVideoProgress(0);
      reader.onprogress = (e) =>
        setVideoProgress(Math.round((e.loaded / e.total) * 100));
      reader.onloadend = () => setVideoProgress(100);
      reader.readAsDataURL(file);
    } else {
      setVideoPreview(null);
      setVideoProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImagePreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = formik.values.images.filter((_, i) => i !== index);
    setImagePreviews(updatedImagePreviews);
    formik.setFieldValue("images", updatedImages);
  };

 const handleRemoveVideo = () => {
   handleVideoChange(null); // Use handleVideoChange to pass null and remove the video
 };


  const updateProgress = (index: number, value: number) => {
    setUploadProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newProgress[index] = value;
      return newProgress;
    });
  };

  return (
    <div className="profile-edit-container">
      <form onSubmit={formik.handleSubmit} className="profile-edit-form">
        <div className="form-columns">
          <div className="column">
            <div className="form-field">
              <input
                type="text"
                id="firstName"
                {...formik.getFieldProps("firstName")}
                placeholder="First Name"
                className={`profile-input ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="error">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="lastName"
                {...formik.getFieldProps("lastName")}
                placeholder="Last Name"
                className={`profile-input ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="error">{formik.errors.lastName}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="phone"
                {...formik.getFieldProps("phone")}
                placeholder="Phone"
                className={`profile-input ${
                  formik.touched.phone && formik.errors.phone
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="error">{formik.errors.phone}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="date"
                id="dateOfBirth"
                {...formik.getFieldProps("dateOfBirth")}
                placeholder="Date of Birth"
                className={`profile-input ${
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <div className="error">{formik.errors.dateOfBirth}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="street"
                {...formik.getFieldProps("street")}
                placeholder="Street"
                className={`profile-input ${
                  formik.touched.street && formik.errors.street
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.street && formik.errors.street ? (
                <div className="error">{formik.errors.street}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="city"
                {...formik.getFieldProps("city")}
                placeholder="City"
                className={`profile-input ${
                  formik.touched.city && formik.errors.city ? "error-input" : ""
                }`}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="error">{formik.errors.city}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="state"
                {...formik.getFieldProps("state")}
                placeholder="State"
                className={`profile-input ${
                  formik.touched.state && formik.errors.state
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.state && formik.errors.state ? (
                <div className="error">{formik.errors.state}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="zipCode"
                {...formik.getFieldProps("zipCode")}
                placeholder="Zip Code"
                className={`profile-input ${
                  formik.touched.zipCode && formik.errors.zipCode
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.zipCode && formik.errors.zipCode ? (
                <div className="error">{formik.errors.zipCode}</div>
              ) : null}
            </div>
            <div className="form-field">
              <input
                type="text"
                id="country"
                {...formik.getFieldProps("country")}
                placeholder="Country"
                className={`profile-input ${
                  formik.touched.country && formik.errors.country
                    ? "error-input"
                    : ""
                }`}
              />
              {formik.touched.country && formik.errors.country ? (
                <div className="error">{formik.errors.country}</div>
              ) : null}
            </div>
          </div>
          <div className="column">
            <div className="form-field">
              <input
                type="text"
                id="profession"
                {...formik.getFieldProps("profession")}
                placeholder="Profession"
                className="profile-input"
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                id="company"
                {...formik.getFieldProps("company")}
                placeholder="Company"
                className="profile-input"
              />
            </div>
            <div className="form-field">
              <textarea
                id="bio"
                {...formik.getFieldProps("bio")}
                placeholder="Bio"
                className="profile-input"
              />
            </div>
            <div className="form-field">
              <textarea
                id="experience"
                {...formik.getFieldProps("experience")}
                placeholder="Experience"
                className="profile-input"
              />
            </div>
            <div className="form-field">
              <textarea
                id="education"
                {...formik.getFieldProps("education")}
                placeholder="Education"
                className="profile-input"
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                id="skills"
                {...formik.getFieldProps("skills")}
                placeholder="Skills (comma separated)"
                className="profile-input"
              />
            </div>
            <FileUpload
              onImagesChange={handleImagesChange}
              onVideoChange={handleVideoChange}
              onRemoveImage={handleRemoveImage}
              onRemoveVideo={handleRemoveVideo}
              imagePreviews={imagePreviews}
              videoPreview={videoPreview}
              uploadProgress={uploadProgress}
              videoProgress={videoProgress}
            />
          </div>
        </div>
        <button
          type="submit"
          className="profile-button"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
