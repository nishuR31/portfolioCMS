# Portfolio CMS API Documentation


## Portfolio Endpoints (`/portfolio`)

### Public (no auth)
| Method | Path | Description |
|--------|------|-------------|
| **GET** | `/portfolio/user/:userId` | Full portfolio (profile, education, experience, projects, …). |
| **GET** | `/portfolio/user/:userId/profile` | Basic profile information. |
| **GET** | `/portfolio/user/:userId/education` | List of education entries. |
| **GET** | `/portfolio/user/:userId/experience` | List of experience entries. |
| **GET** | `/portfolio/user/:userId/projects` | List of project entries. |
| **GET** | `/portfolio/user/:userId/hackathons` | List of hackathon entries. |
| **GET** | `/portfolio/user/:userId/skills` | List of skill entries. |
| **GET** | `/portfolio/user/:userId/certifications` | List of certification entries. |
| **GET** | `/portfolio/user/:userId/achievements` | List of achievement entries. |

### Auth‑required (write)
| Method | Path | Request body (JSON) | Response | Purpose |
|--------|------|----------------------|----------|---------|
| **PUT** | `/portfolio/profile` | Profile fields (fullName, headline, bio, …) | Updated profile | Create / update own profile. |
| **POST** | `/portfolio/education` | Education fields (school, degree, startDate, endDate, …) | New education record | Add education entry. |
| **PUT** | `/portfolio/education/:id` | Same fields (all optional) | Updated record | Edit a specific education entry. |
| **DELETE** | `/portfolio/education/:id` | – | – | Remove education entry. |
| **POST** | `/portfolio/experience` | Experience fields (company, role, startDate, endDate, …) | New experience record | Add experience. |
| **PUT** | `/portfolio/experience/:id` | Same fields | Updated record | Edit experience. |
| **DELETE** | `/portfolio/experience/:id` | – | – | Delete experience. |
| **POST** | `/portfolio/projects` | Project fields (title, description, techStack, link, …) | New project | Add project. |
| **PUT** | `/portfolio/projects/:id` | Same fields | Updated project | Edit project. |
| **DELETE** | `/portfolio/projects/:id` | – | – | Delete project. |
| **POST** | `/portfolio/hackathons` | Hackathon fields (name, teamSize, award, …) | New hackathon | Add hackathon. |
| **PUT** | `/portfolio/hackathons/:id` | Same fields | Updated hackathon | Edit hackathon. |
| **DELETE** | `/portfolio/hackathons/:id` | – | – | Delete hackathon. |
| **POST** | `/portfolio/skills` | `{ "name":"string","category":"string","proficiency":"BEGINNER|INTERMEDIATE|ADVANCED|EXPERT","iconUrl?":"string" }` | New skill | Add skill. |
| **PUT** | `/portfolio/skills/:id` | Same fields | Updated skill | Edit skill. |
| **DELETE** | `/portfolio/skills/:id` | – | – | Delete skill. |
| **POST** | `/portfolio/certifications` | Certification fields (title, issuer, issueDate, …) | New certification | Add certification. |
| **PUT** | `/portfolio/certifications/:id` | Same fields | Updated certification | Edit certification. |
| **DELETE** | `/portfolio/certifications/:id` | – | – | Delete certification. |
| **POST** | `/portfolio/achievements` | Achievement fields (title, description, date, …) | New achievement | Add achievement. |
| **PUT** | `/portfolio/achievements/:id` | Same fields | Updated achievement | Edit achievement. |
| **DELETE** | `/portfolio/achievements/:id` | – | – | Delete achievement. |

---

## 3️⃣ Admin Routes (`/admin`)

### Delete‑All Flow (admin‑only)
| Method | Path | Auth? | Request body | Response | Description |
|--------|------|-------|--------------|----------|-------------|
| **GET** | `/admin/delete-all/request` | ✓ (any logged‑in user) | – | `{ success:true, message:"Delete‑all OTP sent to admin" }` | Generates a 6‑digit OTP and a 12‑char extra password, stores them in memory (10 min TTL), and emails both to the admin (`SMTP_USER`). |
| **POST** | `/admin/delete-all/confirm` | ✓ | `{ "otp":"string", "password":"string" }` | `{ success:true, message:"All data deleted successfully" }` | Validates OTP + password, calls `UserRepository.deleteAll()`, then clears stored tokens. |

---

## 4️⃣ Common Types (reference)
```ts
// JWT payload
type JwtPayload = {
  id: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
};

// Standard API envelope
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
```

---

## 5️⃣ Error Handling
| HTTP | Error class | When triggered |
|------|-------------|-----------------|
| **400** | `ValidationError` | Bad request payload or missing required fields. |
| **401** | `UnauthorizedError` | Missing/invalid token, expired token, or failed OTP/password verification. |
| **403** | `ForbiddenError` | Authenticated but lacks permission (e.g., trying to delete another user’s data). |
| **404** | `NotFoundError` | Requested resource not found (invalid ID). |
| **409** | `ConflictError` | Duplicate resource (e.g., registering an already‑used email). |
| **500** | `InternalServerError` | Unexpected server error (stack trace logged). |

All errors are wrapped in the same envelope:
```json
{
  "success": false,
  "message": "Human readable error",
  "errors": {
    "name": "ErrorClassName",
    "details": {},
    "stack": "stack trace"
  }
}
```
---

## 6️⃣ How to Use the API (frontend helper)
The project already ships a tiny wrapper (`frontend/src/services/api.js`). Example usage:
```js
import { api } from "./api";

// login & store user in memory
await api.auth.login({ email, password });

// after a page refresh, re‑hydrate the session
await api.auth.me(); // populates internal _user variable

// fetch current user anywhere
const currentUser = api.auth.getCurrentUser();

// call a protected endpoint
const portfolio = await api.portfolio.getFull(currentUser.id);
```
The wrapper automatically adds `credentials: "include"` so cookies are sent, and on a 401 it will call `silentRefresh()` to rotate the token before re‑trying the request.

---

*End of documentation.*
