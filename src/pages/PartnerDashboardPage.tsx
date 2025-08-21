import { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePartnerDashboard } from '@/hooks/use-partner-dashboard';
import { PartnerDashboard } from '@/components/partnerships/PartnerDashboard';
import { PartnerEventFormValues } from '@/lib/validations/partner';
import { PartnerSidebar } from '@/components/partnerships/PartnerSidebar';

export default function PartnerDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  const {
    isLoading,
    partner,
    events,
    stats,
    isSaving,
    savePartnerProfile,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventPublish,
  } = usePartnerDashboard();

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsCreatingEvent(false);
  };

  // Handle create new event
  const handleCreateEvent = async (data: PartnerEventFormValues) => {
    const success = await createEvent(data);
    if (success) {
      setIsCreatingEvent(false);
    }
    return success;
  };

  // Handle edit event
  const handleEditEvent = (event: any) => {
    // In a real app, you might open a modal or navigate to an edit page
    console.log('Edit event:', event);
    // For now, we'll just log it
  };

  // Handle delete event
  const handleDeleteEvent = async (id: string) => {
    return await deleteEvent(id);
  };

  // Handle publish/unpublish event
  const handleTogglePublish = async (id: string, publish: boolean) => {
    return await toggleEventPublish(id, publish);
  };

  // If not a partner, show a message with a link to become a partner
  if (!isLoading && !partner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Partner Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mx-auto max-w-md space-y-4">
              <h2 className="text-2xl font-bold">Become a Partner</h2>
              <p className="text-muted-foreground">
                You don't have a partner account yet. Join our partner program to access the dashboard and start managing your events and profile.
              </p>
              <Button onClick={() => navigate('/partners/onboard')}>
                Apply to Become a Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <PartnerSidebar />
      
      <main className="flex-1 p-8">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="space-y-6"
        >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your partner profile, events, and settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'events' && (
              <Button 
                onClick={() => setIsCreatingEvent(!isCreatingEvent)}
                className="ml-auto"
              >
                {isCreatingEvent ? 'Cancel' : 'Create Event'}
              </Button>
            )}
          </div>
        </div>

        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PartnerDashboard 
            partner={partner}
            isLoading={isLoading}
            stats={stats}
            events={events}
            onSave={savePartnerProfile}
            onEventCreate={handleCreateEvent}
            onEventUpdate={updateEvent}
            onEventDelete={handleDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {isCreatingEvent ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                {/* In a real app, you would render an event form component here */}
                <div className="space-y-4">
                  <p>Event creation form would go here</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsCreatingEvent(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Event</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PartnerDashboard 
              partner={partner}
              isLoading={isLoading}
              stats={stats}
              events={events}
              onSave={savePartnerProfile}
              onEventCreate={handleCreateEvent}
              onEventUpdate={updateEvent}
              onEventDelete={handleDeleteEvent}
            />
          )}
        </TabsContent>

        <TabsContent value="profile">
          <PartnerDashboard 
            partner={partner}
            isLoading={isLoading}
            stats={stats}
            events={events}
            onSave={savePartnerProfile}
            onEventCreate={handleCreateEvent}
            onEventUpdate={updateEvent}
            onEventDelete={handleDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Partner settings and preferences will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
        
        {/* Nested routes will be rendered here */}
        <div className="mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
