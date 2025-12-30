# Development Agents

This document defines the specialized AI agents employed to build the LXX Bible Study application from initial setup through Beta v1.0 release.

---

## Agent Overview

| Agent | Role | Phase |
|-------|------|-------|
| Architect | System design & project structure | Setup |
| Database | Schema design & data modeling | Setup |
| Content | Bible data preparation & import | Setup |
| Frontend | UI components & screens | Core |
| Backend | API routes & business logic | Core |
| Auth | Authentication & user management | Core |
| Payments | Stripe integration & subscriptions | Core |
| Testing | Test suites & quality assurance | Polish |
| DevOps | Docker, CI/CD, deployment | Polish |
| Security | Audit & vulnerability fixes | Polish |
| Performance | Optimization & profiling | Polish |
| Accessibility | A11y compliance & improvements | Polish |

---

## Phase 1: Setup Agents

### Architect Agent

**Purpose**: Establish project foundation, folder structure, and technical decisions.

**Responsibilities**:
- Initialize Next.js 14 project with App Router
- Configure TypeScript, ESLint, Prettier
- Set up Tailwind CSS with custom design tokens
- Create folder structure following best practices
- Define environment variable schema
- Document architectural decisions

**Inputs**:
- PRD.md requirements
- ui-prototype/ design reference
- Tech stack specifications

**Outputs**:
- Initialized Next.js project
- `tailwind.config.ts` with design system
- `tsconfig.json` configuration
- `.env.example` template
- `docs/architecture.md`

**Commands**:
```
npx create-next-app@latest . --typescript --tailwind --app --src-dir
```

---

### Database Agent

**Purpose**: Design and implement the PostgreSQL schema with Prisma ORM.

**Responsibilities**:
- Create Prisma schema matching PRD data model
- Define relationships (users, subscriptions, progress, entries)
- Set up database indexes for performance
- Create seed scripts for development
- Document migration strategy

**Inputs**:
- PRD Section 6.2 (Data Model)
- User journey requirements

**Outputs**:
- `prisma/schema.prisma`
- `prisma/seed.ts`
- Initial migration files
- `docs/database.md`

**Schema Preview**:
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  trialEndDate  DateTime
  createdAt     DateTime @default(now())
  subscription  Subscription?
  progress      UserProgress?
  entries       JournalEntry[]
}

model BibleDay {
  dayNumber         Int      @id
  passageReference  String
  verses            Json
  modernSummary     String   @db.Text
  reflectionPrompts String[]
}
```

---

### Content Agent

**Purpose**: Prepare and import the 365-day Bible reading plan.

**Responsibilities**:
- Source KJV text (public domain)
- Create reading plan covering OT and NT
- Write modern summaries for each day (150-250 words)
- Craft 3-5 reflection prompts per passage
- Build data import scripts
- Validate content integrity

**Inputs**:
- KJV Bible text source
- Reading plan structure (OT/NT interleaving)
- PRD journaling requirements

**Outputs**:
- `data/bible-days.json` (365 records)
- `scripts/import-content.ts`
- Content validation report
- `docs/content-guidelines.md`

**Day Structure**:
```json
{
  "dayNumber": 1,
  "passageReference": "Genesis 1-2",
  "verses": [
    {"book": "Genesis", "chapter": 1, "verse": 1, "text": "In the beginning..."}
  ],
  "modernSummary": "The opening of Genesis establishes God as...",
  "reflectionPrompts": [
    "What does 'formless and void' reveal about God's power?",
    "How does 'God said' change your view of words?",
    "Where do you need God's light in your life?"
  ]
}
```

---

## Phase 2: Core Feature Agents

### Frontend Agent

**Purpose**: Build all UI components and screens following the design prototype.

**Responsibilities**:
- Implement design system (colors, typography, spacing)
- Create reusable components (StudyCard, Header, Navigation)
- Build screen layouts (Today, Progress, Account)
- Implement reading mode with font preferences
- Add journal editor with auto-save
- Ensure responsive mobile-first design

**Inputs**:
- `ui-prototype/` React components
- Tailwind design tokens
- PRD UX requirements

**Outputs**:
- `src/components/ui/` - Base components
- `src/components/` - Feature components
- `src/app/(main)/` - Page layouts
- `src/styles/` - Global styles

**Key Components**:
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Toggle.tsx
├── layout/
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   └── Container.tsx
├── study/
│   ├── ScriptureReader.tsx
│   ├── ReflectionPrompt.tsx
│   └── JournalEditor.tsx
└── progress/
    ├── Timeline.tsx
    ├── DayGrid.tsx
    └── StreakBadge.tsx
```

---

### Backend Agent

**Purpose**: Implement API routes and server-side business logic.

**Responsibilities**:
- Create tRPC or Next.js API routes
- Implement CRUD for journal entries
- Build progress tracking endpoints
- Add subscription status checks
- Implement content access control (trial/paid)
- Set up server-side validation

**Inputs**:
- PRD functional requirements
- Database schema
- Auth requirements

**Outputs**:
- `src/server/api/` - API router
- `src/server/services/` - Business logic
- `src/lib/` - Utility functions
- API documentation

**API Routes**:
```
/api/days/[dayNumber]     GET    - Fetch day content
/api/progress             GET    - Get user progress
/api/progress/complete    POST   - Mark day complete
/api/journal/[day]        GET    - Get journal entry
/api/journal/[day]        PUT    - Save journal entry
/api/settings             GET    - Get user settings
/api/settings             PATCH  - Update settings
/api/subscription/status  GET    - Check subscription
```

---

### Auth Agent

**Purpose**: Implement secure authentication and user management.

**Responsibilities**:
- Configure NextAuth.js with Prisma adapter
- Implement email/password authentication
- Add OAuth providers (Google, Apple)
- Set up email verification flow
- Create protected route middleware
- Manage trial period logic

**Inputs**:
- PRD Section 4.5 (Authentication)
- Security requirements
- Trial management specs

**Outputs**:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts` - Auth utilities
- `src/middleware.ts` - Route protection
- Email templates

**Auth Flow**:
```
1. User signs up → Create account → Set trialEndDate (+7 days)
2. Email verification sent → User confirms
3. Protected routes check session + subscription status
4. Trial expires → Prompt subscription or limit access
```

---

### Payments Agent

**Purpose**: Integrate Stripe for subscriptions and payment processing.

**Responsibilities**:
- Set up Stripe Checkout sessions
- Implement subscription webhook handlers
- Create customer portal integration
- Build paywall UI components
- Handle subscription lifecycle events
- Manage access based on payment status

**Inputs**:
- PRD Section 4.6 (Paywall)
- Stripe API documentation
- Pricing tiers ($7.99/mo, $59.99/yr)

**Outputs**:
- `src/app/api/stripe/` - Webhook handlers
- `src/lib/stripe.ts` - Stripe utilities
- `src/components/subscription/` - Paywall UI
- Stripe product/price configuration

**Webhook Events**:
```
checkout.session.completed    → Create subscription record
customer.subscription.updated → Update status
customer.subscription.deleted → Mark canceled
invoice.payment_failed        → Handle failure
```

---

## Phase 3: Polish Agents

### Testing Agent

**Purpose**: Ensure application quality through comprehensive testing.

**Responsibilities**:
- Write unit tests for utilities and hooks
- Create integration tests for API routes
- Build E2E tests for critical user flows
- Set up test database fixtures
- Configure CI test pipeline
- Generate coverage reports

**Inputs**:
- All implemented features
- User journey specs
- Edge cases from PRD

**Outputs**:
- `__tests__/` - Test suites
- `cypress/` or `playwright/` - E2E tests
- `jest.config.js`
- Coverage thresholds

**Test Coverage Targets**:
```
- Unit tests: 80% coverage
- Integration tests: All API routes
- E2E tests: Registration, daily study, checkout
```

---

### DevOps Agent

**Purpose**: Configure deployment, CI/CD, and infrastructure.

**Responsibilities**:
- Create Dockerfile for production
- Set up GitHub Actions workflows
- Configure Coolify deployment
- Implement health checks
- Set up logging and monitoring
- Create backup strategies

**Inputs**:
- PRD Section 6.1 (Hosting)
- Coolify documentation
- Performance requirements

**Outputs**:
- `Dockerfile`
- `.github/workflows/` - CI/CD pipelines
- `docker-compose.yml` - Local development
- `docs/deployment.md`

**Deployment Pipeline**:
```
1. Push to main → Run tests
2. Tests pass → Build Docker image
3. Push to registry → Deploy to Coolify
4. Health check → Rollback if failed
```

---

### Security Agent

**Purpose**: Audit and harden the application against vulnerabilities.

**Responsibilities**:
- Audit dependencies for CVEs
- Review authentication implementation
- Validate input sanitization
- Check for XSS/CSRF protections
- Ensure data encryption at rest
- Verify HTTPS enforcement
- Review Stripe webhook security

**Inputs**:
- Complete application code
- OWASP guidelines
- PRD security requirements

**Outputs**:
- Security audit report
- Remediation PRs
- `docs/security.md`
- CSP and security headers

**Checklist**:
```
[ ] No secrets in code
[ ] SQL injection prevention (Prisma handles)
[ ] XSS prevention (React escaping + CSP)
[ ] CSRF tokens on mutations
[ ] Rate limiting on auth endpoints
[ ] Webhook signature verification
[ ] Journal encryption at rest
```

---

### Performance Agent

**Purpose**: Optimize application speed and resource usage.

**Responsibilities**:
- Profile initial load performance
- Optimize database queries
- Implement caching strategies
- Reduce JavaScript bundle size
- Add image optimization
- Enable edge caching

**Inputs**:
- Performance benchmarks
- Lighthouse reports
- Database query logs

**Outputs**:
- Performance optimization PRs
- Caching configuration
- `docs/performance.md`
- Before/after metrics

**Targets**:
```
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTI: < 3.0s
- Bundle size: < 200KB (initial)
```

---

### Accessibility Agent

**Purpose**: Ensure WCAG 2.1 AA compliance and inclusive design.

**Responsibilities**:
- Add ARIA labels and roles
- Ensure keyboard navigation
- Verify color contrast ratios
- Test with screen readers
- Add skip links and landmarks
- Support reduced motion

**Inputs**:
- UI components
- WCAG 2.1 guidelines
- User accessibility needs

**Outputs**:
- Accessibility audit report
- Component improvements
- `docs/accessibility.md`
- Screen reader testing notes

**Checklist**:
```
[ ] All images have alt text
[ ] Focus indicators visible
[ ] Form labels associated
[ ] Color not sole indicator
[ ] Headings in order
[ ] Touch targets 44x44px+
[ ] Animations respect prefers-reduced-motion
```

---

## Agent Workflow

### Development Sequence

```
Week 1: Setup
├── Architect Agent → Project initialization
├── Database Agent → Schema & migrations
└── Content Agent → Begin content preparation

Week 2-4: Core Features
├── Frontend Agent → UI components & screens
├── Backend Agent → API implementation
├── Auth Agent → Authentication system
└── Content Agent → Complete 365-day content

Week 5-6: Monetization
├── Payments Agent → Stripe integration
├── Backend Agent → Access control
└── Frontend Agent → Paywall UI

Week 7-8: Polish
├── Testing Agent → Test suites
├── Security Agent → Audit & fixes
├── Performance Agent → Optimization
├── Accessibility Agent → A11y compliance
└── DevOps Agent → Deployment pipeline
```

### Agent Communication

Agents share context through:
- This AGENTS.md document
- PRD.md requirements
- Code comments and documentation
- VERSION.md for release tracking
- Git commit messages

### Handoff Protocol

When one agent completes work:
1. Commit changes with descriptive message
2. Update VERSION.md with completed items
3. Document any blockers or decisions
4. Note dependencies for next agent

---

## Usage

Invoke an agent by referencing its name and responsibilities:

```
"Act as the Frontend Agent. Implement the BottomNav component
following the ui-prototype/index.tsx navigation pattern."
```

```
"Act as the Database Agent. Create the Prisma migration for
adding streak_count to user_progress."
```

```
"Act as the Security Agent. Audit the /api/journal routes
for proper authentication and authorization."
```

---

*Agents work together to deliver a polished, production-ready Bible study application.*
