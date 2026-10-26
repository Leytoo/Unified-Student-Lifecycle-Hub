import { z } from 'zod';
import { DQM_CONFIG } from '../constants';

export const StudentCreateSchema = z.object({
  studentNo: z.string().regex(DQM_CONFIG.STUDENT_ID_REGEX, {
    message: "Data Quality Error: Student Number must match format STU-YYYY-XXXX (e.g., STU-2026-0042)"
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.string().email("Data Quality Error: Invalid RFC email address format").toLowerCase().trim(),
  department: z.string().min(2, "Department is required"),
  yearLevel: z.number().int().min(1).max(5),
  ssn: z.string().optional(),
  phone: z.string().optional()
});

export type StudentCreateInput = z.infer<typeof StudentCreateSchema>;
