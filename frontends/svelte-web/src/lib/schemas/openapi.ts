import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const LiftResponse = z
  .object({
    bodyweight: z.number().gt(20),
    gender: z.string().regex(/^(male|female)$/),
    equipment: z.string().regex(/^(raw|single-ply|multi-ply)$/),
    squat: z.number().gte(0),
    bench: z.number().gte(0),
    deadlift: z.number().gte(0),
    id: z.union([z.string(), z.null()]).optional(),
    user_id: z.union([z.string(), z.null()]).optional(),
    created_at: z.union([z.string(), z.null()]).optional(),
    total: z.number(),
    wilks: z.number(),
    dots: z.number(),
    ipf_gl: z.number(),
    reshel: z.number()
  })
  .passthrough();
const LiftRequest = z
  .object({
    bodyweight: z.number().gt(20),
    gender: z.string().regex(/^(male|female)$/),
    equipment: z.string().regex(/^(raw|single-ply|multi-ply)$/),
    squat: z.number().gte(0),
    bench: z.number().gte(0),
    deadlift: z.number().gte(0)
  })
  .passthrough();
const ValidationError = z
  .object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string(),
    input: z.unknown().optional(),
    ctx: z.object({}).partial().passthrough().optional()
  })
  .passthrough();
const HTTPValidationError = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();

export const schemas = {
  LiftResponse,
  LiftRequest,
  ValidationError,
  HTTPValidationError
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/',
    alias: 'read_root__get',
    requestFormat: 'json',
    response: z.unknown()
  },
  {
    method: 'get',
    path: '/lifts/',
    alias: 'get_lifts_lifts__get',
    requestFormat: 'json',
    response: z.array(LiftResponse)
  },
  {
    method: 'post',
    path: '/lifts/',
    alias: 'create_lift_lifts__post',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: LiftRequest
      }
    ],
    response: LiftResponse,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  },
  {
    method: 'delete',
    path: '/lifts/',
    alias: 'clear_lifts_lifts__delete',
    description: `Clear all authenticated history.`,
    requestFormat: 'json',
    response: z.unknown()
  },
  {
    method: 'delete',
    path: '/lifts/:lift_id',
    alias: 'delete_lift_lifts__lift_id__delete',
    requestFormat: 'json',
    parameters: [
      {
        name: 'lift_id',
        type: 'Path',
        schema: z.string().uuid()
      }
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  },
  {
    method: 'post',
    path: '/lifts/sync',
    alias: 'sync_lifts_lifts_sync_post',
    description: `Bulk import local offline history into the user&#x27;s account.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.array(LiftResponse)
      }
    ],
    response: z.array(LiftResponse),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  }
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
