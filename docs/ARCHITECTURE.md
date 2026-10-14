# UNSEEN — System Architecture & Component Design

## 1. System Overview

**UNSEEN** is a privacy-first web platform engineered for confidential problem reporting. It enables authenticated and unauthenticated individuals to report workplace bias, academic retaliation, administrative delays, and privacy concerns without exposing their personal identity to case reviewers or administrative staff.

The system is architected around the core principle: **Authentication $\neq$ Identity Disclosure**. While users can authenticate to manage their cases in a personal vault, their personal account attributes (such as email, user ID, and network metadata) are structurally decoupled from reports stored in the database.

---

## 2. Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Client Layer (React + Vite)"]
        UI_Citizen["Citizen / Student Interface\n(/submit, /track, /dashboard)"]
        UI_Reviewer["Reviewer Interface\n(/reviewer)"]
        UI_Admin["Administrator Interface\n(/admin)"]
        UI_Demo["Simulated Demos\n(/scenarios, /selective-disclosure)"]
    end

    subgraph Boundary ["Ingestion & Security Boundary"]
        CORS["Strict CORS & Helmet CSP"]
        RateLimit["Rate Limiters (Auth, Track, Submit)"]
        AuthMiddleware["Session & RBAC Middleware"]
        Sanitizer["Data Minimization & Validation (Zod)"]
    end

    subgraph Backend ["Server Layer (Express.js)"]
        AuthService["Authentication Service\n(bcryptjs + HTTP-Only Session Cookies)"]
        ReportService["Report Ingestion & Pseudonym Generator\n(Random Ref + High-Entropy Secret)"]
        ReviewerService["Reviewer Workflow & Timeline Engine"]
        AdminService["Governance & Audit Logger"]
    end

    subgraph DataIsolation ["Data Persistence Layer (MongoDB)"]
        Col_Reports["Reports Collection\n(Reference, Narrative, Status, Hash)\n*Zero submitter user IDs or emails*"]
        Col_Vault["UserVault Collection\n(UserId <-> ReportReference)\n*Accessible ONLY to citizen session*"]
        Col_Users["Users Collection\n(Staff Roles & Citizen Accounts)"]
        Col_Audit["AuditLog Collection\n(Sanitized security events without secrets)"]
    end

    UI_Citizen --> Boundary
    UI_Reviewer --> Boundary
    UI_Admin --> Boundary
    UI_Demo --> Boundary

    Boundary --> Backend

    ReportService --> Col_Reports
    ReportService --> Col_Vault
    AuthService --> Col_Users
    ReviewerService --> Col_Reports
    AdminService --> Col_Audit
```

---

## 3. Data Flow Diagram (Submission to Review)

```mermaid
sequenceDiagram
    autonumber
    actor Submitter as Submitter (Citizen/Student)
    participant Client as UNSEEN Web Client
    participant Server as UNSEEN API Server
    participant DB as MongoDB

    Submitter->>Client: 1. Draft narrative, select category, add optional context
    Submitter->>Client: 2. Inspect Information-Sharing Summary (Privacy Review)
    Submitter->>Client: 3. Click 'Confirm & Submit Report'
    Client->>Server: POST /api/reports/submit (with HTTP-only session cookie if logged in)

    Note over Server: Server strips account email, user ID, & IP hash.<br/>Generates non-sequential reference (UNS-XXXX-XXXX-XXXX)<br/>and 192-bit tracking secret.
    Server->>Server: Computes HMAC-SHA256(trackingSecret)
    Server->>DB: Saves Report (Reference, Narrative, Category, Hash)<br/>*No Submitter Identity*
    opt User is Authenticated
        Server->>DB: Saves UserVault link (UserId, ReportReference)<br/>*Isolated to Citizen Session*
    end
    Server-->>Client: Returns Reference + Plaintext Tracking Secret (ONCE)
    Client-->>Submitter: Displays Reference & Secret with mandatory copy warning

    Note over Submitter,DB: Case Review Phase
    actor Reviewer as Authorized Reviewer
    Reviewer->>Server: GET /api/reviewer/reports
    Server->>DB: Query Reports (excluding secrets & unassociated with users)
    DB-->>Server: Returns sanitized report list
    Server-->>Reviewer: Renders issue narrative, category, status<br/>*Submitter identity is structurally absent*
    Reviewer->>Server: POST /api/reviewer/reports/:ref/responses (Official Response)
    Server->>DB: Appends official reviewer response & timeline transition
```

---

## 4. Key Architectural Decisions

### 4.1 Strict Schema Isolation
- The `Report` Mongoose schema does **not** declare fields for `userId`, `email`, `submitterName`, or `ipAddress`.
- This ensures that accidental database projections or blanket `find()` queries can never expose submitter identity, as the data simply does not reside on the document.

### 4.2 High-Entropy Tracking Secrets
- Reports can be tracked anonymously via `POST /api/reports/track`.
- The server stores only the HMAC-SHA256 digest of the secret (`trackingSecretHash`).
- The plaintext secret is never logged, never returned in reviewer queries, and possession of the public reference code alone is strictly rejected with HTTP 400/401.

### 4.3 Authenticated Private Vault
- To allow users to view their submitted cases across sessions, authenticated submissions record an entry in `UserVault` (`userId`, `reportReference`).
- The `UserVault` collection is only queried by `GET /api/reports/my-reports` scoped to `req.user._id`.
- Reviewers and platform administrators have no routes, controllers, or database joins that touch `UserVault`.
