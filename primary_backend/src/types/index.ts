import { z } from 'zod';

export const signupSchema = z.object({
  userName: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export const zapCreateSchema = z.object({
  AvailabletriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(z.object({
    AvailableactionId: z.string(),
    actionMetadata: z.any().optional(),
  })), 


});

