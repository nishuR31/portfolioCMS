# Authentication API Documentation (Backend)

## Base URL
```
http://localhost:3000/api/v1
```

---
### 1. Register
**Endpoint**: `POST /auth/register`
**Payload**:
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "name": "John Doe"
}
```
**Success Response (201)**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "<uuid>",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-06-06T...Z"
    }
  }
}
```
**Error Responses**:
- `400 Bad Request` – validation errors (e.g., missing fields).
- `409 Conflict` – user already exists.
- `500 Internal Server Error` – Prisma failure (as observed when backend returned:
```json
{"success":false,"message":"[Prisma Failure]: Failed creation user due to server error.","errors":{...}}
```).

---
### 2. Login
**Endpoint**: `POST /auth/login`
**Payload**:
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```
**Success Response (200)** – Sets `accessToken` & `refreshToken` as **httpOnly** cookies (path `/`, `secure` true in production, `sameSite` `none`). Returns user data:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {"id":"<uuid>","email":"user@example.com","name":"John Doe"}
  }
}
```
**Error Responses**:
- `401 Unauthorized` – invalid credentials.
- `500 Internal Server Error` – unexpected failures.

---
### 3. Refresh Token
**Endpoint**: `POST /auth/refresh-token`
**Payload** (optional if cookie present):
```json
{ "refreshToken": "<token>" }
```
**Success Response (200)** – Rotates tokens, sets new `refreshToken` cookie, returns:
```json
{
  "status": "success",
  "message": "Token refreshed",
  "data": {"accessToken": "<new-token>"}
}
```
**Error Responses**:
- `401 Unauthorized` – missing/invalid refresh token.
- `400 Bad Request` – malformed request.

---
### 4. Me (Current User)
**Endpoint**: `GET /auth/me`
**Protection**: Requires authentication – `accessToken` (httpOnly cookie) or `Authorization: Bearer <token>` header. Middleware now checks both `accessToken` and `refreshToken` cookies.
**Success Response (200)**:
```json
{
  "status": "success",
  "message": "User fetched successfully",
  "data": {
    "id": "<uuid>",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-06-06T...Z"
    // password, refreshToken, totpSecret are omitted for safety
  }
}
```
**Error Responses**:
- `401 Unauthorized` – no valid token.
- `404 Not Found` – user not found (unlikely if token valid).

---
### 5. Logout
**Endpoint**: `POST /auth/logout`
**Success Response (200)** – Clears cookies:
```json
{"status":"success","message":"Logged out"}
```

---
## Common Error Shape
All error responses follow this structure:
```json
{
  "status": "error",
  "message": "<human readable description>",
  "error": {
    "name": "<ErrorClass>",
    "details": { ... }
  }
}
```
Typical `name` values: `ValidationError`, `NotFoundError`, `ConflictError`, `InternalServerError`.

---
## Testing Notes
- Register a new user, then immediately call **/auth/me** – should return the created user without password or secret fields.
- After login, subsequent CRUD calls (e.g., portfolio upserts) succeed because the `accessToken` cookie is sent automatically (`credentials: "include"` on frontend).
- If cookies are missing or `secure` flag blocks HTTP, the frontend will receive `401` and trigger `auth-expired` handling.

---
*Generated on 2026‑06‑06 based on current backend implementation.*
