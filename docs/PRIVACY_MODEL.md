# UNSEEN — Privacy Model & Information Sharing Disclosures

## 1. Information-Sharing Matrix

The table below describes the visibility of each data field across system roles:

| Data Element | Collected? | Visible to Submitter? | Visible to Reviewer? | Visible to Admin? | Stored Plaintext on Server? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Problem Narrative** | Yes | Yes | Yes | Yes | Yes |
| **Report Category** | Yes | Yes | Yes | Yes | Yes |
| **Optional Incident Date** | Yes (Optional) | Yes | Yes | Yes | Yes |
| **Optional Location/Dept** | Yes (Optional) | Yes | Yes | Yes | Yes |
| **Requested Resolution** | Yes (Optional) | Yes | Yes | Yes | Yes |
| **Public Report Reference** | Yes (Random) | Yes | Yes | Yes | Yes |
| **Private Tracking Secret** | Yes (Client only) | Yes (Once) | **NO** | **NO** | **NO (HMAC-SHA256 Hash Only)** |
| **Submitter Account Email** | For Auth Only | In Profile | **NO (Stripped)** | **NO (Omitted from Review)** | Yes (In Users collection) |
| **Submitter Password** | For Auth Only | Never | **NO** | **NO** | **NO (bcrypt hash only)** |
| **Submitter IP Address** | Transient TCP | Never | **NO** | **NO** | **NO (Not logged)** |
| **Report Timeline / Notes** | Yes | Yes | Yes | Yes | Yes |
| **Reviewer Responses** | Yes | Yes | Yes | Yes | Yes |

---

## 2. Privacy Guarantees

1. **Decoupled Identity Ingestion**:
   Submitting a report does not attach the submitter's user ID or email to the `Report` document.
2. **Access Control via Dual Secret**:
   Possession of the public report reference (`UNS-XXXX-XXXX-XXXX`) is insufficient to access private report status or reviewer responses. Callers must supply the matching 192-bit tracking secret.
3. **No Reviewer Cross-Referencing**:
   Reviewers have access only to case content, department context, timeline logs, and status update tools. They cannot view citizen user lists or join tables.
4. **No Routine Admin Submitter Mappings**:
   The admin interface deliberately lacks any endpoint or interface that connects report references to user accounts.
5. **Safe Logging**:
   Loggers automatically redact sensitive tokens (`password`, `token`, `secret`, `trackingSecret`, `cookie`, `authorization`).

---

## 3. Submitter Responsibilities

While the infrastructure decouples account records, submitters are advised:
- Avoid including personal names, mobile numbers, unique student IDs, or niche details in the narrative text that would allow a reviewer to deduce identity through context.
- Securely store the one-time tracking secret. UNSEEN cannot recover lost secrets for anonymous submissions.
