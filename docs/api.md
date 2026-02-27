# API Reference

The Polyglot Powerlifting API is a high-performance FastAPI service. For the pedagogical "Why" and deep architectural traces, see [MASTER_LORE.md](file:///home/preese/workspace/polyglot-powerlifting/docs/MASTER_LORE.md).

## 1. Authentication

The API uses **Supabase Auth** (GoTrue). All protected endpoints require a valid JWT in the `Authorization` header.

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 2. Core Endpoints

### Calculation
`POST /lifts/`
- **Description**: Calculates Wilks, DOTS, IPF GL, and Reshel coefficients.
- **Body**: `LiftRequest`
- **Persistence**: Auto-saves to the authenticated user's history if a token is present.

### History
`GET /lifts/`
- **Auth Required**: Yes
- **Result**: Chronologically sorted list of user calculations.

`DELETE /lifts/{lift_id}`
- **Auth Required**: Yes
- **Action**: Deletes a specific record by UUID.

`DELETE /lifts/`
- **Auth Required**: Yes
- **Action**: Wipes the entire history for the authenticated user.

### Batch Synchronization
`POST /lifts/sync`
- **Auth Required**: Yes
- **Use Case**: Merging anonymous local history into a user's account.
- **Body**: Array of `LiftResponse` objects.

---

## 3. Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| **401** | Unauthorized | Token is missing, expired, or invalid. |
| **422** | Unprocessable Entity | Request body validation failed (check data types). |
| **500** | Server Error | Internal service error or database connectivity issue. |

---

## 4. OpenAPI Explorer
Full interactive documentation is available during local development at:
`http://localhost:8000/docs`
