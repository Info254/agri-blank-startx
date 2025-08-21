
import { TrainingEvent } from '@/types';
import { simulateDelay } from '../apiUtils';
import { mockTrainingEvents } from '../mockData/trainingEvents';

export const fetchTrainingEvents = async (providerId?: string): Promise<TrainingEvent[]> => {
  await simulateDelay(800);
  
  if (providerId) {
    return mockTrainingEvents.filter(event => event.providerId === providerId);
  }
  
  return mockTrainingEvents;
};

export const addTrainingEvent = async (eventData: Omit<TrainingEvent, 'id'>): Promise<TrainingEvent> => {
  await simulateDelay(1000);
  
  const newEvent: TrainingEvent = {
    ...eventData,
    id: `te${mockTrainingEvents.length + 1}`
  };
  
  return newEvent;
};
