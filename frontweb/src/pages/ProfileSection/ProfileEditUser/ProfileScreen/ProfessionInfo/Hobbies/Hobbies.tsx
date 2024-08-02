// Hobbies.tsx
import React from 'react';
import { FieldArray, useFormikContext, FormikProps } from 'formik';

interface HobbiesProps {}

interface FormValues {
  hobbies: string[];
}

const Hobbies: React.FC<HobbiesProps> = () => {
  const { values, getFieldProps }: FormikProps<FormValues> = useFormikContext<FormValues>();

  return (
    <div className="hobbies-section">
      <div className="form-group">
        <label htmlFor="hobbies">Hobbies</label>
        <FieldArray
          name="hobbies"
          render={(arrayHelpers) => (
            <div>
              {values.hobbies.map((hobby, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    {...getFieldProps(`hobbies.${index}`)}
                    className="form-control mb-1"
                  />
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
                    onClick={() => arrayHelpers.insert(index + 1, '')}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Hobbies;
