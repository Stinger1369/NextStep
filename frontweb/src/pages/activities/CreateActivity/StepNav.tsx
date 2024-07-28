// src/components/StepNav/StepNav.tsx
import React from 'react';
import './StepNav.css';

interface StepNavProps {
  steps: string[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

const StepNav: React.FC<StepNavProps> = ({ steps, currentStep, onStepClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onStepClick(index);
    }
  };

  return (
    <div className="step-nav">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-item ${index === currentStep ? 'active' : ''}`}
          onClick={() => onStepClick(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          role="button"
          tabIndex={0}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default StepNav;
