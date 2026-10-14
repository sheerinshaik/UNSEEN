# UNSEEN

> **Your voice matters. Your identity doesn't have to be public.**

**UNSEEN** is a privacy-first web application engineered for confidential problem reporting. It provides a protected workflow where authenticated or unauthenticated users can report uncomfortable experiences, unfair treatment, administrative inconveniences, and civic delays without unnecessarily exposing their personal identity to reviewers or higher-level authorities.

---

## Key Product Capabilities

- **Strong Identity Decoupling**: Submitter account details, emails, user IDs, and network metadata are structurally omitted from the `Report` document model.
- **Privacy-First Report Submission Flow**:
  1. *Category Selection*: Unfair treatment, Harassment, Administrative inconvenience, Public-service delay, Privacy concern, Other.
  2. *Narrative Problem Formulation*: Guided text prompt with real-time warnings against self-identification.
  3. *Privacy Review*: Interactive matrix detailing exactly what information will and will not be shared with reviewers.
  4. *Confirmation & One-Time Secret*: Issues a random, non-sequential reference (`UNS-XXXX-XXXX-XXXX`) and a high-entropy 192-bit tracking secret.
- **Dual-Layer Private Tracking**:
  - *Anonymous Secret-Based Tracking*: Secure lookup using reference + salted HMAC-SHA256 secret verification (possession of reference alone is rejected).
  - *Authenticated Private Vault*: Authenticated citizens can return to their dashboard to view their cases via an isolated `UserVault` collection, completely inaccessible to reviewers or administrators.
- **Reviewer Workspace**: Real-time computed metrics, queue management, status transition engine, and official response composer with zero submitter identity visibility.
- **Restricted Administration Center**: Staff reviewer provisioning, category taxonomy management, and sanitized security audit logs without user-to-report mapping tools.
- **Demonstration Scenarios & Selective Disclosure**:
  - Educational walkthroughs for student concerns and public-service delays with statutory disclaimers.
  - Interactive simulated attribute verification (Student enrollment, Age threshold $\ge 18$, Faculty affiliation) proving claims without revealing underlying personal documents.
- **100% Automated Test Coverage**: 15/15 comprehensive integration and privacy boundary tests passing.

---

## Visual Design System

Built with a restrained, cohesive palette appropriate for a privacy startup:
- **Deep ink navy**: `#172B36` (Primary headings and important text)
- **Forest teal**: `#176B63` (Primary actions and verified accents)
- **Soft mint**: `#DCEFE8` (Subtle highlights and pill badges)
- **Warm ivory**: `#FAF9F6` (App background surface)
- **Pure white**: `#FFFFFF` (Card surfaces and data tables)
- **Muted slate**: `#64727B` (Secondary text and metadata)
- **Subtle border**: `#E4E8E5` (Clean structural borders)
- **Warning amber**: `#986519` (Privacy warnings and action required)
- **Error red**: `#B54747` (Error alerts and denied states)

---

## Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System, React Router DOM, Lucide Icons.
- **Backend**: Node.js (v24), Express.js, Mongoose ODM, Zod Validation, Helmet, CORS, Rate Limiters, Cookie Parser.
- **Database**: MongoDB with strict collection isolation.
- **Security**: bcryptjs password hashing (cost factor 12), HMAC-SHA256 tracking secrets, HTTP-only SameSite session cookies.
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`) + Supertest for end-to-end API integration tests.

---

## Getting Started Locally

### Prerequisites
- Node.js >= 18.x (tested on v24.18)
- MongoDB instance running on `mongodb://127.0.0.1:27017`

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

### 3. Seed Demo Dataset
Initialize realistic synthetic demo accounts and reports across all categories:
```bash
npm run seed
```

### 4. Run Automated Test Suite
Execute the 15 security and privacy integration tests:
```bash
npm test
```
*Result: 15 passing suites in ~1.6s.*

### 5. Start Development Servers
Start both backend API (`:5000`) and Vite frontend (`:5173`):
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Demo Accounts for Evaluation

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Citizen (Submitter)** | `citizen.demo@example.com` | `CitizenDemo2026!` | `/dashboard` (My Reports Vault) |
| **Reviewer (Academic Ombuds)** | `ombuds@unseen.internal` | `ReviewerPass2026!` | `/reviewer` (Reviewer Workspace) |
| **Reviewer (Ethics)** | `ethics@unseen.internal` | `ReviewerPass2026!` | `/reviewer` (Reviewer Workspace) |
| **Administrator** | `admin@unseen.internal` | `AdminSecure2026!` | `/admin` (Governance & Staff Provisioning) |

### Sample Demo Tracking Credentials
- **Student Concern Report**:
  - Reference: `UNS-STUD-2026-A1B2`
  - Tracking Secret: `sec_demo_student_grade_dispute_948123`
- **Public-Service Delay Report**:
  - Reference: `UNS-PUBL-2026-D8E3`
  - Tracking Secret: `sec_demo_public_service_delay_771829`

---

## Automated Test Results

The test suite (`server/tests/api.test.js`) executes 15 automated security, privacy, and workflow assertions:
```
▶ UNSEEN Automated Security, Privacy, and Workflow Test Suite
  ✔ Requirement 1: Unauthenticated users cannot access protected APIs (4.2ms)
  ✔ Requirement 2: Users cannot access other users private reports (477.7ms)
  ✔ Requirement 3: Users cannot change report ownership through request manipulation (10.6ms)
  ✔ Requirement 4: Normal citizens cannot access reviewer or administrator endpoints (10.3ms)
  ✔ Requirement 5: Reviewers cannot retrieve submitter identity fields (5.3ms)
  ✔ Requirement 6: Administrators cannot map reports to submitters through app APIs (16.4ms)
  ✔ Requirement 7: Passwords are hashed and never returned (6.0ms)
  ✔ Requirement 8: Report references do not authorize private access by themselves (11.3ms)
  ✔ Requirement 9: Retrieval secrets are not stored in plaintext (1.6ms)
  ✔ Requirement 10: Status updates require correct permissions (13.7ms)
  ✔ Requirement 11: API responses do not expose unnecessary private fields (4.7ms)
  ✔ Requirement 12: Invalid requests are rejected (3.2ms)
  ✔ Requirement 13: Disclosure summary matches actual backend behavior (2.2ms)
  ✔ Requirement 14: Demo verification is clearly marked as simulated (2.3ms)
  ✔ Requirement 15: Health check endpoint accurately reports database status (2.1ms)
ℹ tests 15 | suites 1 | pass 15 | fail 0
```

---

## Detailed Documentation Directory

- **[System Architecture & Diagrams](docs/ARCHITECTURE.md)**: Component diagrams and sequence flows.
- **[Privacy Model & Disclosure Matrix](docs/PRIVACY_MODEL.md)**: Field visibility tables and privacy guarantees.
- **[Threat Model & Risk Analysis](docs/THREAT_MODEL.md)**: Threat actors, vectors, and residual risk disclosures.
- **[REST API Specification](docs/API.md)**: Complete endpoint, request, and response schemas.
- **[Production Deployment Guide](docs/DEPLOYMENT.md)**: Hosting configurations and smoke-test checklists.
- **[Jury & Presentation Guide](docs/JURY_PREPARATION.md)**: 30-second elevator pitch, live demo script, and defense Q&A.

---

## License

UNSEEN is licensed under the MIT License.
