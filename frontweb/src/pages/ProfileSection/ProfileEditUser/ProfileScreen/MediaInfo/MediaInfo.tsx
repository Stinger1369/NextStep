import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MediaInfo.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/store";
import {
  updateUser,
  getUserById,
} from "../../../../../redux/features/user/userSlice";
import { addImage } from "../../../../../redux/features/image/imageSlice"; // Import addImage action

interface FormValues {
  images: File[];
}

const MediaInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
  const imageError = useSelector((state: RootState) => state.images.error);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData) {
      const imageFiles: File[] = userData.images
        ? userData.images.map((image) => new File([], image))
        : [];

      setImagePreviews(userData.images || []);
      formik.setValues({ images: imageFiles });
    }
  }, [userData]);

  const formik = useFormik<FormValues>({
    initialValues: { images: [] },
    validationSchema: Yup.object({
      images: Yup.array().max(5, "You can upload up to 5 images"),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);

      if (user?._id) {
        const base64Images = await Promise.all(
          values.images.map(async (image) => {
            const base64 = await encodeFileToBase64(image);
            console.log(
              `Encoded base64 for ${image.name}: ${base64.slice(0, 100)}...`
            );
            return { imageName: image.name, imageBase64: base64 };
          })
        );

        const uploadedImageUrls: string[] = [];

        for (const img of base64Images) {
          try {
            const imageUrl = await dispatch(
              addImage({ userId: user._id, ...img })
            ).unwrap();
            uploadedImageUrls.push(imageUrl);
          } catch (error: any) {
            console.error("Error adding image:", error);
            return;
          }
        }

        const updatedValues = {
          ...userData,
          images: uploadedImageUrls, // Use URLs instead of image names
        };
        console.log("Updating user with media info:", updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
      }
    },
  });

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    console.log("Selected image files:", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    formik.setFieldValue("images", files);
  };

  return (
    <div className="media-info-container">
      <div className="header-icons">
        <FaArrowLeft
          className="icon"
          onClick={() => navigate("/profile-edit-user/bio-skills-info")}
        />
        <FaTimes className="icon" onClick={() => navigate("/")} />
      </div>
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
            <div className="text-danger">
              {Array.isArray(formik.errors.images) &&
                formik.errors.images.map((error, index) => (
                  <div key={index}>
                    {typeof error === "string" ? error : "Invalid file type"}
                  </div>
                ))}
            </div>
          ) : null}
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>

        {imageError && (
          <div className="alert alert-danger" role="alert">
            {imageError}
          </div>
        )}

        <div className="button-container">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaInfo;
