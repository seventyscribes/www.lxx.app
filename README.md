# LXX Bible Study

A 365-day guided Bible study web application that combines daily scripture reading with reflective journaling.

## Overview

LXX Bible Study guides users through the entire Bible (KJV) over one year with curated passages, modern summaries, and reflection prompts. The app emphasizes habit formation through progress tracking, streaks, and a distraction-free journaling experience.

## Features

### Core Experience
- **365-Day Reading Plan** - Structured journey through the entire Bible (~85 verses/day)
- **Modern Summaries** - Concise explanations to aid comprehension (toggleable)
- **Reflection Prompts** - 3-5 guided questions per day for personal application
- **Rich-Text Journal** - Auto-saving editor for reflection responses and personal notes
- **Immersive Reading Mode** - Full-screen verse-by-verse scripture display

### Progress & Engagement
- **Visual Timeline** - Track completed days with milestone markers
- **Streak System** - Encourage daily habit formation
- **Badges & Achievements** - Gamified progress rewards
- **Day Navigation** - Revisit previous entries or preview upcoming passages

### User Experience
- **Mobile-First Design** - Bottom navigation, card-based UI, responsive layouts
- **Reading Preferences** - Font size, typography (serif/sans), summary toggle
- **Gentle Reminders** - Optional notifications for daily devotionals
- **Privacy-First** - Encrypted journal entries, no data sharing

### Monetization
- **7-Day Free Trial** - Full access to first week of content
- **Subscription Plans** - Monthly ($7.99) and Annual ($59.99)
- **Stripe Integration** - Secure checkout and subscription management

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes / tRPC |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Email + OAuth) |
| Payments | Stripe Checkout + Webhooks |
| Hosting | Coolify (Docker) |

## Project Structure

```
www.lxx.app/
├── ui-prototype/          # Design reference (React + Vite)
│   ├── screens/           # TodayScreen, ProgressScreen, AccountScreen
│   ├── components/        # Header, StudyCard
│   ├── types.ts           # TypeScript interfaces
│   └── constants.tsx      # Mock data & icons
├── PRD.md                 # Full product requirements
├── AGENTS.md              # Development agent definitions
├── VERSION.md             # Release version tracker
└── README.md              # This file
```

## Design System

The UI follows a "sacred parchment" aesthetic:

- **Colors**: Navy (`#1a365d`), Gold (`#c5a059`), Parchment (`#faf8f5`), Charcoal (`#374151`)
- **Typography**: Serif for scripture/headers, Sans for UI elements
- **Cards**: Rounded corners (28px), subtle shadows, stacked paper effect
- **Navigation**: Fixed bottom bar with Today/Progress/Settings tabs

## Data Model

| Table | Purpose |
|-------|---------|
| `users` | Account info, trial dates |
| `subscriptions` | Stripe subscription state |
| `user_progress` | Current day, completed days, streaks |
| `journal_entries` | Notes and reflection answers per day |
| `bible_days` | 365 records of passages, summaries, prompts |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Stripe account

### Development
```bash
# Clone repository
git clone https://github.com/seventyscribes/www.lxx.app.git
cd www.lxx.app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Configure DATABASE_URL, NEXTAUTH_*, STRIPE_* variables

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Deployment
The app deploys via Coolify as a Docker container. See deployment documentation for Coolify configuration.

## Development Agents

See [AGENTS.md](./AGENTS.md) for the specialized AI agents employed during development.

## Version History

See [VERSION.md](./VERSION.md) for the release roadmap from Beta v0.1 to Alpha v1.0.

## License

Proprietary - All rights reserved.

---

*"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105*
