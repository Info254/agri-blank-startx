// @ts-nocheck
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { PartnerEvent } from '@/services/partnerService';
import { toast } from '@/components/ui/use-toast';

const eventFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Event title must be at least 2 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  eventType: z.string({
    required_error: 'Please select an event type.',
  }),
  startDate: z.date({
    required_error: 'A start date is required.',
  }),
  endDate: z.date({
    required_error: 'An end date is required.',
  }),
  startTime: z.string({
    required_error: 'A start time is required.',
  }),
  endTime: z.string({
    required_error: 'An end time is required.',
  }),
  timezone: z.string().default('Africa/Nairobi'),
  locationType: z.enum(['physical', 'virtual', 'hybrid'], {
    required_error: 'Please select a location type.',
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  onlineLink: z.string().url().optional().or(z.literal('')),
  maxAttendees: z.number().int().positive().optional(),
  registrationRequired: z.boolean().default(true),
  registrationDeadline: z.date().optional(),
  price: z.number().min(0).default(0),
  currency: z.string().default('KES'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface PartnerEventFormProps {
  initialData?: Partial<PartnerEvent>;
  onSuccess: (event: PartnerEvent) => void;
  onCancel?: () => void;
}

function PartnerEventForm({ 
  initialData, 
  onSuccess,
  onCancel 
}: PartnerEventFormProps) {
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      eventType: initialData?.eventType || 'workshop',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '17:00',
      timezone: initialData?.timezone || 'Africa/Nairobi',
      locationType: initialData?.locationType || 'physical',
      address: initialData?.address || '',
      city: initialData?.city || '',
      country: initialData?.country || 'Kenya',
      onlineLink: initialData?.onlineLink || '',
      maxAttendees: initialData?.maxAttendees,
      registrationRequired: initialData?.registrationRequired ?? true,
      registrationDeadline: initialData?.registrationDeadline ? new Date(initialData.registrationDeadline) : undefined,
      price: initialData?.price || 0,
      currency: initialData?.currency || 'KES',
      imageUrl: initialData?.imageUrl || '',
      tags: initialData?.tags || [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true);
      
      // In a real app, you would upload the image to a storage service here
      // and update the event data with the returned URL before saving to the database
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventData: PartnerEvent = {
        id: initialData?.id || `event-${Date.now()}`,
        partnerId: initialData?.partnerId || 'current-partner-id',
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        timezone: data.timezone,
        locationType: data.locationType,
        address: data.address,
        city: data.city,
        country: data.country,
        onlineLink: data.onlineLink,
        maxAttendees: data.maxAttendees,
        registrationRequired: data.registrationRequired,
        registrationDeadline: data.registrationDeadline?.toISOString(),
        price: data.price,
        currency: data.currency,
        imageUrl: imagePreview || data.imageUrl,
        tags: data.tags,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: initialData?.status || 'upcoming',
      };
      
      onSuccess(eventData);
      
      toast({
        title: 'Success',
        description: `Event "${data.title}" has been ${initialData ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {/* Event Image */}
          <div className="space-y-2">
            <FormLabel>Event Image</FormLabel>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-md bg-muted overflow-hidden">
                {(imagePreview || form.getValues('imageUrl')) && (
                  <img 
                    src={imagePreview || form.getValues('imageUrl')} 
                    alt="Event preview" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="event-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="event-image-upload"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  {imagePreview || form.getValues('imageUrl') ? 'Change' : 'Upload'}
                </label>
              </div>
            </div>
            <FormDescription>
              Recommended size: 1200x630px. Max file size: 2MB.
            </FormDescription>
            <FormMessage />
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Details</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="tradeshow">Tradeshow</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your event..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your event, including topics, speakers, and what attendees can expect.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Date & Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < (form.getValues('startDate') || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Africa/Nairobi">Nairobi, Kenya (EAT)</SelectItem>
                        <SelectItem value="Africa/Dar_es_Salaam">Dar es Salaam, Tanzania (EAT)</SelectItem>
                        <SelectItem value="Africa/Kampala">Kampala, Uganda (EAT)</SelectItem>
                        <SelectItem value="Africa/Kigali">Kigali, Rwanda (CAT)</SelectItem>
                        <SelectItem value="Africa/Addis_Ababa">Addis Ababa, Ethiopia (EAT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            
            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="physical">In-Person</SelectItem>
                      <SelectItem value="virtual">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid (In-Person & Online)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('locationType') !== 'virtual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
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
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Kenya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {(form.watch('locationType') === 'virtual' || form.watch('locationType') === 'hybrid') && (
              <FormField
                control={form.control}
                name="onlineLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Meeting Link</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://meet.example.com/your-event" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide the link where participants can join the event online.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Registration & Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Registration & Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Registration Required
                      </FormLabel>
                      <FormDescription>
                        Require attendees to register before joining the event.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('registrationRequired') && (
                <FormField
                  control={form.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attendees</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="Leave empty for unlimited" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          {form.watch('currency')}
                        </span>
                      </div>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0.00" 
                          className="pl-12"
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                        <SelectItem value="UGX">Ugandan Shilling (UGX)</SelectItem>
                        <SelectItem value="TZS">Tanzanian Shilling (TZS)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('registrationRequired') && (
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select deadline</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              (form.getValues('startDate') && date > form.getValues('startDate'))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Last date attendees can register for the event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PartnerEventForm;
