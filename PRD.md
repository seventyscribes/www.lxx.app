# LXX 365‑Day Bible Study – MVP Product Requirements Document

## 1 Overview

The **LXX Bible Study MVP** is a web application that guides users through a structured 365‑day reading plan covering the entire Old and New Testaments (King James Version by default).  Each day presents a curated passage, a short modern summary and several reflection prompts.  Users can write private reflections in a rich‑text journal and track their progress.  After a 7‑day free trial, the remaining 358 days are behind a paywall to sustain the service through subscriptions.

This document defines the minimum‑viable feature set, technical architecture and timeline for launching the product on a cost‑effective, scalable stack.  The design draws inspiration from Stoic’s guided journaling patterns—daily prompts, progress tracking, gentle reminders and personalised feedback【81329860328649†L22-L42】.  It adapts those patterns into a faith‑based context with scripture passages and spiritual prompts【81329860328649†L24-L37】.

## 2 Objectives

* Provide an accessible, self‑paced journey through the entire Bible in one year.
* Encourage daily study habits by pairing scripture with reflection prompts and a journal【81329860328649†L24-L37】.
* Maintain user engagement through progress tracking, badges and gentle reminders【81329860328649†L37-L47】.
* Offer a sustainable subscription model with a 7‑day free trial and affordable monthly/annual plans.
* Ensure privacy, simplicity and low cost per user.

## 3 Target audience

The app is designed for individuals seeking a structured, devotional reading plan.  Users may include:

* Christians who want to read through the Bible systematically.
* People new to scripture who benefit from modern summaries and guided prompts.
* Those who enjoy journaling and reflection as part of their spiritual practice.

## 4 Functional requirements

### 4.1 Daily reading plan

1. **365‑day schedule:** The app includes a predefined reading plan that spans the entire Bible.  Each day covers ~85 verses on average, mixing Old and New Testament passages to keep variety.  Content is stored in a `bible_days` table/collection with fields for `day_number`, `passage_reference`, `verses` (list), `modern_summary` (150–250 words), and `reflection_prompts` (3–5 short questions).  Users cannot alter the plan.
2. **Modern summary:** Each passage includes a concise, modern‑language summary to aid comprehension.  Users can toggle summaries on/off in settings【159978110728172†L127-L146】.
3. **Reflection prompts:** Each day has three to five questions encouraging personal application, theological reflection and modern relevance【81329860328649†L24-L37】.
4. **Read/Reflection toggle:** Users can switch between an immersive reading mode (verse‑by‑verse view) and a study mode that shows the summary and prompts【689937173086816†L68-L161】.

### 4.2 Journaling

1. **Rich‑text editor:** Provide a minimal, distraction‑free editor with basic formatting (bold, italics, lists).  Auto‑save changes after a short delay【689937173086816†L69-L102】.
2. **Reflection answers:** Users write responses to each prompt in dedicated fields.  Each answer auto‑saves and is stored by day and prompt index【689937173086816†L74-L90】.
3. **Personal notes:** In addition to prompts, a free‑form notes section lets users jot down other thoughts or prayers【689937173086816†L93-L105】.
4. **Privacy:** Entries are private and encrypted at rest.  Only the authenticated user can read or edit their journals.

### 4.3 Progress tracking

1. **Completion tracking:** Each day can be marked complete when all prompts are answered or manually by the user【689937173086816†L107-L114】.  The system records `completed_day_ids` in the user’s profile.
2. **Progress overview:** A dashboard shows total days completed, percentage done and a timeline with milestones every 30 days【707587895106040†L11-L55】.  Completed days and those with notes are visually distinguished【707587895106040†L70-L134】.
3. **Streaks & badges:** Basic gamification such as a “7‑day study streak” badge encourages habit formation【81329860328649†L37-L42】.  More advanced achievements can be added post‑MVP.

### 4.4 User settings

1. **Account page:** Displays subscription status and allows users to manage their reading preferences【159978110728172†L38-L69】.
2. **Reading preferences:** Users can choose font size and typography style (serif/sans) and toggle modern summaries【159978110728172†L70-L146】.
3. **Notification preferences:** Users can opt in to gentle reminders for morning/evening devotionals and be emailed or pushed accordingly【81329860328649†L43-L48】.  MVP can start with basic daily reminders; context‑aware AI reminders are future work.

### 4.5 Authentication and accounts

1. **Email/password or OAuth:** Users sign up via email or a third‑party provider (e.g., Google, Apple).  Email verification is required.
2. **Trial management:** When a user registers, a 7‑day trial is started.  The system records `trial_end_date` and restricts access to content beyond day 7 if the user has not subscribed.

### 4.6 Paywall and subscriptions

1. **Subscription plans:** Offer two paid tiers after the trial: monthly (e.g., **$7.99/month**) and yearly (e.g., **$59.99/year**) with two months free.  Pricing may be adjusted but should remain affordable.
2. **Payment processing:** Integrate with Stripe Checkout for subscriptions.  Use Stripe webhooks to update subscription status in the database.  Provide a customer portal for upgrades or cancellations.
3. **Access control:** Users in trial or with an active subscription can access all 365 days.  Users without an active subscription after the trial may view previously completed days but cannot unlock new ones.

### 4.7 Administrative tools

1. **Content management:** A back‑office interface or script to import the 365‑day plan (verses, summaries and prompts) into the database.
2. **Analytics:** Track trial‑to‑paid conversion, churn rate, days completed per user and revenue metrics.
3. **Support:** Ability to manage subscriptions, issue refunds and adjust trial periods via Stripe’s dashboard.

## 5 Non‑functional requirements

* **Performance:** Pages should load within 2 seconds on broadband connections.  Reading mode must be smooth and responsive on mobile devices.
* **Mobile‑first design:** The UI should prioritise mobile; use responsive layouts inspired by the prototype (bottom navigation bar with Today/Progress/Settings tabs, card‑based dashboards)【826775292143940†L40-L83】.
* **Accessibility:** Provide adequate contrast, keyboard navigation and screen‑reader labels.
* **Scalability:** Architecture must support thousands of concurrent users without major redesign.  Stateless servers with a managed database and CDN caching will help scale horizontally.
* **Privacy & security:** Encrypt user data at rest and in transit, follow least‑privilege access, and ensure compliance with GDPR/CCPA.  Personal journals are never analysed or shared without consent.
* **Internationalisation:** MVP uses the KJV; future versions should support other translations.  Content and UI should be localisable.

## 6 Technical architecture

### 6.1 Stack selection

The product must be deployable on **Coolify**, a self‑hosted PaaS that runs Docker containers.  To balance development speed, scalability and cost, the recommended stack is:

* **Frontend:** **Next.js 14** (React) with the App Router for server components.  Next.js allows hybrid static and server rendering, good SEO and fast iteration.  Tailwind CSS will handle styling, consistent with the prototype.
* **Backend/API:** Use **Next.js API routes** or **tRPC** on the same repository to implement server‑side logic (authentication, database access, Stripe webhooks).  Alternatively, a separate **FastAPI** service could be used, but a monorepo simplifies deployment.
* **Database:** **PostgreSQL** (via **Prisma ORM**) to store user accounts, progress, journal entries and subscription metadata.  PostgreSQL offers transactional consistency and is easy to host via Coolify’s database service.  For simpler operations, **SQLite** can be used in development.
* **Authentication:** **NextAuth.js** (with PostgreSQL adapter) for email/password and OAuth flows.
* **Payments:** **Stripe** Checkout and webhooks.  Use the Stripe Node SDK to create sessions and handle subscription events.
* **Hosting:** Build the app as a Docker image and deploy it via Coolify.  Coolify will manage containers, environment variables and scaling.  Assets can be served via Cloudflare or Coolify’s built‑in CDN.

### 6.2 Data model (simplified)

| Table/Collection | Key fields | Description |
|------------------|-----------|-------------|
| **users** | `id` (PK), `email`, `password_hash`, `name`, `created_at`, `trial_end_date` | Basic user info and trial end date. |
| **subscriptions** | `user_id` (FK), `stripe_customer_id`, `stripe_subscription_id`, `status`, `plan_type`, `started_at`, `canceled_at` | Tracks subscription state. |
| **user_progress** | `user_id` (PK), `current_day`, `completed_day_ids` (array), `last_active_date`, `streak_count` | Progress metrics for each user【689937173086816†L69-L116】. |
| **journal_entries** | `user_id` (PK), `day_number` (PK), `content`, `reflection_answers` (JSON), `created_at`, `updated_at` | Stores notes and prompt responses. |
| **bible_days** | `day_number` (PK), `passage_reference`, `verses` (JSON), `modern_summary`, `reflection_prompts` (array) | Read‑only table with 365 records containing daily content. |

## 7 User journey

1. **Onboarding:** New users land on a marketing page explaining the 365‑day study and subscription.  They create an account and start a 7‑day trial.
2. **Daily experience:** Each day, the dashboard surfaces the current day’s passage and prompts.  Users read the scripture, view the summary if desired, and answer reflection prompts in the journal.  Progress is auto‑saved, and a completion button marks the day done.  They can navigate to previous or future days within their access limit.
3. **Progress review:** The Progress tab shows a visual timeline of completed days, percentage complete and streak badges【707587895106040†L11-L55】.  Users can tap any day in the timeline to revisit entries【707587895106040†L70-L134】.
4. **Settings & subscription:** The Settings tab allows toggling reading preferences, enabling reminders and viewing membership status【159978110728172†L38-L69】.  When the trial ends, the app prompts users to subscribe via Stripe Checkout.  After payment, locked content becomes available.  If the subscription lapses, users retain read‑only access to past entries.

## 8 Timeline & milestones

Assuming a solo developer and an 8–10 week window, the following phased plan is suggested.  Parallel content creation (summaries and prompts) should occur alongside development.

1. **Week 1 – Setup & Planning**
   * Finalise branding, domain name and reading plan.
   * Set up repository and design the database schema.
   * Configure Coolify environment with PostgreSQL and Stripe keys.

2. **Weeks 2–4 – Core Features**
   * Implement authentication and user onboarding.
   * Build daily reading display, modern summary toggle and journal editor with autosave.
   * Implement progress tracking (mark complete, timeline view) and settings for typography and summaries.
   * Populate the `bible_days` table with the full 365‑day plan.

3. **Weeks 5–6 – Paywall & Subscriptions**
   * Integrate Stripe Checkout and webhooks for subscription plans.
   * Implement 7‑day trial logic and restrict content accordingly.
   * Build the Account page to display membership status and preferences.

4. **Weeks 7–8 – Testing & Polish**
   * Conduct usability testing on mobile and desktop.
   * Optimise performance, accessibility and responsive design.
   * Add gentle notification reminders and basic analytics (trial conversions, churn).
   * Prepare marketing materials and deploy to production via Coolify.

## 9 Future considerations

While not required for the MVP, the following enhancements are inspired by the existing roadmap【81329860328649†L43-L98】 and can be scheduled after launch:

* **Guided study plans & custom templates:** Offer optional thematic studies (e.g., Psalms meditation, Parables of Jesus) and a template builder to create custom journals【81329860328649†L30-L37】.
* **AI‑assisted reflection prompts:** Use on‑device language models to generate personalised questions based on previous entries【81329860328649†L54-L63】.
* **Smart history & search:** Categorise entries by themes (gratitude, requests) and provide context‑aware search suggestions【81329860328649†L64-L68】.
* **Community features:** Enable small‑group study sharing with privacy controls.
* **Multiple translations & audio devotionals:** Add support for other translations (ESV, NIV) and audio or video devotionals.
* **Seasonal challenges:** Launch special reading plans for Advent, Lent or Easter with gamified badges.

## 10 Success metrics

* **Trial‑to‑paid conversion:** Aim for ≥25 % of trial users to subscribe.
* **Monthly churn:** Keep churn below 5 %.
* **Daily engagement:** Track percentage of users completing daily reading and journal prompts.
* **MRR growth:** Monitor monthly recurring revenue to ensure the product covers operating costs and yields a healthy margin.

## 11 Appendix: Inspiration from Stoic App

The Stoic journaling app emphasises daily prompts, progress tracking and personalised messages, which translate well into a faith‑based journal.  Adaptations include:

* Presenting daily scripture passages with reflection questions and weekly themes【81329860328649†L24-L29】.
* Creating guided study plans and custom templates for deeper topics like Psalms or Sermon on the Mount【81329860328649†L30-L35】.
* Gamifying progress with streaks and badges to encourage habit formation【81329860328649†L37-L42】.
* Sending gentle reminders and uplifting verses tied to user mood or recent entries【81329860328649†L43-L53】.
* Implementing smart history and context‑aware search to help users revisit insights【81329860328649†L64-L69】.

These elements should guide future iterations once the MVP is launched.
