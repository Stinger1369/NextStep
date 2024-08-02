// src/pages/activities/CreateActivity/CreateActivity.tsx
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { IActivity } from '../../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { createActivity } from '../../../redux/features/activity/activitySlice';
import BasicDetails from './BasicDetails/BasicDetails';
import ScheduleAndDates from './ScheduleAndDates/ScheduleAndDates';
import LocationDetails from './LocationDetails/LocationDetails';
import AdditionalOptions from './AdditionalOptions/AdditionalOptions';
import ParticipantsValidation from './ParticipantsValidation/ParticipantsValidation';
import PriceAndLinks from './PriceAndLinks/PriceAndLinks';
import SocialLinks from './SocialLinks/SocialLinks';
import NotificationAndManagement from './NotificationAndManagement/NotificationAndManagement';
import ReviewAndSubmit from './ReviewAndSubmit/ReviewAndSubmit';
import StepNav from './StepNav'; // Importer le nouveau composant
import './CreateActivity.css';

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  date: Yup.date().required('Required'),
  startTime: Yup.object().shape({
    hour: Yup.number().required('Required').min(0).max(23),
    minute: Yup.number().required('Required').min(0).max(59)
  }),
  endTime: Yup.object().shape({
    hour: Yup.number().required('Required').min(0).max(23),
    minute: Yup.number().required('Required').min(0).max(59)
  }),
  location: Yup.object().shape({
    address: Yup.string().required('Required'),
    latitude: Yup.number().required('Required'),
    longitude: Yup.number().required('Required')
  }),
  activityImage: Yup.string().required('Required'),
  createAtivityType: Yup.string().required('Required')
});

const CreateActivity: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const steps = [
    { component: <BasicDetails />, key: 'basic-details' },
    { component: <ScheduleAndDates />, key: 'schedule-dates' },
    { component: <LocationDetails />, key: 'location-details' },
    { component: <AdditionalOptions />, key: 'additional-options' },
    { component: <ParticipantsValidation />, key: 'participants-validation' },
    { component: <PriceAndLinks />, key: 'price-links' },
    { component: <SocialLinks />, key: 'social-links' },
    { component: <NotificationAndManagement />, key: 'notification-management' },
    { component: <ReviewAndSubmit />, key: 'review-submit' }
  ];

  const stepTitles = [
    'Basic Details',
    'Schedule & Dates',
    'Location Details',
    'Additional Options',
    'Participants Validation',
    'Price & Links',
    'Social Links',
    'Notification & Management',
    'Review & Submit'
  ];

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);
  const handleStepClick = (stepIndex: number) => setCurrentStep(stepIndex);

  const initialValues: IActivity = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Date as string
    startTime: { hour: 0, minute: 0 },
    endTime: { hour: 0, minute: 0 },
    location: { address: '', latitude: 0, longitude: 0 },
    isOnline: false,
    author: '',
    createAtivityType: '',
    addressOnlyForAttendees: false,
    inviteCommunity: false,
    ages: [],
    ageRestriction: false,
    attendeesValidation: false,
    likes: [],
    comments: [],
    notificationSettings: new Map(),
    emailNotification: false,
    pushNotification: false,
    smsNotification: false,
    interactions: []
  };

  const handleSubmit = async (values: IActivity) => {
    try {
      await dispatch(createActivity(values)).unwrap();
      // Handle success, e.g., redirect or display a success message
    } catch (error) {
      // Handle error, e.g., display error message
    }
  };

  return (
    <div className="create-activity-container">
      <StepNav steps={stepTitles} currentStep={currentStep} onStepClick={handleStepClick} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form>
            {steps[currentStep].component}
            <div className="navigation-buttons">
              {currentStep > 0 && (
                <button type="button" onClick={handlePrev} className="btn btn-secondary">
                  Previous
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              ) : (
                <button type="submit" onClick={() => handleSubmit()} className="btn btn-success">
                  Submit
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateActivity;
