# Telc-admin-pannel

Complete Learning Management & Administration Platform for **TELC Mastery** German Vocabulary Application.

Built with:
- **Next.js 15 (App Router)** & **TypeScript**
- **Tailwind CSS** & **shadcn/ui**
- **TanStack Table** & **TanStack Query**
- **Lucide Icons**
- **React Hook Form** & **Zod**
- **Recharts**

## Features
- **Dashboard:** Platform metrics, daily learning activity bar chart, recent learners table, course progress trackers.
- **Courses:** CEFR levels (A1–C1), chapter hierarchies, publishing workflow (Draft, Published, Archived).
- **Chapters:** 7-day module schedules, 20 words/day quota, previous review stage triggers.
- **Vocabulary:** Full German dictionary with grammatical articles (`der`/`die`/`das`), IPA pronunciation, browser audio player, example sentences, and accuracy statistics.
- **Bulk Import:** CSV/Excel batch upload with preview, duplicate detection, and validation checks.
- **Learning Sessions:** Configurable 5-step learning sequence (4 new words &rarr; translation test &rarr; 4 new words &rarr; cumulative test &rarr; repeat until 20 words).
- **Tests & Assessments:** Vocabulary quizzes, cumulative milestone tests, and chapter exams with acceptable synonym scoring.
- **Spaced Review:** Daily previous word injection (10 words), automated priority algorithm, randomized reviews.
- **Learners & Progress:** Enrolled user monitoring, 7-day timeline completion history, suspension toggles, and confirmed progress reset.
- **Analytics:** Overall learning volume, vocabulary difficulty friction matrix, and 3-step chapter completion funnels.
- **Notifications:** Targeted push alerts (by course, chapter, or inactive users) with scheduling.
- **Role-Based Access Control:** `SUPER_ADMIN`, `CONTENT_ADMIN`, and `SUPPORT_ADMIN` with route shielding.

## Getting Started

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port 3001) in your browser.
