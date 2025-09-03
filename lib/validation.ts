import { z } from 'zod';

export const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required').max(200, 'Name too long'),
  address: z.string().min(1, 'Address is required').max(500, 'Address too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  state: z.string().min(1, 'State is required').max(100, 'State name too long'),
  contact: z.string()
    .min(10, 'Contact number must be at least 10 digits')
    .max(15, 'Contact number too long')
    .regex(/^[0-9]+$/, 'Contact number must contain only digits'),
  email_id: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(200, 'Email too long'),
  image: z.any().optional()
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
