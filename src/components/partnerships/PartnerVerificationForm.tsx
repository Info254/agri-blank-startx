// @ts-nocheck
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { OnboardingFormData } from '@/lib/validations/partner';
import { Checkbox } from '@/components/ui/checkbox';

export default function PartnerVerificationForm({ form }: { form: any }) {
  const [uploading, setUploading] = useState(false);
  const { control, watch } = useFormContext<OnboardingFormData>();
  
  const documentTypes = [
    { 
      id: 'business_license', 
      label: 'Business License', 
      description: 'Valid business registration or license document',
      required: true
    },
    { 
      id: 'tax_certificate', 
      label: 'Tax Compliance Certificate', 
      description: 'Current year tax compliance certificate',
      required: true
    },
    { 
      id: 'id_document', 
      label: 'ID/Passport', 
      description: 'Valid ID or passport of the business owner/representative',
      required: true
    },
    { 
      id: 'other', 
      label: 'Other Documents', 
      description: 'Any other relevant certificates or documents',
      required: false
    },
  ];

  const handleFileUpload = async (file: File, type: string) => {
    setUploading(true);
    try {
      // In a real app, you would upload the file to your storage service here
      // and return the URL to be saved in the form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful upload
      const fileUrl = URL.createObjectURL(file);
      const currentDocuments = form.getValues('documents') || [];
      
      // Update the documents array
      const updatedDocuments = [
        ...currentDocuments.filter((doc: any) => doc.type !== type),
        {
          type,
          url: fileUrl,
          name: file.name,
          uploadedAt: new Date().toISOString()
        }
      ];
      
      form.setValue('documents', updatedDocuments);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    } finally {
      setUploading(false);
    }
  };

  const getDocumentUrl = (type: string) => {
    const documents = watch('documents') || [];
    const doc = documents.find((d: any) => d.type === type);
    return doc?.url;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Person</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Primary contact for partnership-related communications
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="contactPerson.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="contactPerson.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Business Owner, Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="contactPerson.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="contactPerson.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+254 700 123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Verification Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please upload the required documents to verify your business. All documents should be clear and legible.
        </p>
        
        <div className="space-y-6">
          {documentTypes.map((doc) => {
            const docUrl = getDocumentUrl(doc.id);
            
            return (
              <Card key={doc.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {doc.label} {doc.required && <span className="text-destructive">*</span>}
                  </CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4">
                    {docUrl ? (
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Uploaded:</span>
                          <a 
                            href={docUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          {doc.required ? 'Required' : 'Optional'}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <input
                        type="file"
                        id={`document-${doc.id}`}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, doc.id);
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant={docUrl ? "outline" : "default"}
                        size="sm"
                        disabled={uploading}
                        onClick={() => document.getElementById(`document-${doc.id}`)?.click()}
                      >
                        {uploading ? 'Uploading...' : docUrl ? 'Replace' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Terms & Conditions</h3>
        
        <Card className="bg-muted/50">
          <CardContent className="pt-6 max-h-60 overflow-y-auto text-sm">
            <h4 className="font-medium mb-2">Partner Agreement</h4>
            <div className="space-y-3">
              <p>
                By submitting this application, you agree to the following terms and conditions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All information provided is accurate and up-to-date.</li>
                <li>You have the authority to represent the business you're registering.</li>
                <li>You agree to comply with all applicable laws and regulations.</li>
                <li>You will maintain the confidentiality of any sensitive information.</li>
                <li>You understand that approval is subject to verification.</li>
              </ul>
              <p>
                We may contact you for additional information or clarification during the review process. 
                Approval of your application is at our sole discretion.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <FormField
          control={control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I have read and agree to the terms and conditions
                </FormLabel>
                <FormDescription>
                  You must accept the terms to submit your application.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
