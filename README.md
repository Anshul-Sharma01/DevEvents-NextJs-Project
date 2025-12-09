# DevEvents

DevEvents is a learning project built to explore the Next.js App Router, data fetching patterns, and server actions by creating a small events discovery experience for developers.

The goal of the project is educational: practice end-to-end Next.js concepts (routing, caching, streaming, server actions, API routes) while wiring a real MongoDB backend for events and bookings.

## Features
- Landing page that fetches and renders featured events from the API.
- Event detail page with overview, agenda, organizer info, tags, and a booking call-to-action.
- Similar events surfaced by shared tags (server action).
- API routes for listing events and fetching an event by slug.
- Cloudinary image upload on event creation (server-side).
- MongoDB models for events and bookings with schema validation.

## Tech Stack
- Next.js 16 (App Router, server components, streaming, cache control)
- React 19
- MongoDB with Mongoose
- Cloudinary for image storage
- Tailwind CSS 4 for styling

## System Design (conceptual)
- **Client (Next.js App Router)**: Server Components render pages (`app/page.tsx`, `app/events/[slug]/page.tsx`) and call server actions / fetch API routes. Minimal client components (e.g., `BookEvent`) handle interactivity.
- **API Layer**: `app/api/events` for list/create, `app/api/events/[slug]` for detail. These routes connect directly to MongoDB via `lib/mongodb`.
- **Data Layer (MongoDB)**: Mongoose models `Event` and `Booking` define schema, normalization (slug, date, time), and validation.
- **Media**: Images uploaded to Cloudinary during event creation; secure URL stored on the event document.
- **Similar Events Flow**:
  - Detail page calls server action `getSimilarEventsBySlug(slug)`.
  - Action fetches the event by slug, then queries other events sharing tags.
  - UI renders a grid of `EventCard` components or a fallback message.

### High-level request flow
1) Browser requests `GET /events/[slug]`.
2) Server Component fetches event via `/api/events/[slug]` and invokes `getSimilarEventsBySlug`.
3) API route connects to MongoDB, returns event JSON.
4) Page renders description, details, tags, agenda, organizer, and similar events.
5) Optional booking interaction handled by client component.

## API Endpoints (App Router)
- `GET /api/events` — list events (sorted newest first).
- `POST /api/events` — create event (multipart form-data with `image`, `tags` JSON, `agenda` JSON).
- `GET /api/events/:slug` — fetch single event by slug.

## Data Models (summary)
- `Event`: `title`, `slug`, `description`, `overview`, `image`, `venue`, `location`, `date`, `time`, `mode`, `audience`, `agenda[]`, `organizer`, `tags[]`, timestamps. Pre-save hooks normalize slug/date/time and enforce validation.
- `Booking`: minimal schema for attendee info and event reference (see `database/booking.model.ts`).

## Getting Started
### Prerequisites
- Node.js 18+
- MongoDB connection string
- Cloudinary account (for image uploads)

### Environment
Create `.env.local` with:
```
MONGODB_URI=your-mongodb-uri
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Install & Run
```bash
npm install
npm run dev
# build/start
npm run build
npm run start
```

## Project Structure (key)
- `app/` — routes, layouts, pages.
- `app/api/events` — list/create; `app/api/events/[slug]` — detail.
- `lib/actions/event.actions.ts` — server action for similar events.
- `lib/mongodb.ts` — Mongo connection helper with caching.
- `database/` — Mongoose models and exports.
- `components/` — UI pieces like `EventCard`, `BookEvent`, `Navbar`.
- `public/` — static assets (icons, event images).

## Learning Notes
- Demonstrates App Router data fetching: `use cache`, `cacheLife`, and `fetch` with cache directives.
- Shows how to mix server actions with API routes for richer pages.
- Highlights MongoDB + Mongoose integration inside App Router routes.

## Future Improvements
- Add authentication for creating events and bookings.
- Implement booking persistence and availability tracking.
- Add pagination and filtering on the events list.
- Add tests (unit + integration) for actions and API routes.
