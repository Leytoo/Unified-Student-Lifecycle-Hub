import { z } from 'zod';

export const GradeUpdateSchema = z.object({
  enrollmentId: z.string().uuid({ message: "Invalid enrollment reference ID format (must be UUID)." }),
  grade: z.number()
    .min(0.0, { message: "Data Quality Error: Grade cannot be lower than 0.0" })
    .max(4.0, { message: "Data Quality Error: Grade cannot exceed 4.0" }),
  remarks: z.string().max(255).optional(),
});

export type GradeUpdateInput = z.infer<typeof GradeUpdateSchema>;
