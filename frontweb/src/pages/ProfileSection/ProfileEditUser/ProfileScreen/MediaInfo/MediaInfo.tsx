import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./MediaInfo.css";

const MediaInfo: React.FC = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      images: [],
      video: null,
    },
    validationSchema: Yup.object({
      images: Yup.array().max(5, "You can upload up to 5 images"),
      video: Yup.mixed(),
    }),
    onSubmit: (values) => {
      // Save
      console.log("Media Info:", values);
    },
  });

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    formik.setFieldValue("images", files);
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    const preview = file ? URL.createObjectURL(file) : null;
    setVideoPreview(preview);
    formik.setFieldValue("video", file);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="media-info-form">
      <div className="form-group">
        <label htmlFor="images">Upload Images (up to 5)</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="form-control"
        />
        {formik.touched.images && formik.errors.images ? (
          <div className="text-danger">{formik.errors.images}</div>
        ) : null}
        <div className="image-previews">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="video">Upload Video</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={handleVideoChange}
          className="form-control"
        />
        {formik.touched.video && formik.errors.video ? (
          <div className="text-danger">{formik.errors.video}</div>
        ) : null}
        {videoPreview && (
          <video controls>
            <source src={videoPreview} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="button-container">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default MediaInfo;
