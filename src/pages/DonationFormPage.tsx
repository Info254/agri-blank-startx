import React from 'react';
import DonationForm from '../components/DonationForm';

const DonationFormPage: React.FC = () => (
  <div className="container mx-auto py-8">
    <DonationForm onDonated={() => {}} />
  </div>
);

export default DonationFormPage;
