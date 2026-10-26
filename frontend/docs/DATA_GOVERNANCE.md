# Data Governance & Data Quality Management (DQM) Specification

## 1. Data Governance Protocols

### Role-Based Access Control (RBAC)
* **`STUDENT`**: Read-only access to own profile and published grades. Sensitive PII (SSN, phone, address) is masked under FERPA guidelines.
* **`FACULTY`**: Authorized to evaluate student enrollments and submit grades within valid boundaries (0.0 - 4.0). Cannot access unmasked government IDs.
* **`REGISTRAR` / `ADMIN`**: Complete institutional governance authority. Can review raw unmasked PII, approve identity verifications, and trigger automated DQM remediation.

### Immutable Forensic Audit Trail
Every update to student academic records (especially grade alterations) is recorded with:
* Acting User ID & Role
* Specific Enrollment / Record UUID
* Previous value vs. New value
* Precise UTC timestamp

---

## 2. Data Quality Management (DQM) Dimensions

1. **Completeness**: Ensures all critical attributes (Student Number, Full Name, Institutional Email, Department) are present.
2. **Validity**: Enforces syntax rules such as email RFC regex, institutional `.edu` domains, and grade boundaries `[0.0, 4.0]`.
3. **Consistency**: Normalizes capitalization across legacy systems (e.g. converting legacy uppercase names to standard Title Case).
4. **Uniqueness**: Guarantees no duplicate Student Numbers or primary key collisions.
