# ProcessX - Technical Architecture

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod (recommended)
- **State Management**:
  - React Context for global state
  - TanStack Query (React Query) for server state
  - Zustand (optional for complex client state)

### Backend
- **API**: Next.js API Routes (App Router)
- **Authentication**:
  - Option 1: NextAuth.js v5 (Auth.js)
  - Option 2: Clerk
  - Option 3: Supabase Auth
- **Database**: PostgreSQL 15+
- **ORM**:
  - Option 1: Prisma
  - Option 2: Drizzle ORM
- **File Storage**:
  - Option 1: AWS S3
  - Option 2: Cloudinary
  - Option 3: Supabase Storage

### Infrastructure
- **Hosting**: Vercel (recommended for Next.js)
- **Database Hosting**:
  - Option 1: Vercel Postgres
  - Option 2: Supabase
  - Option 3: Railway
  - Option 4: Neon
- **Email Service**:
  - Option 1: Resend
  - Option 2: SendGrid
  - Option 3: AWS SES
- **Environment**: Node.js 20+

### DevOps & Quality
- **Version Control**: Git
- **CI/CD**: GitHub Actions / Vercel
- **Testing**:
  - Jest + React Testing Library (unit/integration)
  - Playwright (E2E)
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

---

## Architecture Patterns

### 1. Monolithic Next.js Application
```
/tax-calculator
├── /src
│   ├── /app                    # Next.js App Router
│   │   ├── /api               # API routes
│   │   ├── /(auth)            # Auth routes
│   │   ├── /(dashboard)       # Protected dashboard routes
│   │   ├── /(public)          # Public routes (tax calculators)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── /components
│   │   ├── /ui                # Reusable UI components
│   │   ├── /forms             # Form components
│   │   ├── /layout            # Layout components
│   │   └── /features          # Feature-specific components
│   ├── /lib
│   │   ├── /db                # Database client & queries
│   │   ├── /auth              # Auth utilities
│   │   ├── /utils             # Helper functions
│   │   └── /validations       # Zod schemas
│   ├── /types                 # TypeScript types
│   ├── /hooks                 # Custom React hooks
│   └── /services              # Business logic services
├── /prisma (or /drizzle)
│   ├── schema.prisma
│   └── migrations
├── /public
├── /docs
├── package.json
└── next.config.js
```

### 2. Multi-Tenant Architecture
- **Tenant Isolation**: Company ID in all database queries
- **Row-Level Security**: Enforce via ORM/database constraints
- **Data Partitioning**: Logical separation per company
- **Shared Database**: Single database with company_id foreign keys

### 3. Authentication Flow
```
User Registration
├── Email/Password signup
├── Email verification sent
├── User confirms email
├── Redirect to company setup
└── Create first company (user becomes owner)

User Login
├── Email/Password authentication
├── Session created
├── Load user's companies
├── Redirect to default company dashboard
└── (Optional) Select different company if multiple
```

### 4. Authorization Model (RBAC)
```
Permissions by Role:

Owner
├── Full company access
├── Manage all team members
├── Delete company
├── Manage billing
└── All admin permissions

Admin
├── Manage team (except owners)
├── All financial operations
├── View/edit all records
└── Generate reports

Accountant
├── View all financial records
├── Add/edit expenses & income
├── Generate reports
└── Cannot manage team

Viewer
├── Read-only access
├── View dashboards
├── View reports
└── No editing permissions
```

### 5. API Structure
```
/api
├── /auth
│   ├── /register          POST
│   ├── /login             POST
│   ├── /logout            POST
│   ├── /verify-email      GET
│   └── /reset-password    POST
├── /companies
│   ├── /route.ts          GET (list), POST (create)
│   └── /[id]
│       ├── /route.ts      GET, PUT, DELETE
│       ├── /members       GET, POST
│       └── /settings      GET, PUT
├── /expenses
│   ├── /route.ts          GET (list), POST (create)
│   └── /[id]
│       ├── /route.ts      GET, PUT, DELETE
│       └── /attachments   POST, DELETE
├── /categories
│   ├── /route.ts          GET, POST
│   └── /[id]/route.ts     PUT, DELETE
├── /income
│   ├── /route.ts          GET, POST
│   └── /[id]/route.ts     GET, PUT, DELETE
├── /clients
│   ├── /route.ts          GET, POST
│   └── /[id]/route.ts     GET, PUT, DELETE
├── /invoices
│   ├── /route.ts          GET, POST
│   └── /[id]
│       ├── /route.ts      GET, PUT, DELETE
│       ├── /send          POST
│       └── /pdf           GET
├── /reports
│   ├── /expenses          GET
│   ├── /income            GET
│   ├── /profit-loss       GET
│   └── /tax-summary       GET
└── /team
    ├── /invite            POST
    ├── /invitations       GET
    └── /members
        ├── /route.ts      GET
        └── /[id]
            ├── /route.ts  PUT, DELETE
            └── /role      PUT
```

---

## Data Flow

### 1. Request Flow
```
Client Request
  ↓
Next.js Middleware (auth check)
  ↓
API Route Handler
  ↓
Validate Request (Zod)
  ↓
Check Permissions (RBAC)
  ↓
Service Layer (business logic)
  ↓
Database Query (Prisma/Drizzle)
  ↓
Response Formatting
  ↓
Client Response
```

### 2. Page Rendering Strategy
- **Public Pages** (tax calculators): Static or ISR
- **Auth Pages**: Client-side rendered
- **Dashboard Pages**: Server-side rendered with auth
- **Reports**: Server-side rendered for SEO

### 3. State Management Strategy
```
Server State (TanStack Query)
├── Expenses list
├── Income records
├── Company data
├── Team members
└── Reports data

Client State (React Context/Zustand)
├── Current company selection
├── User preferences
├── UI state (modals, filters)
└── Form state (React Hook Form)

Session State (Auth Provider)
├── Current user
├── Authentication status
└── User permissions
```

---

## Security Architecture

### 1. Authentication Security
- Password hashing: bcrypt (cost factor 12)
- Session tokens: JWT or secure session cookies
- Token expiration: 7 days (refresh needed)
- Email verification required
- Password reset tokens: Single-use, expire in 1 hour

### 2. Authorization Security
- Row-level security via company_id filtering
- Permission checks on every API route
- Frontend route protection with middleware
- API rate limiting
- CSRF protection

### 3. Data Security
- SQL injection prevention via ORM
- XSS prevention via React escaping
- Input validation via Zod schemas
- File upload restrictions (type, size)
- Secure file URLs (signed URLs for receipts)

### 4. Privacy & Compliance
- GDPR compliance (data export, deletion)
- Audit logging for all critical operations
- Encrypted data at rest (database level)
- HTTPS only (enforced)
- Regular security audits

---

## Performance Optimization

### 1. Database
- Proper indexing on all foreign keys
- Query optimization (select only needed fields)
- Connection pooling
- Pagination for large datasets
- Caching frequently accessed data

### 2. Frontend
- Code splitting by route
- Image optimization (Next.js Image)
- Lazy loading components
- Memoization (React.memo, useMemo)
- Virtual scrolling for long lists

### 3. API
- Response caching where applicable
- Debounced search requests
- Batch API requests
- Optimistic UI updates

---

## Scalability Considerations

### Short-term (MVP)
- Single region deployment
- Shared database
- Basic caching
- CDN for static assets

### Medium-term
- Database read replicas
- Redis for caching
- Background job processing
- Separate file storage

### Long-term
- Multi-region deployment
- Database sharding by company_id
- Microservices for heavy operations
- Real-time features (WebSockets)

---

## Monitoring & Observability

### 1. Logging
- Application logs (Winston/Pino)
- API request/response logs
- Error tracking (Sentry)
- Audit logs in database

### 2. Metrics
- API response times
- Database query performance
- User activity metrics
- Error rates
- Uptime monitoring

### 3. Analytics
- User behavior (PostHog/Mixpanel)
- Feature usage
- Conversion funnels
- Retention metrics

---

## Development Workflow

### 1. Local Development
```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Seed database
pnpm db:seed

# Run development server
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### 2. Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# File Storage
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Email
RESEND_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Git Workflow
- Feature branches from `main`
- Pull requests with review required
- Automated tests on PR
- Conventional commits
- Semantic versioning

---

## Migration Strategy

### Phase 1: Keep Existing Tax Calculators
- Move tax calculators to `/calculators` route
- No auth required for calculators
- Keep as standalone tools
- Link from dashboard

### Phase 2: Auth & Company Setup
- Add authentication system
- Create company onboarding flow
- Dashboard skeleton

### Phase 3: Expense Management
- Build expense CRUD
- Category management
- Receipt uploads
- Basic reporting

### Phase 4: Advanced Features
- Income tracking
- Invoicing
- Advanced reports
- Team collaboration

---

## Recommended Tech Stack Choices

### Recommended Configuration
1. **Auth**: NextAuth.js v5 (free, flexible, well-documented)
2. **Database**: Vercel Postgres or Supabase (easy setup, good free tier)
3. **ORM**: Prisma (excellent TypeScript support, great DX)
4. **File Storage**: Supabase Storage or Cloudinary (generous free tier)
5. **Email**: Resend (modern, great DX, good free tier)
6. **Hosting**: Vercel (seamless Next.js deployment)

### Why These Choices?
- Cost-effective for MVP
- Great developer experience
- Easy to scale
- Strong TypeScript support
- Good documentation
- Active community
