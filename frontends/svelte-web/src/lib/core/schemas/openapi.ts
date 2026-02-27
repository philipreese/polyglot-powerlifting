import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { 
  z, 
  LiftRequestSchema, 
  LiftResponseSchema,
  ValidationErrorSchema as ValidationError,
  HTTPValidationErrorSchema as HTTPValidationError
} from '@polylifts/core';

export type { LiftRequest, LiftResponse } from '@polylifts/core';

const LiftResponse = LiftResponseSchema;
const LiftRequest = LiftRequestSchema;

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
    description: `Fetch all history for the authenticated user.`,
    requestFormat: 'json',
    response: z.array(LiftResponse)
  },
  {
    method: 'post',
    path: '/lifts/',
    alias: 'create_lift_lifts__post',
    description: `Calculate and optionally save a new lift.`,
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
    description: `Delete a specific record.`,
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
