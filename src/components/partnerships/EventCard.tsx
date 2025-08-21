import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PartnerEvent } from '@/types/partner';

interface EventCardProps {
  event: PartnerEvent;
  onEdit: () => void;
  onDelete: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const isPast = endDate < new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();
  
  const getStatusBadge = () => {
    if (isPast) {
      return <Badge variant="secondary">Past</Badge>;
    }
    if (isOngoing) {
      return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {event.imageUrl && (
        <div className="h-40 bg-muted overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
            <div className="mt-1">{getStatusBadge()}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{format(startDate, 'PPP')}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>
            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </span>
        </div>
        
        {event.location && (
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{event.location}</span>
          </div>
        )}
        
        {event.maxAttendees !== undefined && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>
              {event.attendeesCount || 0} / {event.maxAttendees} attendees
            </span>
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
      
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
