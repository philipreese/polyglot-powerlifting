import { z } from 'zod';

export const LiftSchema = z.object({
    bodyweight: z.number().positive("Bodyweight must be positive").gt(20, "Bodyweight must be greater than 20kg"),
    gender: z.enum(['male', 'female']),
    equipment: z.enum(['raw', 'single-ply', 'multi-ply']),
    squat: z.number().min(0, "Squat cannot be negative"),
    bench: z.number().min(0, "Bench cannot be negative"),
    deadlift: z.number().min(0, "Deadlift cannot be negative"),
});

export type LiftRequest = z.infer<typeof LiftSchema>;
