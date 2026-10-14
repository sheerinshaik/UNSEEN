# UNSEEN — Jury & Evaluation Guide

## 1. Executive Summary & 30-Second Pitch

> **"UNSEEN is a confidential problem reporting platform that bridges the gap between privacy and accountability. It allows employees, students, and citizens to speak up about unfair treatment, administrative bottlenecks, and harassment without unnecessarily exposing their personal identity to reviewers. Unlike naive forms that merely hide fields in the frontend, UNSEEN decouples identity at the database architecture level."**

---

## 2. 2-Minute Live Evaluation Script

1. **The Problem (Landing Page)**:
   - Navigate to `/`.
   - Point out the headline: *"Speak up about the problem. Keep your identity private."*
   - Highlight the Protected Flow architecture graphic illustrating how account identifiers are stripped at the ingestion boundary.
2. **The Reporting Flow (`/submit`)**:
   - Click **Report a concern**.
   - Step 1: Select `Unfair treatment`.
   - Step 2: Show the comfortable narrative box with prompt guidance and explicit self-identification warnings.
   - Step 3: Show the **Privacy Review** matrix comparing what is collected vs what reviewers can see.
   - Step 4: Show the generated reference (e.g., `UNS-STUD-2026-A1B2`) and the one-time high-entropy tracking secret.
3. **Private Tracking (`/track`)**:
   - Demonstrate that possessing the reference alone is rejected.
   - Provide the tracking secret to reveal status and official reviewer responses.
4. **Reviewer Perspective (`/reviewer`)**:
   - Log in as Reviewer (`ombuds@unseen.internal` / `ReviewerPass2026!`).
   - Inspect the incoming queue. Show that the reviewer can read the narrative and reply with official action notes, **while submitter email and account data are 100% absent**.
5. **Selective Disclosure Concept (`/selective-disclosure`)**:
   - Run the simulated attribute proof demo to show how an attribute (e.g. Enrolled Student = True) can be proven without sharing personal names or IDs.

---

## 3. Demo Credentials Reference

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Citizen (Submitter)** | `citizen.demo@example.com` | `CitizenDemo2026!` | Test citizen vault & private reports |
| **Reviewer (Ombuds)** | `ombuds@unseen.internal` | `ReviewerPass2026!` | Test reviewer queue & official replies |
| **Reviewer (Ethics)** | `ethics@unseen.internal` | `ReviewerPass2026!` | Test ethics committee view |
| **Administrator** | `admin@unseen.internal` | `AdminSecure2026!` | Test governance & reviewer provisioning |

*Sample Tracking Secret for Demo Report `UNS-STUD-2026-A1B2`:*
`sec_demo_student_grade_dispute_948123`

---

## 4. Tough Jury Questions & Defense Answers

### Q: "Is this platform 100% anonymous?"
> **Answer**: No system can honestly promise absolute anonymity against every physical and state-level threat. UNSEEN avoids deceptive marketing claims. We guarantee that **ordinary reviewers and administrators cannot access your account details through application interfaces**, and that report records in the database do not store your user ID or email. However, we explicitly warn submitters that if they write self-identifying details into their narrative text, reviewers can infer who they are.

### Q: "Can the database administrator link reports to users?"
> **Answer**: For users who submit anonymously using tracking secrets, no user linkage exists anywhere in the database. For authenticated users using the convenience vault, the linkage is stored in an isolated `UserVault` table. While a root database admin could theoretically examine raw database tables, the application enforces least privilege, separates database roles, and prevents any routine lookup feature.

### Q: "How does UNSEEN handle spam or malicious false reports?"
> **Answer**: Submissions are rate-limited on IP and session levels, input sizes are constrained with Zod schemas, and audit logs track rapid operational activity. Because authentication is separated from report content, institutions can require valid authenticated accounts to deter botnets without giving reviewers visibility into who submitted which ticket.
