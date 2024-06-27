import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RootState, AppDispatch } from '../../../../redux/store';
import { updateCompany, getCompanyById, createCompany } from '../../../../redux/features/company/companySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OtherInfo.css';

const OtherInfo: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) => state.company.company);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (company) {
      formik.setValues({
        website: company.website || '',
        description: company.description || '',
        foundedDate: company.foundedDate ? new Date(company.foundedDate).toISOString().substr(0, 10) : '',
        companySize: company.companySize || '',
        headquarterLocation: company.headquarterLocation || '',
        subsidiaries: company.subsidiaries ? company.subsidiaries.join(', ') : '',
        certifications: company.certifications ? company.certifications.join(', ') : ''
      });
    }
  }, [company]);

  const formik = useFormik({
    initialValues: {
      website: '',
      description: '',
      foundedDate: '',
      companySize: '',
      headquarterLocation: '',
      subsidiaries: '',
      certifications: ''
    },
    validationSchema: Yup.object({
      website: Yup.string().url('Invalid URL'),
      description: Yup.string(),
      foundedDate: Yup.date().nullable(),
      companySize: Yup.string().oneOf(['small', 'medium', 'large'], 'Invalid Company Size'),
      headquarterLocation: Yup.string(),
      subsidiaries: Yup.string(),
      certifications: Yup.string()
    }),
    onSubmit: async (values) => {
      const companyData = {
        ...values,
        foundedDate: values.foundedDate ? new Date(values.foundedDate) : null,
        companySize: values.companySize as 'small' | 'medium' | 'large' | undefined,
        subsidiaries: values.subsidiaries.split(',').map((item) => item.trim()),
        certifications: values.certifications.split(',').map((item) => item.trim())
      };
      if (companyId) {
        await dispatch(updateCompany({ id: companyId, companyData }));
      } else {
        await dispatch(createCompany(companyData));
      }
    }
  });

  const handleSave = () => {
    formik.submitForm();
  };

  const handleContinue = () => {
    formik.submitForm();
    if (companyId) {
      navigate(`/edit-recruit/${companyId}/social-media-info`);
    } else {
      navigate(`/edit-recruit/new/social-media-info`);
    }
  };

  return (
    <div className="other-info-container">
      <div className="header-icons">
        <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <h2>Other Information</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="website">Website:</label>
          <input id="website" name="website" value={formik.values.website} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.website && formik.errors.website ? <div className="text-danger">{formik.errors.website}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input id="description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.description && formik.errors.description ? <div className="text-danger">{formik.errors.description}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="foundedDate">Founded Date:</label>
          <input id="foundedDate" name="foundedDate" type="date" value={formik.values.foundedDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.foundedDate && formik.errors.foundedDate ? <div className="text-danger">{formik.errors.foundedDate}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="companySize">Company Size:</label>
          <select id="companySize" name="companySize" value={formik.values.companySize} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control">
            <option value="">Select</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          {formik.touched.companySize && formik.errors.companySize ? <div className="text-danger">{formik.errors.companySize}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="headquarterLocation">Headquarter Location:</label>
          <input id="headquarterLocation" name="headquarterLocation" value={formik.values.headquarterLocation} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.headquarterLocation && formik.errors.headquarterLocation ? <div className="text-danger">{formik.errors.headquarterLocation}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="subsidiaries">Subsidiaries:</label>
          <input id="subsidiaries" name="subsidiaries" value={formik.values.subsidiaries} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.subsidiaries && formik.errors.subsidiaries ? <div className="text-danger">{formik.errors.subsidiaries}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="certifications">Certifications:</label>
          <input id="certifications" name="certifications" value={formik.values.certifications} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
          {formik.touched.certifications && formik.errors.certifications ? <div className="text-danger">{formik.errors.certifications}</div> : null}
        </div>
        <div className="button-container">
          <button type="button" className="btn btn-secondary" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="btn btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherInfo;
