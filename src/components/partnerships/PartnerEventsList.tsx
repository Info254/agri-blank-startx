import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Calendar, MapPin, Users, Pencil, Trash2, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { PartnerEvent } from '@/types/partner';

interface PartnerEventsListProps {
  events: PartnerEvent[];
  isLoading?: boolean;
  onEdit?: (event: PartnerEvent) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onPublish?: (id: string, publish: boolean) => Promise<boolean>;
  variant?: 'grid' | 'list';
  className?: string;
}

export default function PartnerEventsList({ 
  events, 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onPublish,
  variant = 'grid',
  className = ''
}: PartnerEventsListProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingStates, setPublishingStates] = useState<Record<string, boolean>>({});

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete || !onDelete) {
      setDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const success = await onDelete(eventToDelete);
      if (success) {
        toast({
          title: 'Event deleted',
          description: 'The event has been successfully deleted.',
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handlePublishToggle = async (event: PartnerEvent) => {
    if (!onPublish) return;

    setPublishingStates(prev => ({ ...prev, [event.id]: true }));
    
    try {
      const success = await onPublish(event.id, !event.isPublished);
      if (success) {
        toast({
          title: event.isPublished ? 'Event unpublished' : 'Event published',
          description: event.isPublished 
            ? 'Your event is no longer visible to the public.' 
            : 'Your event is now live and visible to the public!',
        });
      }
    } catch (error) {
      console.error('Error toggling event publish status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${event.isPublished ? 'unpublish' : 'publish'} event. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setPublishingStates(prev => ({ ...prev, [event.id]: false }));
    }
  };

  const getEventStatus = (event: PartnerEvent) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const now = new Date();

    if (isPast(endDate)) {
      return { label: 'Completed', variant: 'default' as const };
    }
    
    if (isPast(startDate) && !isPast(endDate)) {
      return { label: 'In Progress', variant: 'success' as const };
    }
    
    if (isToday(startDate)) {
      return { label: 'Today', variant: 'secondary' as const };
    }
    
    if (isTomorrow(startDate)) {
      return { label: 'Tomorrow', variant: 'outline' as const };
    }
    
    return { label: 'Upcoming', variant: 'outline' as const };
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${variant === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col">
            <Skeleton className="h-40 w-full rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5 mt-2" />
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-foreground">No events</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new event.
        </p>
        {onEdit && (
          <div className="mt-6">
            <Button onClick={() => onEdit({} as PartnerEvent)}>
              <Pencil className="-ml-1 mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        )}
      </div>
    );
  }

  const EventCard = ({ event }: { event: PartnerEvent }) => {
    const status = getEventStatus(event);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    return (
      <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
        {event.imageUrl && (
          <div className="h-40 overflow-hidden rounded-t-lg border-b">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
              <div className="mt-1 flex items-center">
                <Badge variant={status.variant} className="mr-2">
                  {status.label}
                </Badge>
                {!event.isPublished && (
                  <Badge variant="outline" className="border-dashed">
                    Draft
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pb-3">
          <div className="flex items-start gap-3 text-sm">
            <div className="mt-0.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">
                {format(startDate, 'MMMM d, yyyy')}
              </div>
              <div className="text-muted-foreground">
                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
              </div>
            </div>
          </div>
          
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <div className="mt-0.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-muted-foreground line-clamp-2">
                {event.location}
              </div>
            </div>
          )}
          
          {(event.maxAttendees !== undefined || event.attendeesCount !== undefined) && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="text-muted-foreground">
                {event.attendeesCount || 0} {event.maxAttendees ? `of ${event.maxAttendees}` : ''} attendees
              </div>
            </div>
          )}
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 pt-0">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(event)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          
          {onPublish && (
            <Button 
              variant={event.isPublished ? 'outline' : 'default'} 
              size="sm" 
              className="flex-1"
              onClick={() => handlePublishToggle(event)}
              disabled={publishingStates[event.id]}
            >
              {event.isPublished ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDeleteClick(event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const EventListItem = ({ event }: { event: PartnerEvent }) => {
    const status = getEventStatus(event);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        {event.imageUrl && (
          <div className="w-full sm:w-40 h-32 overflow-hidden rounded-md">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground">{event.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={status.variant}>
                  {status.label}
                </Badge>
                {!event.isPublished && (
                  <Badge variant="outline" className="border-dashed">
                    Draft
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(event)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              
              {onPublish && (
                <Button 
                  variant={event.isPublished ? 'outline' : 'default'} 
                  size="sm"
                  onClick={() => handlePublishToggle(event)}
                  disabled={publishingStates[event.id]}
                >
                  {event.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div>{format(startDate, 'MMMM d, yyyy')}</div>
                <div className="text-muted-foreground">
                  {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                </div>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground line-clamp-2">
                  {event.location}
                </div>
              </div>
            )}
            
            {(event.maxAttendees !== undefined || event.attendeesCount !== undefined) && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="text-muted-foreground">
                  {event.attendeesCount || 0} {event.maxAttendees ? `of ${event.maxAttendees}` : ''} attendees
                </div>
              </div>
            )}
          </div>
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={variant === 'grid' 
        ? `grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}` 
        : `space-y-4 ${className}`}>
        {events.map((event) => (
          variant === 'grid' 
            ? <EventCard key={event.id} event={event} /> 
            : <EventListItem key={event.id} event={event} />
        ))}
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
