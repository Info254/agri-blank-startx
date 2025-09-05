// @ts-nocheck
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { OnboardingFormData } from '@/lib/validations/partner';

const serviceCategories = [
  {
    id: 'input_supply',
    label: 'Agricultural Inputs Supply',
    description: 'Seeds, fertilizers, pesticides, equipment, etc.'
  },
  {
    id: 'financial_services',
    label: 'Financial Services',
    description: 'Loans, insurance, payment solutions, etc.'
  },
  {
    id: 'logistics',
    label: 'Logistics & Transportation',
    description: 'Cold chain, warehousing, distribution, etc.'
  },
  {
    id: 'processing',
    label: 'Processing & Value Addition',
    description: 'Milling, packaging, preservation, etc.'
  },
  {
    id: 'market_access',
    label: 'Market Access & Trade',
    description: 'Offtake agreements, export services, etc.'
  },
  {
    id: 'training',
    label: 'Training & Extension Services',
    description: 'Farmer training, agronomy support, etc.'
  },
  {
    id: 'consulting',
    label: 'Consulting Services',
    description: 'Business development, compliance, etc.'
  },
  {
    id: 'technology',
    label: 'Agri-Tech Solutions',
    description: 'Farm management software, IoT, etc.'
  },
  {
    id: 'other',
    label: 'Other Services',
    description: 'Specify in description'
  },
];

export default function PartnerServicesForm({ form }: { form: any }) {
  const { control, watch } = useFormContext<OnboardingFormData>();
  const selectedCategories = watch('serviceCategories') || [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Service Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select all categories that apply to your business
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceCategories.map((category) => (
            <FormField
              key={category.id}
              control={control}
              name="serviceCategories"
              render={({ field }) => {
                return (
                  <FormItem
                    key={category.id}
                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(category.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, category.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== category.id
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        {category.label}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {category.description}
                      </FormDescription>
                    </div>
                  </FormItem>
                )
              }}
            />
          ))}
        </div>
        <FormMessage>{form.formState.errors.serviceCategories?.message}</FormMessage>
      </div>

      <FormField
        control={control}
        name="serviceDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your services in detail..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of your services, including any specialties or unique offerings.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h3 className="text-lg font-medium mb-4">Service Areas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Where do you operate? Add all countries and regions where you provide services.
        </p>
        
        <div className="space-y-4">
          {/* This is a simplified version - in a real app, you'd have a more complex component for adding/editing service areas */}
          <div className="border rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="serviceAreas.0.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kenya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="serviceAreas.0.regions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regions (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Nairobi, Mombasa, Nakuru" 
                        value={field.value?.join(', ')}
                        onChange={(e) => {
                          const regions = e.target.value
                            .split(',')
                            .map(region => region.trim())
                            .filter(region => region.length > 0);
                          field.onChange(regions);
                        }}
                      />
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
              // In a real app, you'd add a new service area to the form array
              const currentAreas = form.getValues('serviceAreas') || [];
              form.setValue('serviceAreas', [
                ...currentAreas, 
                { country: '', regions: [] }
              ]);
            }}
          >
            + Add Another Location
          </Button>
        </div>
      </div>
    </div>
  );
}
