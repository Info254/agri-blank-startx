// @ts-nocheck
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OnboardingFormData } from '@/lib/validations/partner';

const countries = [
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'South Africa', label: 'South Africa' },
];

export default function PartnerLocationForm({ form }: { form: any }) {
  const { control, watch } = useFormContext<OnboardingFormData>();
  const hasMultipleLocations = watch('hasMultipleLocations');
  const operatingCountries = watch('operatingCountries') || [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Primary Business Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="address.street"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Business Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Nairobi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Region</FormLabel>
                <FormControl>
                  <Input placeholder="Nairobi County" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="00100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FormField
            control={control}
            name="hasMultipleLocations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>We have multiple business locations</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {hasMultipleLocations && (
          <div className="pl-6 border-l-2 border-muted">
            <p className="text-sm text-muted-foreground mb-4">
              Please provide details for your additional locations. You can add more locations after completing the onboarding.
            </p>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-3">Additional Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="additionalLocations.0.street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Business Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="additionalLocations.0.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mombasa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="additionalLocations.0.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {countries.map((country) => (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const currentLocations = form.getValues('additionalLocations') || [];
                  form.setValue('additionalLocations', [
                    ...currentLocations, 
                    { street: '', city: '', country: 'Kenya' }
                  ]);
                }}
              >
                + Add Another Location
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Operating Countries</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all countries where your business operates or provides services.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {countries.map((country) => (
            <FormField
              key={country.value}
              control={control}
              name="operatingCountries"
              render={({ field }) => {
                return (
                  <FormItem
                    key={country.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(country.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, country.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== country.value
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {country.label}
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
        </div>
        <FormMessage>{form.formState.errors.operatingCountries?.message}</FormMessage>
      </div>
    </div>
  );
}
