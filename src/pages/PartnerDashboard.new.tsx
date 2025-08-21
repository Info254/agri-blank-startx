import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Icons
import { 
  ArrowUpRight, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Edit,
  Handshake,
  Loader2, 
  Package, 
  Plus,
  Star,
  X 
} from 'lucide-react';

// Hooks & Services
import { useAuth } from '@/hooks/use-auth';
import { 
  getMyPartner, 
  getPartnerEvents, 
  createPartnerEvent, 
  updatePartnerEvent 
} from '@/services/partnerService';

// Components
import EventCard from '@/components/partnerships/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerProfileForm } from '@/components/partnerships/PartnerProfileForm';

// Types & Schemas
import { Partner, PartnerEvent } from '@/types/partner';
import { adaptPartnerFromDb as adaptPartnerFromApi, adaptEventFromApi } from '@/utils/adapters';
import { createEventSchema, updateEventSchema, CreateEventInput, UpdateEventInput } from '@/lib/validations/event';

type DashboardTab = 'overview' | 'events' | 'partnerships' | 'profile' | 'settings';

const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  return format(new Date(date), options?.year ? 'MMMM yyyy' : 'MMM d, yyyy');
};

export const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State management
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PartnerEvent | null>(null);
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  
  // Form handling
  const eventForm = useForm<CreateEventInput | UpdateEventInput>({
    resolver: zodResolver(editingEvent ? updateEventSchema : createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3600000).toISOString(),
      isOnline: false,
      isPublic: true,
      requiresRegistration: true,
      status: 'draft',
    },
  });
  
  // Reset form when editing event changes
  useEffect(() => {
    if (editingEvent) {
      eventForm.reset({
        ...editingEvent,
        tags: editingEvent.tags || [],
      });
    } else {
      eventForm.reset({
        title: '',
        description: '',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        isOnline: false,
        isPublic: true,
        requiresRegistration: true,
        status: 'draft',
      });
    }
  }, [editingEvent]);

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!user) {
        navigate('/auth?redirect=/partner/dashboard');
        return;
      }
      try {
        const { data, error } = await getMyPartner();
        if (error) throw error;
        
        if (!data) {
          navigate('/partner/onboarding');
          return;
        }
        
        setPartner(adaptPartnerFromApi(data));
        fetchPartnerEvents();
      } catch (error) {
        console.error('Error:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to load partner data.', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartnerData();
  }, [user, navigate, toast]);

  const fetchPartnerEvents = async () => {
    try {
      setEventsLoading(true);
      const { data, error } = await getPartnerEvents();
      if (error) throw error;
      setEvents((data || []).map(adaptEventFromApi));
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events.',
        variant: 'destructive',
      });
    } finally {
      setEventsLoading(false);
    }
  };

  const handleEventSubmit = async (data: CreateEventInput | UpdateEventInput) => {
    if (!partner) return;
    
    try {
      if (editingEvent) {
        const response = await updatePartnerEvent(editingEvent.id, {
          ...data,
          partnerId: partner.id,
        });
        
        if (response.error) throw response.error;
        if (!response.data) throw new Error('Failed to update event');
        
        // Update local state
        setEvents(events.map(evt => 
          evt.id === editingEvent.id ? { ...evt, ...response.data } : evt
        ));
        
        toast({
          title: 'Success',
          description: 'Event updated successfully',
        });
      } else {
        const response = await createPartnerEvent({
          ...data,
          partnerId: partner.id,
          organizerId: user?.id || '',
        });
        
        if (response.error) throw response.error;
        if (!response.data) throw new Error('Failed to create event');
        
        // Update local state
        setEvents([response.data, ...events]);
        
        toast({
          title: 'Success',
          description: 'Event created successfully',
        });
      }
      
      // Reset form and close
      setShowEventForm(false);
      setEditingEvent(null);
      
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save event',
        variant: 'destructive',
      });
    }
  };

  const handleEditEvent = (event: PartnerEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      setEventsLoading(true);
      // Filter out the deleted event from local state
      setEvents(events.filter(evt => evt.id !== eventId));
      
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete event',
        variant: 'destructive',
      });
    } finally {
      setEventsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="max-w-2xl mx-auto p-8 bg-muted/50 rounded-lg">
          <Package className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Partner Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't set up your partner profile yet. Complete the onboarding process to get started.
          </p>
          <Button onClick={() => navigate('/partner/onboarding')}>
            Start Partner Onboarding <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{partner.name}</h1>
            <Badge variant="outline" className="text-sm">
              Partner
            </Badge>
            {partner.isVerified && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Member since {formatDate(partner.createdAt, { year: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button variant="outline" onClick={() => setActiveTab('profile')}>
          <Edit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </header>

      {/* Main Content */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as DashboardTab)} 
        className="space-y-6"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
                <CardTitle className="text-3xl font-bold">{events.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" /> Next event coming soon
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Partnerships</CardTitle>
                <CardTitle className="text-3xl font-bold">0</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Handshake className="h-3.5 w-3.5 mr-1" /> No active partnerships
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Partner Rating</CardTitle>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <CardTitle className="text-3xl font-bold">{partner.rating || 'N/A'}</CardTitle>
                  {partner.reviewCount && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({partner.reviewCount} {partner.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {partner.reviewCount ? `Based on ${partner.reviewCount} customer ratings` : 'No ratings yet'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Events</CardTitle>
                <Button onClick={() => setShowEventForm(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {showEventForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
                          <CardDescription>
                            {editingEvent 
                              ? 'Update your event details below.'
                              : 'Fill in the details below to create a new event.'}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setShowEventForm(false);
                            setEditingEvent(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Form {...eventForm}>
                        <form onSubmit={eventForm.handleSubmit(handleEventSubmit)} className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={eventForm.control}
                              name="title"
                              render={({ field }) => (
                                <div>
                                  <Label>Event Title</Label>
                                  <Input {...field} />
                                </div>
                              )}
                            />
                            
                            <FormField
                              control={eventForm.control}
                              name="description"
                              render={({ field }) => (
                                <div>
                                  <Label>Description</Label>
                                  <Input {...field} />
                                </div>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowEventForm(false);
                                setEditingEvent(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={eventForm.formState.isSubmitting}>
                              {eventForm.formState.isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  {editingEvent ? 'Updating...' : 'Creating...'}
                                </>
                              ) : editingEvent ? (
                                'Update Event'
                              ) : (
                                'Create Event'
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                {eventsLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-40 w-full rounded-t-lg" />
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-9 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : events.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onEdit={() => handleEditEvent(event)}
                        onDelete={() => handleDeleteEvent(event.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No events yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Get started by creating your first event to engage with your audience.
                    </p>
                    <Button onClick={() => setShowEventForm(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create Event
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Partner Profile</CardTitle>
              <CardDescription>
                Manage your company information and how you appear to others on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerProfileForm 
                initialData={partner}
                onSuccess={(updatedPartner) => {
                  setPartner(updatedPartner);
                  toast({
                    title: 'Success',
                    description: 'Your profile has been updated successfully.',
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Settings content */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Manage your email notification preferences</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerDashboard;
