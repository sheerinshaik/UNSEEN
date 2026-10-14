# UNSEEN — Threat Model & Security Analysis

## 1. Scope & Assets

### Protected Assets:
1. **Submitter Identity**: Shielding the identity of whistleblowers, students, and citizens from reviewers and department heads.
2. **Report Confidentiality**: Preventing unauthorized third parties from viewing private problem descriptions and official responses.
3. **Session Credentials**: Guarding passwords, JWT session tokens, and tracking secrets against theft or brute-force enumeration.
4. **Audit Integrity**: Preserving tamper-evident logs of administrative and reviewer actions.

---

## 2. Threat Actors & Threat Scenarios

| Threat Actor | Motivation | Capability | Mitigation Implemented in UNSEEN |
| :--- | :--- | :--- | :--- |
| **Retaliatory Reviewer** | Identify who filed a complaint against them or their faculty. | Full read/write access to `/api/reviewer/*` endpoints. | Submitter account IDs and emails are omitted from `Report` records. Reviewers query exclusively sanitized projections. |
| **Curious Administrator** | Attempt to link report references to registered citizen emails. | Access to `/api/admin/*` endpoints. | Admin center has zero report-to-submitter mapping tools. Citizen account listings are omitted from admin views. |
| **Malicious Web Attacker** | Brute force report references or forge ownership. | Network requests, parameter manipulation, session hijacking. | Non-sequential 32-character base32 references; 192-bit tracking secrets; strict rate limiting on `/api/reports/track`; HTTP-only SameSite cookies. |
| **Network Eavesdropper** | Intercept credentials or report content in transit. | Passive packet inspection on local networks or Wi-Fi. | Enforced HTTPS in production; secure cookie flags; TLS termination at reverse proxy. |

---

## 3. Residual Risks & Technical Limitations

As mandated by UNSEEN's engineering standards, we state residual risks honestly:

1. **Narrative Self-Disclosure**:
   - Automated NLP cannot guarantee detection of all self-identifying context (e.g., "I was the only student who took the test on Tuesday").
   - *Mitigation*: Multi-step user prompts and explicit warning banners during step 2.
2. **Timing Correlation**:
   - An adversary observing physical presence (e.g., someone typing on a phone immediately following an argument) could attempt to correlate timestamps.
   - *Mitigation*: Reviewers see general dates; submitters can specify approximate periods rather than minute-level timestamps.
3. **Compromised Host / Physical Server Attack**:
   - If root infrastructure (operating system memory or hypervisor) is compromised, memory scrapers could intercept unencrypted network payloads before processing.
   - *Mitigation*: Least-privilege production containers, hardened Docker runtime, separation of database credentials.
