
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Warehouse, FileSpreadsheet } from 'lucide-react';

const RegistrationPrompt: React.FC = () => {
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Join Our Agricultural Service Network</CardTitle>
        <CardDescription>
          Help strengthen Kenya's agricultural ecosystem by registering your services on our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Transport Providers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with farmers needing reliable transportation for their produce
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Warehouse className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Storage Facilities</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Offer your warehousing and cold storage solutions to reduce post-harvest losses
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Training & Services</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              List your agricultural training, quality control, or market linkage services
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-6">
        <Button className="w-full sm:w-auto" variant="default" onClick={() => window.location.href = "/service-provider-registration"}>
          Register as Service Provider
        </Button>
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => window.location.href = "/transporter-signup"}>
          Register as Transporter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegistrationPrompt;
