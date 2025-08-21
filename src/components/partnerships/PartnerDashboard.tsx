import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Partner, PartnerEvent, PartnerStats } from '@/types/partner';
import { partnerSchemas, PartnerProfileValues, PartnerEventFormValues } from '@/lib/validations/partner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { PartnerProfileForm } from './PartnerProfileForm';
import PartnerServicesForm from './PartnerServicesForm';
import { PartnerEventForm } from './PartnerEventForm';
import PartnerEventsList from './PartnerEventsList';
import { useAuth } from '@/hooks/use-auth';

type DashboardTab = 'overview' | 'events' | 'profile' | 'settings';

interface PartnerDashboardProps {
  partner?: Partner;
  isLoading?: boolean;
  onSave?: (data: PartnerProfileValues) => Promise<void>;
  onEventCreate?: (data: PartnerEventFormValues) => Promise<void>;
  onEventUpdate?: (id: string, data: PartnerEventFormValues) => Promise<void>;
  onEventDelete?: (id: string) => Promise<void>;
  stats?: PartnerStats;
  events?: PartnerEvent[];
}

export function PartnerDashboard({
  partner,
  isLoading = false,
  onSave,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  stats,
  events = [],
}: PartnerDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with default values
  const form = useForm<PartnerProfileValues>({
    resolver: zodResolver(partnerSchemas.partnerProfileValues),
    defaultValues: {
      companyName: partner?.name || '',
      contactEmail: partner?.email || '',
      contactPhone: partner?.phone || '',
      description: partner?.description || '',
      website: partner?.website || '',
      logoUrl: partner?.logoUrl || '',
      services: partner?.services || [],
      address: partner?.address?.street || '',
      city: partner?.address?.city || '',
      state: partner?.address?.state || '',
      country: partner?.address?.country || '',
      postalCode: partner?.address?.postalCode || '',
    },
  });

  // Update form when partner data changes
  useEffect(() => {
    if (partner) {
      form.reset({
        companyName: partner.name,
        contactEmail: partner.email,
        contactPhone: partner.phone,
        description: partner.description || '',
        website: partner.website || '',
        logoUrl: partner.logoUrl || '',
        services: partner.services || [],
        address: partner.address?.street || '',
        city: partner.address?.city || '',
        state: partner.address?.state || '',
        country: partner.address?.country || '',
        postalCode: partner.address?.postalCode || '',
      });
    }
  }, [partner, form]);

  // Handle tab changes from URL hash
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace('#', '') as DashboardTab;
      if (['overview', 'events', 'profile', 'settings'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    const tab = value as DashboardTab;
    setActiveTab(tab);
    navigate(`#${tab}`, { replace: true });
  };

  const handleProfileSubmit = async (data: PartnerProfileValues) => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(data);
      toast({
        title: 'Profile updated',
        description: 'Your partner profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEventCreate = async (data: PartnerEventFormValues) => {
    if (!onEventCreate) return;
    
    try {
      await onEventCreate(data);
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
      return true;
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEventUpdate = async (id: string, data: PartnerEventFormValues) => {
    if (!onEventUpdate) return;
    
    try {
      await onEventUpdate(id, data);
      toast({
        title: 'Event updated',
        description: 'Your event has been updated successfully.',
      });
      return true;
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEventDelete = async (id: string) => {
    if (!onEventDelete) return;
    
    try {
      await onEventDelete(id);
      toast({
        title: 'Event deleted',
        description: 'Your event has been deleted successfully.',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Partner Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find a partner profile associated with your account.
        </p>
        <Button onClick={() => navigate('/partners/onboard')}>
          Become a Partner
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your partner profile, events, and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/partners')}>
            View Public Profile
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                <CardTitle className="text-3xl">{stats?.totalEvents || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {stats?.upcomingEvents || 0} upcoming, {stats?.pastEvents || 0} past
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Partnerships</CardTitle>
                <CardTitle className="text-3xl">{stats?.totalPartners || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {stats?.activePartners || 0} active
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-3xl">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                  </CardTitle>
                  {stats?.averageRating && (
                    <span className="text-sm text-muted-foreground">
                      ({stats?.reviewCount || 0} reviews)
                    </span>
                  )}
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>
                Your upcoming and recent events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events && events.length > 0 ? (
                <PartnerEventsList 
                  events={events} 
                  onEdit={onEventUpdate ? (event) => {
                    // Handle edit event
                    const eventFormValues = {
                      title: event.title,
                      description: event.description,
                      startDate: new Date(event.startDate),
                      endDate: new Date(event.endDate),
                      location: event.location,
                      imageUrl: event.imageUrl,
                      maxAttendees: event.maxAttendees,
                      tags: event.tags || [],
                      isPublished: event.isPublished,
                    };
                    // You would typically open a modal or navigate to an edit page here
                    console.log('Edit event:', event.id, eventFormValues);
                  } : undefined}
                  onDelete={onEventDelete}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No events found.</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => handleTabChange('events')}
                  >
                    Create your first event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Events</h2>
              <p className="text-muted-foreground">
                Manage your upcoming and past events
              </p>
            </div>
            <Button onClick={() => {
              // Open event creation dialog
              console.log('Create new event');
            }}>
              Create Event
            </Button>
          </div>

          {events && events.length > 0 ? (
            <PartnerEventsList 
              events={events} 
              onEdit={onEventUpdate ? (event) => {
                // Handle edit event
                const eventFormValues = {
                  title: event.title,
                  description: event.description,
                  startDate: new Date(event.startDate),
                  endDate: new Date(event.endDate),
                  location: event.location,
                  imageUrl: event.imageUrl,
                  maxAttendees: event.maxAttendees,
                  tags: event.tags || [],
                  isPublished: event.isPublished,
                };
                console.log('Edit event:', event.id, eventFormValues);
              } : undefined}
              onDelete={onEventDelete}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-muted-foreground mb-4">
                  You haven't created any events yet.
                </div>
                <Button 
                  onClick={() => {
                    // Open event creation dialog
                    console.log('Create new event');
                  }}
                >
                  Create Your First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Partner Profile</CardTitle>
              <CardDescription>
                Update your partner profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-8">
                  <PartnerProfileForm control={form.control} />
                  <PartnerServicesForm control={form.control} />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Account</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Email
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">
                        ••••••••••
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <h4 className="font-medium">Delete Partner Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your partner account and all associated data.
                      </p>
                    </div>
                    <div>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
