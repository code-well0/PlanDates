# PlanDates - Interactive Calendar Planner

PlanDates is a modern calendar web app built with Next.js.  
It supports month/week/day planning, drag range selection, event management, notes, and responsive layouts for desktop and mobile.

## Features

- **Calendar views**: Month, Week, and Day views with smooth transitions.
- **Theme support**: Light and Dark mode toggle with month-aware accent theming.
- **Hero section**: Dynamic monthly hero images and seasonal quote styling.
- **Date range selection**:
  - Drag to select ranges in the main calendar.
  - Matching range visualization in the mini sidebar calendar.
- **Event management**:
  - Add/Edit/Delete events with title, time, location, category, color, and notes.
  - Event details popup with quick actions.
  - "View on Calendar" jumps directly to that event date.
- **Notes system**:
  - Monthly memo notes.
  - Day/Range notes with explicit save and delete behavior.
  - Saved notes surfaced in sidebar with quick delete.
- **Mini sidebar calendar**:
  - Instant month switch dropdown.
  - Hover preview for events on a date.
  - Today and range styling for quick context.
- **Responsive UX**:
  - Dedicated mobile header structure (brand, controls, tabs).
  - Mobile panel toggles and adaptive card spacing.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- React
- Framer Motion
- date-fns
- CSS (global, theme-variable driven styling)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app/` - app entry, layout, global styles
- `src/components/` - UI modules (calendar grid, sidebar, notes panel, modals)
- `src/hooks/` - calendar state logic
- `src/utils/` - calendar/date helpers and constants
- `public/images/` - monthly hero images

## Scripts

- `npm run dev` - run local development server
- `npm run build` - create production build
- `npm run start` - start production server
- `npm run lint` - run lint checks

## Notes

- Event and notes data are persisted in browser local storage.
- Theme preference (light/dark) is also persisted locally.
