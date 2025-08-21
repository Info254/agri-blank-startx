
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Truck, MapPin } from 'lucide-react';

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="space-y-4">
          <p>Your account has been successfully created. You will start receiving transport requests from farmers in your area soon.</p>
          
          <div className="flex flex-col items-center space-y-3 my-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Access to transport requests in your regions</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Geographic route planning and optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-primary" />
              <span>Verified transporter badge on the platform</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
      </div>
    </>
  );
};

export default RegistrationSuccess;
