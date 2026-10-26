# Unified Student Lifecycle System Architecture

This full-stack system exemplifies **Enterprise Data Management (EDM)** in Higher Education, strictly enforcing **Data Governance** and **Data Quality Management (DQM)**.

## Project Structure Overview

```
client/
├── app/                  # Next.js App Router (Layouts, Pages)
├── components/           # Modular React Components (GradeUpdateForm, etc.)
├── constants/            # Institutional Constants & Roles
├── context/              # Authentication & Role Switcher Context
├── docs/                 # Architectural & Governance Documentation
├── lib/                  # Utilities & Helpers
├── public/               # Public Static Assets
├── services/             # Backend API Clients (Fetch with JWT)
├── styles/               # Tailwind CSS & Global Styles
├── components.json       # Shadcn UI Schema
├── eslint.config.mjs     # ESLint Flat Config
├── next.config.ts        # Next.js Config with Backend Proxy
├── postcss.config.mjs    # PostCSS Config
├── proxy.ts              # API Proxy Helper
└── tsconfig.json         # TypeScript Configuration
```

## Backend Structure Overview

```
server/
├── src/
│   ├── config/           # Port, JWT Secret, Environment
│   ├── constants/        # Roles (STUDENT, FACULTY, REGISTRAR), DQM Config
│   ├── controllers/      # Express Route Handlers
│   ├── exceptions/       # Custom Error Classes (AppError, DataQualityError)
│   ├── lib/              # Database Client & Seed Data
│   ├── middlewares/      # RBAC Auth & Global Error Handling
│   ├── repositories/     # Data Access Layer
│   ├── routes/           # RESTful Routers
│   ├── schemas/          # Zod Validation Schemas
│   ├── services/         # Business Logic, PII Masking, Audit Logging
│   ├── utils/            # FERPA PII Masking & Formatters
│   ├── workers/          # Background DQM Scanner
│   ├── app.ts            # Express Application Setup
│   └── server.ts         # Server Entry Point
└── tests/                # Automated Governance & DQM Tests
```
