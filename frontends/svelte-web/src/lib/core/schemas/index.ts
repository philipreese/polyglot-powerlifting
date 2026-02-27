import { LiftRequestSchema, LiftResponseSchema } from '@polylifts/core';
import type { LiftRequest, LiftResponse } from '@polylifts/core';

// Re-export from the shared core package to maintain internal API stability
export const LiftSchema = LiftRequestSchema;
export { LiftResponseSchema };
export type { LiftRequest, LiftResponse };
