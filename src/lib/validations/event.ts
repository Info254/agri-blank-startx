import { z } from 'zod';

// Validation patterns
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
const phoneRegex = /^\+?[1-9]\d{9,14}$/;

// Reusable validation messages
const validationMessages = {
  required: 'This field is required',
  minLength: (length: number) => `Must be at least ${length} characters`,
  maxLength: (length: number) => `Must be at most ${length} characters`,
  invalidUrl: 'Please enter a valid URL',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  futureDate: 'Date must be in the future',
  endAfterStart: 'End date must be after start date',
};

// Base event schema
export const eventBaseSchema = z.object({
  title: z.string()
    .min(5, { message: validationMessages.minLength(5) })
    .max(200, { message: validationMessages.maxLength(200) }),
  description: z.string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(5000, { message: 'Description must not exceed 5000 characters' }),
  startDate: z.string().datetime({ message: 'Invalid start date' })
    .refine(
      (date) => new Date(date) > new Date(),
      { message: validationMessages.futureDate }
    ),
  endDate: z.string().datetime({ message: 'Invalid end date' }),
  isOnline: z.boolean().default(false),
  location: z.string()
    .min(3, { message: validationMessages.minLength(3) })
    .max(500, { message: validationMessages.maxLength(500) })
    .optional(),
  meetingUrl: z.string()
    .regex(urlRegex, { message: validationMessages.invalidUrl })
    .optional()
    .or(z.literal('')),
  maxAttendees: z.number()
    .int()
    .min(1, 'Minimum 1 attendee')
    .max(10000, 'Maximum 10,000 attendees')
    .optional(),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .optional(),
  currency: z.string().length(3, 'Use 3-letter currency code').optional(),
  categories: z.array(z.string())
    .min(1, 'Select at least one category')
    .max(5, 'Maximum 5 categories'),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags')
    .optional(),
  imageUrl: z.string()
    .regex(urlRegex, { message: validationMessages.invalidUrl })
    .optional()
    .or(z.literal('')),
  isPublic: z.boolean().default(true),
  requiresRegistration: z.boolean().default(true),
  registrationDeadline: z.string().datetime().optional(),
  contactEmail: z.string()
    .email({ message: validationMessages.invalidEmail })
    .optional(),
  contactPhone: z.string()
    .regex(phoneRegex, { message: validationMessages.invalidPhone })
    .optional(),
  organizerId: z.string().uuid('Invalid organizer ID'),
  timezone: z.string().default('UTC'),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
  capacity: z.number().int().min(0).optional(),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  parentEventId: z.string().uuid('Invalid parent event ID').optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for creating a new event
export const createEventSchema = eventBaseSchema.refine(
  (data) => !data.isOnline || (data.isOnline && data.meetingUrl),
  {
    message: 'Meeting URL is required for online events',
    path: ['meetingUrl'],
  }
).refine(
  (data) => !data.requiresRegistration || (data.requiresRegistration && data.registrationDeadline),
  {
    message: 'Registration deadline is required when registration is required',
    path: ['registrationDeadline'],
  }
).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: validationMessages.endAfterStart,
    path: ['endDate'],
  }
);

// Schema for updating an event
export const updateEventSchema = eventBaseSchema.partial().refine(
  (data) => !data.endDate || !data.startDate || new Date(data.endDate) > new Date(data.startDate),
  {
    message: validationMessages.endAfterStart,
    path: ['endDate'],
  }
);

// Schema for event search filters
export const eventSearchFiltersSchema = z.object({
  query: z.string().optional(),
  categories: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isOnline: z.boolean().optional(),
  isFree: z.boolean().optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(500).optional(), // in kilometers
  organizerId: z.string().uuid().optional(),
  status: z.array(z.enum(['upcoming', 'ongoing', 'past', 'cancelled'])).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['date', 'relevance', 'popularity']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Schema for event registration
export const eventRegistrationSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  attendeeName: z.string()
    .min(2, { message: validationMessages.minLength(2) })
    .max(100, { message: validationMessages.maxLength(100) }),
  attendeeEmail: z.string()
    .email({ message: validationMessages.invalidEmail }),
  attendeePhone: z.string()
    .regex(phoneRegex, { message: validationMessages.invalidPhone })
    .optional(),
  company: z.string()
    .max(100, { message: validationMessages.maxLength(100) })
    .optional(),
  jobTitle: z.string()
    .max(100, { message: validationMessages.maxLength(100) })
    .optional(),
  notes: z.string()
    .max(1000, { message: validationMessages.maxLength(1000) })
    .optional(),
  customFields: z.record(z.any()).optional(),
});

// Schema for event feedback/rating
export const eventFeedbackSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string()
    .min(10, 'Please provide more detailed feedback')
    .max(1000, 'Comment is too long')
    .optional(),
  wouldRecommend: z.boolean().optional(),
  topicsCovered: z.array(z.string())
    .max(10, 'Maximum 10 topics')
    .optional(),
  additionalFeedback: z.string()
    .max(2000, 'Feedback is too long')
    .optional(),
  anonymous: z.boolean().default(false),
});

// Types
export type EventBase = z.infer<typeof eventBaseSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventSearchFilters = z.infer<typeof eventSearchFiltersSchema>;
export type EventRegistration = z.infer<typeof eventRegistrationSchema>;
export type EventFeedback = z.infer<typeof eventFeedbackSchema>;
