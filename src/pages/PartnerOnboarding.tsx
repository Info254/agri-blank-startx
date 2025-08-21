import { Button } from '@/components/ui/button';

export default function PartnerOnboarding() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Become a Partner</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-4">Thank you for your interest in becoming a partner. Please fill out the form below to get started.</p>
        <Button>Start Application</Button>
      </div>
    </div>
  );
}
