import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { OnboardingFormData } from '@/lib/validations/partner';

export default function PartnerBasicInfoForm() {
  const { control } = useFormContext<OnboardingFormData>();
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Agribusiness Ltd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="businessRegistrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="CP123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="yearEstablished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Established</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1900" 
                  max={currentYear}
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="companyLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {field.value && (
                    <div className="h-16 w-16 rounded-md overflow-hidden">
                      <img 
                        src={field.value} 
                        alt="Company logo" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            field.onChange(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Upload your company logo (recommended size: 400x400px)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your company..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a brief overview of your company, including your mission and values.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
