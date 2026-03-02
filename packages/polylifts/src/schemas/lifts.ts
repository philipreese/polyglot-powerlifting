import { z } from 'zod';

export const GenderSchema = z.enum(['male', 'female']);
export type Gender = z.infer<typeof GenderSchema>;

export const EquipmentSchema = z.enum(['raw', 'single-ply', 'multi-ply']);
export type Equipment = z.infer<typeof EquipmentSchema>;

export const LiftRequestSchema = z.object({
  bodyweight: z.number().gt(20),
  gender: GenderSchema,
  equipment: EquipmentSchema,
  squat: z.number().gte(0),
  bench: z.number().gte(0),
  deadlift: z.number().gte(0)
});

export type LiftRequest = z.infer<typeof LiftRequestSchema>;

export const LiftResponseSchema = LiftRequestSchema.extend({
  id: z.string().uuid().nullable().optional(),
  user_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  total: z.number(),
  wilks: z.number(),
  dots: z.number(),
  ipf_gl: z.number(),
  reshel: z.number()
});

export type LiftResponse = z.infer<typeof LiftResponseSchema>;

export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
  input: z.unknown().optional(),
  ctx: z.object({}).partial().passthrough().optional()
});

export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema)
}).partial();
