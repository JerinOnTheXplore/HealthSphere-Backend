# HealthSphere Backend

HealthSphere is a **comprehensive healthcare management system backend** built with Node.js, TypeScript, and PostgreSQL. It enables **secure patient data management, appointment scheduling, payments, prescriptions, and reviews** via a RESTful API.

## Features
- Multi-role authentication & authorization (SUPER_ADMIN, ADMIN, DOCTOR, PATIENT)
- Appointment lifecycle management
- Stripe payment integration
- Medical record & document management (AWS S3)
- Prescription generation & analytics
- Patient & doctor reviews with statistics
- Real-time scheduling & availability
- Audit logging & security compliance (PHI, PCI DSS)
- Performance optimization via Redis caching

## Technology Stack
- **Runtime:** Node.js 20.x LTS
- **Framework:** Express.js
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16.x
- **ORM:** Prisma 7.x
- **Cache:** Redis
- **Authentication:** Better Auth (JWT + sessions)
- **Payments:** Stripe
- **Storage:** AWS S3
- **Logging:** Winston
- **Validation:** Zod

## Project Structure

HealthSphere-Backend/
├── src/
│   ├── app.ts                   # Express app setup
│   ├── server.ts                # Server entry point
│   ├── config/
│   │   ├── database.ts          # Prisma client
│   │   ├── redis.ts             # Redis client
│   │   ├── auth.ts              # Auth config
│   │   ├── stripe.ts            # Stripe config
│   │   └── logger.ts            # Winston config
│   ├── modules/
│   │   ├── auth/                # Registration, login, password reset
│   │   ├── admin/               # Admin operations
│   │   ├── doctor/              # Doctor operations
│   │   ├── patient/             # Patient operations
│   │   ├── specialty/           # Doctor specialties
│   │   ├── schedule/            # Availability & scheduling
│   │   ├── appointment/         # Appointment lifecycle
│   │   ├── payment/             # Stripe integration
│   │   ├── prescription/        # Prescription management
│   │   └── review/              # Patient & doctor reviews
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   ├── asyncHandler.ts
│   │   └── fileUpload.ts
│   ├── types/
│   │   └── express.d.ts
│   └── constants/
│       ├── roles.ts
│       └── httpStatus.ts
├── prisma/
│   ├── schema/                  # Multi-file Prisma schema
│   └── seed.ts                  # Seed script
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── uploads/
├── .env.example
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md

## Getting Started
1. Clone repo  
```bash
git clone https://github.com/your-username/HealthSphere-Backend.git
Install dependencies

pnpm install
Configure .env file

Run migrations & seed data

pnpm prisma migrate dev
pnpm ts-node prisma/seed.ts
Start server

pnpm dev
API Documentation
Swagger/OpenAPI available at /api/docs

Follows RESTful conventions

Consistent JSON responses

Testing
Unit tests: Jest

Integration tests: Supertest + Jest

E2E tests for critical flows

Coverage target: >80% for unit, >70% integration

License
MIT


---

## **3️⃣ Resume Bullet Points (Recruiter-Friendly)**

- Developed **HealthSphere**, a production-grade healthcare backend using **Node.js, TypeScript, Express, PostgreSQL, and Prisma**, supporting multi-role authentication and secure patient data management.  
- Implemented **appointment scheduling, payments (Stripe), prescription management, and review analytics**, ensuring **compliance with PHI and PCI DSS standards**.  
