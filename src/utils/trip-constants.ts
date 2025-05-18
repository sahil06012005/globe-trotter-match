
import { z } from 'zod';

// Available interests for trips
export const availableInterests = [
  'Adventure', 'Art', 'Beach', 'Camping', 'City Exploration',
  'Culture', 'Cuisine', 'Diving', 'Festivals', 'Hiking',
  'History', 'Local Experience', 'Luxury', 'Mountains', 'Museums',
  'Music', 'Nature', 'Nightlife', 'Photography', 'Relaxation',
  'Road Trip', 'Shopping', 'Sightseeing', 'Solo Travel', 'Sports',
  'Study', 'Trekking', 'Volunteering', 'Wellness', 'Wildlife',
  'Winter Sports', 'Work Retreat', 'Yoga'
];

// Budget options
export const budgetOptions = [
  'Budget',
  'Mid-range',
  'Mid-range to High',
  'Mid-range to Luxury',
  'Luxury'
];

// Form schema definition
export const tripFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  destination: z.string().min(3, 'Destination must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  maxTravelers: z.coerce
    .number()
    .min(2, 'Need at least 2 travelers')
    .max(20, 'Maximum 20 travelers allowed'),
  budget: z.string({
    required_error: "Budget category is required",
  }),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});
