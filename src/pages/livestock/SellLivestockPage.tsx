// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { fetchLivestockMarkets, fetchLivestockBreeds, createLivestockListing, uploadLivestockImage } from '@/services/livestockMarketService';
import { LivestockMarket } from '@/types/livestock';

const formSchema = z.object({
  type: z.string().min(1, 'Animal type is required'),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.string().min(1, 'Gender is required'),
  age: z.coerce.number().min(0, 'Age must be a positive number'),
  weight: z.coerce.number().min(0, 'Weight must be a positive number'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  pricePerKg: z.coerce.number().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  marketId: z.string().min(1, 'Market is required'),
  healthStatus: z.string().min(1, 'Health status is required'),
  isHalal: z.boolean().default(false),
  halalCertificationBody: z.string().optional(),
  certificationExpiryDate: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  specialFeatures: z.array(z.string()).default([]),
  transportRequirements: z.array(z.string()).default([]),
  specialHandlingInstructions: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

export default function SellLivestockPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState<LivestockMarket[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      isHalal: false,
      specialFeatures: [],
      transportRequirements: [],
      images: [],
    },
  });

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    if (selectedType) {
      loadBreeds(selectedType);
    }
  }, [selectedType]);

  const loadMarkets = async () => {
    try {
      const data = await fetchLivestockMarkets();
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load markets. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const loadBreeds = async (type: string) => {
    try {
      const data = await fetchLivestockBreeds(type);
      setBreeds(data || []);
    } catch (error) {
      console.error('Error loading breeds:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setUploadProgress(prev => [...prev, ...Array(files.length).fill(0)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadLivestockImage(file, 'listings');
        uploadedUrls.push(url);
        
        // Update progress
        const newProgress = [...uploadProgress];
        newProgress[i] = 100;
        setUploadProgress(newProgress);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Upload images first
      const imageUrls = await uploadFiles(selectedFiles);
      
      // Prepare the listing data
      const listingData = {
        type: values.type,
        breed: values.breed,
        gender: values.gender,
        age: values.age,
        weight: values.weight,
        price: values.price,
        price_per_kg: values.pricePerKg,
        quantity: values.quantity,
        market_id: values.marketId,
        health_status: values.healthStatus,
        is_halal: values.isHalal,
        halal_certification_body: values.isHalal ? values.halalCertificationBody : null,
        certification_expiry_date: values.isHalal && values.certificationExpiryDate 
          ? new Date(values.certificationExpiryDate).toISOString() 
          : null,
        description: values.description || null,
        color: values.color || null,
        special_features: values.specialFeatures,
        transport_requirements: values.transportRequirements,
        special_handling_instructions: values.specialHandlingInstructions || null,
        images: imageUrls,
        status: 'available',
      };

      // Create the listing
      const newListing = await createLivestockListing(listingData);
      
      toast({
        title: 'Success!',
        description: 'Your livestock has been listed for sale.',
      });
      
      // Redirect to the new listing
      navigate(`/livestock/${newListing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const animalTypes = [
    { value: 'cattle', label: 'Cattle' },
    { value: 'goat', label: 'Goat' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'pigs', label: 'Pigs' },
  ];

  const specialFeatures = [
    { id: 'vaccinated', label: 'Vaccinated' },
    { id: 'dehorned', label: 'Dehorned' },
    { id: 'castrated', label: 'Castrated' },
    { id: 'pregnant', label: 'Pregnant' },
    { id: 'pedigree', label: 'Pedigree' },
  ];

  const transportRequirements = [
    { id: 'special_vehicle', label: 'Special Vehicle Required' },
    { id: 'ventilated', label: 'Ventilated Transport' },
    { id: 'temperature_controlled', label: 'Temperature Controlled' },
    { id: 'separate_pens', label: 'Separate Pens Needed' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sell Your Livestock</h1>
        <p className="text-gray-600 mb-8">Fill in the details below to list your livestock for sale on our marketplace.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide essential details about the livestock you're selling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animal Type *</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedType(value);
                            form.setValue('breed', '');
                          }} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select animal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {animalTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!selectedType}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select breed" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {breeds.map((breed) => (
                              <SelectItem key={breed.id} value={breed.name}>
                                {breed.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other (Please specify)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="castrated">Castrated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (months) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="e.g. 45.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="e.g. 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color/Markings</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Black and white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="healthStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="needs_attention">Needs Attention</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about the animal(s), including any special characteristics, history, or additional information that might be relevant to buyers." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Special Features</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {specialFeatures.map((feature) => (
                      <FormField
                        key={feature.id}
                        control={form.control}
                        name="specialFeatures"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={feature.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, feature.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== feature.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Location</CardTitle>
                <CardDescription>Set your price and select the market location.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (KES) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                            <Input 
                              type="number" 
                              className="pl-12" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per kg (KES, optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                            <Input 
                              type="number" 
                              className="pl-12" 
                              placeholder="0.00" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : Number(value));
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Optional. Will be calculated automatically if left blank.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Location *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select market" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {markets.map((market) => (
                              <SelectItem key={market.id} value={market.id}>
                                {market.name}, {market.county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Upload clear photos of the livestock from different angles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        {uploadProgress[index] < 100 && uploadProgress[index] > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${uploadProgress[index]}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {selectedFiles.length < 10 && (
                    <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="mt-2 block text-sm text-gray-600">Add Photo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          multiple 
                          onChange={handleFileChange}
                        />
                      </div>
                    </label>
                  )}
                </div>
                
                {form.formState.errors.images && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.images.message}
                  </p>
                )}
                
                <p className="mt-2 text-sm text-gray-500">
                  Upload up to 10 photos. First image will be used as the main photo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Halal Certification</CardTitle>
                <CardDescription>Provide halal certification details if applicable.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isHalal"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isHalal" 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel className="!mt-0">
                            This livestock is Halal certified
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('isHalal') && (
                  <div className="mt-4 space-y-4 pl-6">
                    <FormField
                      control={form.control}
                      name="halalCertificationBody"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certification Body *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Kenya Halal Certification Agency" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certificationExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transportation & Handling</CardTitle>
                <CardDescription>Provide details about transportation requirements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <FormLabel>Transport Requirements</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {transportRequirements.map((req) => (
                      <FormField
                        key={req.id}
                        control={form.control}
                        name="transportRequirements"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={req.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(req.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, req.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== req.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {req.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="specialHandlingInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Handling Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions for handling, loading, or transporting the livestock?" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
