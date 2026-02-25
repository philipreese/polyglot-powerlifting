import type { z } from 'zod';
import { schemas } from './openapi';

// Cleanly export the extracted schema to the rest of the application
export const LiftSchema = schemas.LiftRequest;

// Cleanly export the inferred Typescript type to the rest of the application
export type LiftRequest = z.infer<typeof LiftSchema>;
