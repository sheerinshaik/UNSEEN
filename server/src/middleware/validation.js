import { z } from 'zod';
import { VALID_CATEGORIES, VALID_STATUSES } from '../models/Report.js';

export const registerSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(254),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const submitReportSchema = z.object({
  category: z.string().refine((val) => VALID_CATEGORIES.includes(val), {
    message: 'Invalid category selected'
  }),
  description: z
    .string()
    .trim()
    .min(20, 'Please provide at least 20 characters describing the issue')
    .max(5000, 'Report description cannot exceed 5000 characters'),
  incidentDate: z.string().trim().max(100).optional().default(''),
  departmentOrLocation: z.string().trim().max(150).optional().default(''),
  requestedResolution: z.string().trim().max(1000).optional().default('')
});

export const trackReportSchema = z.object({
  reference: z
    .string()
    .trim()
    .regex(/^UNS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid report reference format (expected UNS-XXXX-XXXX-XXXX)'),
  trackingSecret: z.string().trim().min(10, 'Tracking secret is required to access private report details')
});

export const updateStatusSchema = z.object({
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({ message: 'Invalid report status' })
  }),
  note: z.string().trim().max(500).optional().default('')
});

export const addResponseSchema = z.object({
  message: z
    .string()
    .trim()
    .min(5, 'Response message must be at least 5 characters')
    .max(3000, 'Response message cannot exceed 3000 characters'),
  roleLabel: z.string().trim().max(100).optional().default('Authorized Reviewer')
});

export const reviewerInviteSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  department: z.string().trim().min(2).max(100).default('General Review')
});

export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return res.status(400).json({
          success: false,
          error: errorMessages[0]?.message || 'Validation error',
          details: errorMessages
        });
      }
      next(err);
    }
  };
}
