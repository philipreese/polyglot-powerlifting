# API Guide & Integration

The Polyglot Powerlifting API is a high-performance FastAPI service designed to provide coefficient calculations and persistent history management.

## 1. Authentication Lifecycle

The API uses **Supabase Auth** (GoTrue) for user management. Clients must provide a valid JSON Web Token (JWT) in the `Authorization` header.

### The Flow
1. **Frontend**: Signs in via the Supabase Client SDK.
2. **Supabase**: Returns an `access_token` (JWT).
3. **Frontend**: Attaches the token as a Bearer header.
4. **Backend**: Receives the token and verifies it with the Supabase project.

```http
Authorization: Bearer <your_jwt_token_here>
```

> [!NOTE]
> If a request is sent without a token, the `/lifts` POST endpoint will still calculate results but will **not** persist them to the database.

---

## 2. Core Endpoints

### Calculation & Persistence
`POST /lifts/`
- **Body**: `LiftRequest` (bodyweight, gender, equipment, lifts)
- **Result**: `LiftResponse` (includes all 4 coefficients: Wilks, DOTS, IPF GL, Reshel)
- **Persistence**: Auto-saves to the authenticated user's history if a token is present.

### History Management
`GET /lifts/`
- **Requires Auth**: Yes
- **Result**: A chronologically sorted list of the user's past calculations.

`DELETE /lifts/{lift_id}`
- **Requires Auth**: Yes
- **Action**: Deletes a specific record by its unique UUID.

`DELETE /lifts/`
- **Requires Auth**: Yes
- **Action**: Wipes the entire history for the authenticated user.

### Batch Synchronization
`POST /lifts/sync`
- **Requires Auth**: Yes
- **Use Case**: Used to merge "Anonymous Local History" into a user's account after they sign up or log in.
- **Body**: Array of `LiftResponse` objects.

---

## 3. Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| **401** | Unauthorized | Bearer token is missing, expired, or invalid. |
| **422** | Unprocessable Entity | Request body validation failed (check data types). |
| **500** | Server Error | Backend cannot reach Supabase or database is misconfigured. |

---

## 4. Documentation Explorer
When running the backend locally, you can explore the full OpenAPI specification and test endpoints interactively at:
`http://localhost:8000/docs`
