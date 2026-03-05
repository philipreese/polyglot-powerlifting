import { LiftRequestSchema, LiftResponseSchema, type LiftRequest, type LiftResponse } from 'polylifts';

// Cleanly export the extracted schema to the rest of the application
export const LiftSchema = LiftRequestSchema;
export { LiftResponseSchema };
export type { LiftRequest, LiftResponse };
