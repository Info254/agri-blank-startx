// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useToast } from '@/components/ui/use-toast';
import { fetchLivestockListing, updateLivestockListing, fetchLivestockMarkets, fetchLivestockBreeds } from '@/services/livestockMarketService';
import { LivestockListing } from '@/types/livestock';

// Reuse the same schema as SellLivestockPage with slight modifications
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

export default function EditLivestockPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [markets, setMarkets] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      breed: '',
      gender: '',
      age: 0,
      weight: 0,
      price: 0,
      quantity: 1,
      marketId: '',
      healthStatus: '',
      isHalal: false,
      description: '',
      color: '',
      specialFeatures: [],
      transportRequirements: [],
      specialHandlingInstructions: '',
      images: [],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Load markets in parallel with the listing data
        const [listingData, marketsData] = await Promise.all([
          fetchLivestockListing(id),
          fetchLivestockMarkets(),
        ]);

        if (!listingData) {
          toast({
            title: 'Error',
            description: 'Listing not found',
            variant: 'destructive',
          });
          navigate('/livestock/my-listings');
          return;
        }

        // Load breeds for the specific type
        const breedsData = await fetchLivestockBreeds(listingData.type);
        setBreeds(breedsData || []);
        
        // Set form values from the existing listing
        form.reset({
          type: listingData.type,
          breed: listingData.breed,
          gender: listingData.gender,
          age: listingData.age,
          weight: listingData.weight,
          price: listingData.price,
          pricePerKg: listingData.price_per_kg,
          quantity: listingData.quantity,
          marketId: listingData.market_id,
          healthStatus: listingData.health_status,
          isHalal: listingData.is_halal,
          halalCertificationBody: listingData.halal_certification_body || '',
          certificationExpiryDate: listingData.certification_expiry_date 
            ? new Date(listingData.certification_expiry_date).toISOString().split('T')[0]
            : '',
          description: listingData.description || '',
          color: listingData.color || '',
          specialFeatures: listingData.special_features || [],
          transportRequirements: listingData.transport_requirements || [],
          specialHandlingInstructions: listingData.special_handling_instructions || '',
          images: listingData.images || [],
        });

        setExistingImages(listingData.images || []);
        setMarkets(marketsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load listing data. Please try again.',
          variant: 'destructive',
        });
        navigate('/livestock/my-listings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      setUploadProgress(prev => [...prev, ...Array(files.length).fill(0)]);
    }
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  const removeNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
    
    const updatedProgress = [...uploadProgress];
    updatedProgress.splice(index, 1);
    setUploadProgress(updatedProgress);
  };

  const uploadFiles = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // In a real implementation, you would upload the file here
        // const url = await uploadLivestockImage(file, 'listings');
        // Mock upload for demonstration
        await new Promise(resolve => setTimeout(resolve, 500));
        const url = URL.createObjectURL(file);
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
    if (!id) return;

    try {
      setSaving(true);
      
      // Upload new images if any
      let imageUrls = [...existingImages];
      if (newImages.length > 0) {
        const uploadedUrls = await uploadFiles(newImages);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      // Prepare the update data
      const updateData = {
        ...values,
        price_per_kg: values.pricePerKg,
        market_id: values.marketId,
        health_status: values.healthStatus,
        is_halal: values.isHalal,
        halal_certification_body: values.isHalal ? values.halalCertificationBody : null,
        certification_expiry_date: values.isHalal && values.certificationExpiryDate 
          ? new Date(values.certificationExpiryDate).toISOString() 
          : null,
        special_features: values.specialFeatures,
        transport_requirements: values.transportRequirements,
        special_handling_instructions: values.specialHandlingInstructions,
        images: imageUrls,
      };

      // Update the listing
      const updatedListing = await updateLivestockListing(id, updateData);
      
      toast({
        title: 'Success!',
        description: 'Your listing has been updated.',
      });
      
      // Redirect to the updated listing
      navigate(`/livestock/${updatedListing.id}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to update listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Livestock Listing</h1>
        <p className="text-gray-600 mb-8">Update the details of your livestock listing.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update essential details about the livestock.</CardDescription>
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
                            form.setValue('breed', '');
                            fetchLivestockBreeds(value).then(data => setBreeds(data || []));
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
                          disabled={!form.watch('type')}
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
                <CardDescription>Update pricing and market location.</CardDescription>
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
                <CardDescription>Update photos of your livestock.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                        <img 
                          src={image} 
                          alt={`Livestock ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`New image ${index + 1}`}
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
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {existingImages.length + newImages.length < 10 && (
                    <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="mt-2 block text-sm text-gray-600">Add Photos</span>
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
                
                <p className="mt-4 text-sm text-gray-500">
                  You can upload up to 10 photos. The first image will be used as the main photo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Halal Certification</CardTitle>
                <CardDescription>Update halal certification details if applicable.</CardDescription>
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
                <CardDescription>Update transportation requirements and special handling instructions.</CardDescription>
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

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
