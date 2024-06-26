import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MediaInfo.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/store";
import {
  updateUser,
  getUserById,
} from "../../../../../redux/features/user/userSlice";
import {
  addImage,
  addImages,
  deleteImage,
} from "../../../../../redux/features/image/imageSlice";
import { userFriendlyMessages } from "../../../../../utils/errorMessages";

interface FormValues {
  images: File[];
}

const MediaInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
  const imageError = useSelector((state: RootState) => state.images.error);
  const imageErrors = useSelector(
    (state: RootState) => state.images.imageErrors
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [maxImagesError, setMaxImagesError] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData?.images) {
      const imageFiles: File[] = userData.images.map(
        (image) => new File([], image)
      );

      setImagePreviews(userData.images);
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

      if (user?._id && userData?.images) {
        const base64Images = await Promise.all(
          values.images.map(async (image) => {
            const base64 = await encodeFileToBase64(image);
            console.log(`Encoded base64 for ${image.name}`);
            return { imageName: image.name, imageBase64: base64 };
          })
        );

        const totalImages = userData.images.length + base64Images.length;

        if (totalImages > 5) {
          setMaxImagesError(
            `You can only upload 5 images. Please delete some images before adding new ones.`
          );
          return;
        }

        try {
          if (base64Images.length === 1) {
            // Ajouter une seule image
            const image = base64Images[0];
            const imageUrl = await dispatch(
              addImage({ userId: user._id, ...image })
            ).unwrap();
            console.log("Uploaded image URL:", imageUrl);
            const updatedValues = {
              ...userData,
              images: Array.from(
                new Set([...(userData.images || []), imageUrl])
              ),
            };
            console.log("Updating user with media info:", updatedValues);
            await dispatch(
              updateUser({ id: user._id, userData: updatedValues })
            );
          } else {
            // Ajouter plusieurs images
            const results = await dispatch(
              addImages({ userId: user._id, images: base64Images })
            ).unwrap();
            console.log("Uploaded images results:", results);

            const successfulImages = results
              .filter((result) => result.status === "success")
              .map((result) => result.url as string);

            const updatedValues = {
              ...userData,
              images: Array.from(
                new Set([...(userData.images || []), ...successfulImages])
              ),
            };
            console.log("Updating user with media info:", updatedValues);
            await dispatch(
              updateUser({ id: user._id, userData: updatedValues })
            );
          }
        } catch (error: any) {
          console.error("Error adding images:", error);
        }
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

  const handleDeleteImage = async (imageUrl: string) => {
    if (user?._id) {
      try {
        const imageName = imageUrl.split("/").pop();
        if (!imageName) {
          throw new Error("Invalid image URL");
        }

        await dispatch(deleteImage({ userId: user._id, imageName })).unwrap();
        await dispatch(getUserById(user._id));
      } catch (error: any) {
        console.error("Error deleting image:", error);
      }
    }
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
            disabled={
              userData?.images?.length !== undefined &&
              userData.images.length >= 5
            }
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
              <div key={index} className="image-preview-container">
                <img src={src} alt={`Preview ${index}`} />
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDeleteImage(src)}
                />
              </div>
            ))}
          </div>
        </div>

        {imageError && (
          <div className="alert alert-danger" role="alert">
            {userFriendlyMessages[
              imageError.code as keyof typeof userFriendlyMessages
            ] || imageError.message.split(":")[0]}
          </div>
        )}
        {maxImagesError && (
          <div className="alert alert-danger" role="alert">
            {maxImagesError}
          </div>
        )}
        {imageErrors.length > 0 &&
          imageErrors.map((error, index) => (
            <div className="alert alert-danger" role="alert" key={index}>
              {`Error with image "${error.imageName}": ${
                userFriendlyMessages[
                  error.code as keyof typeof userFriendlyMessages
                ] || error.message.split(":")[0]
              }`}
            </div>
          ))}

        <div className="button-container">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              userData?.images?.length !== undefined &&
              userData.images.length >= 5
            }
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaInfo;
