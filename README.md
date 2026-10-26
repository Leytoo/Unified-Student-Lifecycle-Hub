# EduGovHub — University Enterprise Data Management (EDM) Hub
### Data Governance & Data Quality Management (DQM) System

A full-stack, enterprise-grade educational web application demonstrating **Enterprise Data Management (EDM)** across higher education silos, featuring **Extract-Transform-Load (ETL)** pipelines, **FERPA PII masking**, **Role-Based Access Control (RBAC)**, **Data Quality Management (DQM)**, and an **Immutable Compliance Audit Trail**.

---

## 🏛️ System Architecture

- **Backend**: Express + TypeScript (`backend/`)
  - RESTful APIs for ETL orchestration, DQM validation, FERPA governance rules, Master Student 360 records, and audit logging.
  - Mock Siloed Source Systems:
    - **Registrar SIS**: Biographical data, program codes, enrollment status.
    - **LMS (Canvas/Moodle)**: Course attendance, assignment averages, exam marks.
    - **Library & Finance**: Library loan counts, overdue fines, and graduation clearances.
- **Frontend**: React + Vite + TypeScript + Tailwind CSS (`frontend/`)
  - **Architecture & Overview**: 3-tier topological model matching the lecture slides.
  - **ETL Integration Engine**: Interactive batch ETL runner (Extract • Transform • Load) with step-by-step logs and raw silo comparison.
  - **Data Quality Workbench (DQM)**: 4 Quality Dimensions (Completeness, Validity, Consistency, Uniqueness) with single-click auto-remediation.
  - **Unified Student 360**: Golden Master records featuring dynamic FERPA PII masking (SSN, Phone) depending on the active simulated role.
  - **Data Governance Framework**: Regulatory policy catalog (FERPA, GDPR) and Data Stewardship matrix.
  - **Immutable Compliance Audit Trail**: Forensic activity log with filtering and JSON export capability.

---

## 🚀 Quick Start Guide

### 1. Run in Production Mode (Unified Single Port)
```bash
# Build both frontend and backend
npm run install:all
npm --prefix frontend run build
npm --prefix backend run build

# Start the unified server on port 5000 (serves both React and Express API)
npm --prefix backend start
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

### 2. Run in Development Mode (Live Hot Reloading)
```bash
# Terminal 1: Express + TypeScript backend (Port 5000)
npm run dev:backend

# Terminal 2: React + Vite frontend (Port 3000)
npm run dev:frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎓 The 5 Educational Topics Covered

1. **Enterprise Data Integration (ETL)**: Resolving the real-world `"Juan Dela Cruz"` identity mismatch across disparate systems into a canonical master record.
2. **Data Quality Management (DQM)**: Validating syntax (email RFC regex, phone formats) and detecting anomalies and duplicate student IDs.
3. **Data Governance & Policies**: Enforcing FERPA and GDPR rights to rectification and ownership segregation.
4. **Security & Role Responsibility**: Simulating real roles (`DPO_ADMIN`, `DATA_STEWARD`, `FACULTY_ADVISOR`, `STUDENT_VIEWER`) with automatic least-privilege enforcement and PII masking.
5. **Unified Insights & Master Data Warehouse**: Generating actionable composite student metrics (GPA, attendance percentile, graduation clearances, and DQM health scores).
