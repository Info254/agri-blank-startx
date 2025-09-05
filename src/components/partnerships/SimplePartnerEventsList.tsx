// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function SimplePartnerEventsList({ events = [], onEdit, onDelete }) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {event.title}
              <Badge variant="outline">Upcoming</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{event.startDate}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
              {event.maxAttendees && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{event.attendeesCount || 0} / {event.maxAttendees}</span>
                </div>
              )}
            </div>
            {(onEdit || onDelete) && (
              <div className="flex gap-2 mt-4">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="outline" onClick={() => onDelete(event.id)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}