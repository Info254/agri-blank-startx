
import { supabase } from '@/integrations/supabase/client';

export interface TrainingEventFormData {
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  county: string;
  maxParticipants?: number;
  cost: number;
  topics: string[];
  targetAudience: string[];
  requirements: string[];
  contactInfo: string;
  registrationDeadline?: string;
  isOnline: boolean;
  meetingLink?: string;
  materialsProvided: boolean;
  certificateProvided: boolean;
}

export const createTrainingEvent = async (data: TrainingEventFormData) => {
  const { data: result, error } = await supabase
    .from('training_events')
    .insert({
      organizer_id: (await supabase.auth.getUser()).data.user?.id,
      title: data.title,
      description: data.description,
      event_type: data.eventType,
      start_date: data.startDate,
      end_date: data.endDate,
      location: data.location,
      county: data.county,
      max_participants: data.maxParticipants,
      cost: data.cost,
      topics: data.topics,
      target_audience: data.targetAudience,
      requirements: data.requirements,
      contact_info: data.contactInfo,
      registration_deadline: data.registrationDeadline,
      is_online: data.isOnline,
      meeting_link: data.meetingLink,
      materials_provided: data.materialsProvided,
      certificate_provided: data.certificateProvided,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getTrainingEvents = async (filters?: {
  county?: string;
  eventType?: string;
  isOnline?: boolean;
  upcomingOnly?: boolean;
}) => {
  let query = supabase
    .from('training_events')
    .select(`
      *,
      profiles:organizer_id (
        full_name,
        contact_number
      )
    `)
    .eq('is_active', true);

  if (filters?.county) {
    query = query.eq('county', filters.county);
  }

  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType);
  }

  if (filters?.isOnline !== undefined) {
    query = query.eq('is_online', filters.isOnline);
  }

  if (filters?.upcomingOnly !== false) {
    query = query.gte('start_date', new Date().toISOString());
  }

  const { data, error } = await query.order('start_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const registerForTraining = async (eventId: string) => {
  // For now, just increment the participant count
  const { data: currentEvent, error: fetchError } = await supabase
    .from('training_events')
    .select('current_participants')
    .eq('id', eventId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('training_events')
    .update({ 
      current_participants: (currentEvent.current_participants || 0) + 1 
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
