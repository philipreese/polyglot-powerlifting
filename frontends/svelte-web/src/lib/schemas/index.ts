import type { z } from 'zod';
import { schemas } from './openapi';

// Cleanly export the extracted schema to the rest of the application
export const LiftSchema = schemas.LiftRequest;
export type LiftRequest = z.infer<typeof LiftSchema>;

export const LiftResponseSchema = schemas.LiftResponse;
export type LiftResponse = z.infer<typeof LiftResponseSchema>;
