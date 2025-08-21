
import React from 'react';

interface ProgressIndicatorProps {
  formStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ formStep }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
          formStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          1
        </div>
        <div className={`h-1 w-12 ${formStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
          formStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          2
        </div>
        <div className={`h-1 w-12 ${formStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
          formStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          3
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
