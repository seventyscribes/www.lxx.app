# Version Tracker

Track development progress from **Beta v0.1** to **Alpha v1.0**.

---

## Release Roadmap

```
Beta v0.1 ──► Beta v0.2 ──► Beta v0.3 ──► Beta v0.4 ──► Beta v0.5 ──► Alpha v1.0
   │              │              │              │              │              │
 Setup         Core UI      Backend       Payments       Polish        Launch
```

---

## Current Version

### Beta v0.1.0 - Project Foundation
**Status**: ✅ Complete
**Completed**: 2025-12-30

| Task | Status | Agent |
|------|--------|-------|
| Initialize Next.js 14 project | ✅ Complete | Architect |
| Configure Tailwind with design tokens | ✅ Complete | Architect |
| Set up Prisma + PostgreSQL | ✅ Complete | Database |
| Create database schema | ✅ Complete | Database |
| Create .env.example template | ✅ Complete | Architect |
| Establish folder structure | ✅ Complete | Architect |
| Create project documentation | ✅ Complete | - |
| Define agent workflows | ✅ Complete | - |

**Milestone**: Development environment ready, database schema defined.

#### v0.1.0 Changelog - 2025-12-30

**Added**
- Next.js 16 with App Router, TypeScript, and Tailwind CSS v4
- LXX design system with custom colors (navy, gold, parchment, charcoal)
- Custom shadow utilities (shadow-paper, shadow-paper-xl)
- Prisma schema with 5 models: User, Subscription, UserProgress, JournalEntry, BibleDay
- Project folder structure: app/(auth), app/(main), app/api, components/ui, components/layout, lib/, server/db/
- Environment template (.env.example) with all required variables
- Utility functions (cn, formatDate, isTrialExpired, getDaysRemaining, getProgressPercentage)

---

### Beta v0.2.0 - Core UI
**Status**: ✅ Complete
**Completed**: 2025-12-30

| Task | Status | Agent |
|------|--------|-------|
| Implement design system components | ✅ Complete | Frontend |
| Build BottomNav navigation | ✅ Complete | Frontend |
| Create TodayScreen layout | ✅ Complete | Frontend |
| Build ScriptureReader component | ✅ Complete | Frontend |
| Implement ReflectionPrompt inputs | ✅ Complete | Frontend |
| Create JournalEditor with auto-save | ✅ Complete | Frontend |
| Build ProgressScreen timeline | ✅ Complete | Frontend |
| Build AccountScreen settings | ✅ Complete | Frontend |
| Import first 30 days of content | ⬜ Pending | Content |

**Milestone**: All screens functional with mock data.

#### v0.2.0 Changelog - 2025-12-30

**Added**
- Base UI components: Button (primary/secondary/outline), Card (with stacked paper effect), Input/Textarea, Toggle
- Layout components: Header (with day navigation), BottomNav (fixed bottom tabs), Container
- TodayScreen with scripture reading card, reading mode button, modern summary section, reflection prompts with auto-save, notes section, and "Conclude Day" button
- ProgressScreen with hero card (days completed/percentage), visual timeline with milestones, day grid showing status, streak indicator
- AccountScreen with subscription status, font size/family preferences, modern summaries toggle, journey management buttons
- Immersive reading mode overlay with verse-by-verse display respecting font preferences
- Progress context provider for client-side state management
- Shared types and mock data constants for 3 days of content

---

### Beta v0.3.0 - Backend & Auth
**Status**: ✅ Complete
**Completed**: 2025-12-30

| Task | Status | Agent |
|------|--------|-------|
| Set up NextAuth.js | ✅ Complete | Auth |
| Implement email/password auth | ✅ Complete | Auth |
| Add Google OAuth | ✅ Complete | Auth |
| Create protected route middleware | ✅ Complete | Auth |
| Build journal API routes | ✅ Complete | Backend |
| Build progress API routes | ✅ Complete | Backend |
| Build settings API routes | ✅ Complete | Backend |
| Build days API route | ✅ Complete | Backend |
| Connect frontend to real data | ✅ Complete | Frontend |
| Create database seed script | ✅ Complete | Backend |
| Import complete 365-day content | ⬜ Pending | Content |

**Milestone**: Full auth flow, all features work with database.

#### v0.3.0 Changelog - 2025-12-30

**Added**
- NextAuth.js v5 with Prisma adapter for authentication
- Email/password authentication with bcrypt password hashing
- Google OAuth provider integration
- JWT session strategy for secure token management
- Protected route middleware (/today, /progress, /account)
- Auth UI pages: login and signup with trial info
- API routes:
  - `POST /api/auth/signup` - User registration with 7-day trial
  - `GET/PUT /api/journal/[day]` - Journal entries
  - `GET/PATCH /api/progress` - User progress
  - `POST /api/progress/complete` - Mark day as complete with streak logic
  - `GET/PATCH /api/settings` - User preferences
  - `GET /api/days/[dayNumber]` - Bible day content
- Database seed script with 3 sample Bible days
- UserSettings model for font preferences
- Account, Session, VerificationToken models for NextAuth
- Trial period logic with subscription access checks
- Frontend context connected to API with optimistic updates
- Sign out functionality on Account page

**Changed**
- Prisma schema updated with NextAuth models
- Progress context now syncs with database API
- ProgressProvider fetches initial data from API

**Technical Notes**
- Build requires `prisma generate` (runs automatically via postinstall)
- Environment variables needed: DATABASE_URL, AUTH_SECRET/NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

---

## Upcoming Versions

---

### Beta v0.4.0 - Payments & Access Control
**Status**: ⬜ Not Started
**Target**: Weeks 5-6

| Task | Status | Agent |
|------|--------|-------|
| Configure Stripe products | ⬜ Pending | Payments |
| Create Checkout session API | ⬜ Pending | Payments |
| Implement webhook handlers | ⬜ Pending | Payments |
| Build subscription status check | ⬜ Pending | Payments |
| Create paywall UI component | ⬜ Pending | Frontend |
| Implement trial period logic | ⬜ Pending | Backend |
| Add content access control | ⬜ Pending | Backend |
| Customer portal integration | ⬜ Pending | Payments |

**Milestone**: Complete payment flow, trial and subscription working.

---

### Beta v0.5.0 - Testing & Polish
**Status**: ⬜ Not Started
**Target**: Weeks 7-8

| Task | Status | Agent |
|------|--------|-------|
| Write unit tests (80% coverage) | ⬜ Pending | Testing |
| Create E2E test suite | ⬜ Pending | Testing |
| Security audit | ⬜ Pending | Security |
| Fix identified vulnerabilities | ⬜ Pending | Security |
| Performance profiling | ⬜ Pending | Performance |
| Bundle optimization | ⬜ Pending | Performance |
| Accessibility audit | ⬜ Pending | Accessibility |
| WCAG 2.1 AA compliance | ⬜ Pending | Accessibility |
| Create Dockerfile | ⬜ Pending | DevOps |
| Set up CI/CD pipeline | ⬜ Pending | DevOps |

**Milestone**: Production-ready, all tests passing, deployed to staging.

---

### Alpha v1.0.0 - Launch
**Status**: ⬜ Not Started
**Target**: Week 9+

| Task | Status | Agent |
|------|--------|-------|
| Final QA testing | ⬜ Pending | Testing |
| Production deployment | ⬜ Pending | DevOps |
| DNS & SSL configuration | ⬜ Pending | DevOps |
| Monitoring setup | ⬜ Pending | DevOps |
| Analytics integration | ⬜ Pending | DevOps |
| Launch marketing | ⬜ Pending | - |
| User feedback collection | ⬜ Pending | - |

**Milestone**: Live production app, accepting real users.

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v0.1.0 | 2025-12-30 | Project setup with Next.js 16, Tailwind, Prisma schema |
| v0.2.0 | 2025-12-30 | UI components and screens with mock data |
| v0.3.0 | 2025-12-30 | Authentication and API routes |
| v0.4.0 | TBD | Payments and subscriptions |
| v0.5.0 | TBD | Testing and polish |
| v1.0.0 | TBD | Alpha launch |

---

## Post-Launch Roadmap

### v1.1.0 - Enhanced Engagement
- Streak notifications
- Achievement badges
- Weekly email summaries

### v1.2.0 - Content Expansion
- Additional translations (ESV, NIV)
- Audio devotionals
- Seasonal reading plans

### v1.3.0 - AI Features
- Personalized reflection prompts
- Smart search across entries
- Context-aware reminders

### v1.4.0 - Community
- Small group sharing
- Discussion threads
- Prayer requests

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Pending |
| 🟡 | In Progress |
| ✅ | Complete |
| ❌ | Blocked |
| 🔄 | Needs Review |

---

## Changelog Format

When completing tasks, update this file with:

```markdown
### v0.X.Y - [Date]

#### Added
- New feature description

#### Changed
- Modification description

#### Fixed
- Bug fix description

#### Removed
- Removed feature description
```

---

*Updated: 2025-12-30 (v0.3.0)*
