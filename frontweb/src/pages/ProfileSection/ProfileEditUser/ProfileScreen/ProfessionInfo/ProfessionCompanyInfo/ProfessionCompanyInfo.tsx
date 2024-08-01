// ProfessionCompanyInfo.tsx
import React from 'react';
import { useFormikContext, FormikProps } from 'formik';
import { professions } from '../../../../../../data/professions'; // Assurez-vous que le chemin est correct

interface FormValues {
  profession: string;
  company: string;
}

const ProfessionCompanyInfo: React.FC = () => {
  const { getFieldProps, touched, errors }: FormikProps<FormValues> = useFormikContext<FormValues>();

  return (
    <div className="profession-company-info">
      <div className="form-group">
        <label htmlFor="profession">Profession</label>
        <select id="profession" {...getFieldProps('profession')} className="form-control">
          <option value="">Select Profession</option>
          {professions.map((profession) => (
            <option key={profession.profession} value={profession.profession}>
              {profession.profession}
            </option>
          ))}
        </select>
        {touched.profession && errors.profession ? <div className="text-danger">{errors.profession}</div> : null}
      </div>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" {...getFieldProps('company')} className="form-control" />
        {touched.company && errors.company ? <div className="text-danger">{errors.company}</div> : null}
      </div>
    </div>
  );
};

export default ProfessionCompanyInfo;
