import React from 'react';
import { FieldArray, useFormikContext, FormikProps, FormikErrors } from 'formik';
import './SocialMediaLinks.css'; // Import the CSS file

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface FormValues {
  socialMediaLinks: SocialMediaLink[];
}

const SocialMediaLinks: React.FC = () => {
  const { values, getFieldProps, touched, errors }: FormikProps<FormValues> =
    useFormikContext<FormValues>();

  return (
    <div className="social-media-links">
      <FieldArray
        name="socialMediaLinks"
        render={(arrayHelpers) => (
          <div>
            {values.socialMediaLinks.map((link, index) => (
              <div key={index} className="form-group mb-3">
                <label htmlFor={`socialMediaLinks.${index}.platform`}>Platform</label>
                <select
                  id={`socialMediaLinks.${index}.platform`}
                  {...getFieldProps(`socialMediaLinks.${index}.platform`)}
                  className="form-control mb-1"
                >
                  <option value="">Select Platform</option>
                  <option value="github">GitHub</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="discord">Discord</option>
                </select>
                {touched.socialMediaLinks?.[index]?.platform &&
                  (errors.socialMediaLinks?.[index] as FormikErrors<SocialMediaLink>)?.platform && (
                    <div className="text-danger">
                      {(errors.socialMediaLinks?.[index] as FormikErrors<SocialMediaLink>)
                        .platform ?? ''}
                    </div>
                  )}

                <label htmlFor={`socialMediaLinks.${index}.url`}>URL</label>
                <input
                  type="text"
                  id={`socialMediaLinks.${index}.url`}
                  {...getFieldProps(`socialMediaLinks.${index}.url`)}
                  className="form-control mb-1"
                />
                {touched.socialMediaLinks?.[index]?.url &&
                  (errors.socialMediaLinks?.[index] as FormikErrors<SocialMediaLink>)?.url && (
                    <div className="text-danger">
                      {(errors.socialMediaLinks?.[index] as FormikErrors<SocialMediaLink>).url ??
                        ''}
                    </div>
                  )}

                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => arrayHelpers.insert(index + 1, { platform: '', url: '' })}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            {values.socialMediaLinks.length === 0 && (
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={() => arrayHelpers.push({ platform: '', url: '' })}
              >
                Add Social Media Link
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default SocialMediaLinks;
