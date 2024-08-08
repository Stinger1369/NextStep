import React, { useEffect, useState } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BioSkillsInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { updateUser, getUserById } from '../../../../../redux/features/user/userSlice';

const BioSkillsInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userData = useSelector((state: RootState) => state.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        bio: userData.bio || '',
        experience:
          userData.experience && userData.experience.length > 0 ? userData.experience : [''],
        education: userData.education && userData.education.length > 0 ? userData.education : [''],
        skills: userData.skills && userData.skills.length > 0 ? userData.skills : ['']
      });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      bio: '',
      experience: [''],
      education: [''],
      skills: ['']
    },
    validationSchema: Yup.object({
      bio: Yup.string(),
      experience: Yup.array().of(Yup.string()),
      education: Yup.array().of(Yup.string()),
      skills: Yup.array().of(Yup.string())
    }),
    onSubmit: async (values) => {
      if (user?._id) {
        setIsSubmitting(true);
        const updatedValues = {
          ...userData,
          bio: values.bio,
          experience: values.experience.filter((exp) => exp.trim() !== ''),
          education: values.education.filter((edu) => edu.trim() !== ''),
          skills: values.skills.filter((skill) => skill.trim() !== '')
        };
        console.log('Updating user with bio and skills info:', updatedValues);
        await dispatch(updateUser({ id: user._id, userData: updatedValues }));
        setIsSubmitting(false);
        navigate('/profile-edit-user/image');
      }
    }
  });

  const handleSave = async () => {
    console.log('Saved Bio and Skills Info:', formik.values);
    if (user?._id) {
      setIsSubmitting(true);
      const updatedValues = {
        ...userData,
        bio: formik.values.bio,
        experience: formik.values.experience.filter((exp) => exp.trim() !== ''),
        education: formik.values.education.filter((edu) => edu.trim() !== ''),
        skills: formik.values.skills.filter((skill) => skill.trim() !== '')
      };
      await dispatch(updateUser({ id: user._id, userData: updatedValues }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bio-skills-container">
      <div className="header-icons">
        <FaArrowLeft
          className="icon"
          onClick={() => navigate('/profile-edit-user/profession-info')}
        />
        <FaTimes className="icon" onClick={() => navigate('/')} />
      </div>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="bio-skills-form">
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" {...formik.getFieldProps('bio')} className="form-control" />
            {formik.touched.bio && formik.errors.bio ? (
              <div className="text-danger">{formik.errors.bio}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <FieldArray
              name="experience"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.experience.map((exp, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        {...formik.getFieldProps(`experience.${index}`)}
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

          <div className="form-group">
            <label htmlFor="education">Education</label>
            <FieldArray
              name="education"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        {...formik.getFieldProps(`education.${index}`)}
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

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <FieldArray
              name="skills"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.skills.map((skill, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        {...formik.getFieldProps(`skills.${index}`)}
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

          <div className="button-container">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default BioSkillsInfo;
