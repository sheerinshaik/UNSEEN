# UNSEEN — REST API Specification

All API endpoints reside under `/api`. Standard responses follow:
```json
{
  "success": true,
  "data": { ... }
}
```
In case of errors:
```json
{
  "success": false,
  "error": "Error description",
  "details": [ ... ]
}
```

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
- **Rate Limit**: 20 requests / 15 mins.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: `201 Created` with user profile. Sets HTTP-only `unseen_session` cookie.

### `POST /api/auth/login`
- **Rate Limit**: 20 requests / 15 mins.
- **Request Body**: `{ "email": "user@example.com", "password": "Password123!" }`
- **Response**: `200 OK`. Sets HTTP-only `unseen_session` cookie.

### `POST /api/auth/logout`
- **Response**: `200 OK`. Clears `unseen_session` cookie.

### `GET /api/auth/me`
- **Response**: `200 OK`. Returns `{ "authenticated": true, "user": { "id", "email", "role", "department" } }`

---

## 2. Reports (`/api/reports`)

### `GET /api/reports/categories`
- Returns active category list and submission text prompts.

### `GET /api/reports/disclosure-summary`
- Returns explicit information-sharing matrix.

### `POST /api/reports/submit`
- **Rate Limit**: 20 / hour.
- **Headers**: Optional session cookie.
- **Request Body**:
  ```json
  {
    "category": "Unfair treatment",
    "description": "Narrative of the issue...",
    "incidentDate": "October 2026",
    "departmentOrLocation": "Engineering Lab 304",
    "requestedResolution": "Independent rubric evaluation"
  }
  ```
- **Response**: `201 Created` with non-sequential reference and one-time plaintext tracking secret.

### `POST /api/reports/track`
- **Rate Limit**: 30 / 15 mins.
- **Request Body**:
  ```json
  {
    "reference": "UNS-STUD-2026-A1B2",
    "trackingSecret": "sec_demo_student_grade_dispute_948123"
  }
  ```
- **Response**: `200 OK` with report details, timeline, and reviewer responses.

### `GET /api/reports/my-reports`
- **Auth Required**: `citizen`, `reviewer`, `admin`
- Returns user's own reports stored in `UserVault`.

---

## 3. Reviewer Workflow (`/api/reviewer`)
*Requires Role: `reviewer` or `admin`*

### `GET /api/reviewer/overview`
- Returns database-aggregated case counts and category statistics.

### `GET /api/reviewer/reports`
- Returns paginated reports with search and filter parameters (`?status=Submitted&search=lab`).

### `GET /api/reviewer/reports/:reference`
- Returns individual report details (with zero submitter account data).

### `PATCH /api/reviewer/reports/:reference/status`
- **Request Body**: `{ "status": "Under review", "note": "Assigned to committee" }`

### `POST /api/reviewer/reports/:reference/responses`
- **Request Body**: `{ "message": "Official statement...", "roleLabel": "Academic Ombudsperson" }`

---

## 4. Administration (`/api/admin`)
*Requires Role: `admin`*

### `GET /api/admin/overview`
- System-wide user and audit event metrics.

### `GET /api/admin/reviewers`
- Lists staff reviewer accounts.

### `POST /api/admin/reviewers`
- Provisions a new staff reviewer account with department tag.

### `PATCH /api/admin/reviewers/:id/toggle-status`
- Activates/deactivates reviewer access.

### `GET /api/admin/audit-logs`
- Paginated security audit event stream.

### `GET /api/admin/categories` & `PUT /api/admin/categories`
- View and update dynamic reporting categories.

---

## 5. Demos & Health (`/api/demo`, `/api/health`)

### `GET /api/demo/scenarios`
- Returns student and public-service walkthrough data with statutory disclaimer.

### `POST /api/demo/selective-disclosure`
- Evaluates synthetic attribute verification assertions.

### `GET /api/health`
- Unauthenticated health check returning database status and uptime without secret leakage.
