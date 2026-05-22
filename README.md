# HireWise

A comprehensive recruiting and talent management platform designed to streamline the hiring process from job posting to candidate ranking and selection.

## Features

- **Job Management**: Create, edit, and manage job postings with detailed descriptions and requirements
- **Candidate Tracking**: Track and manage candidate applications and profiles
- **Smart Ranking**: AI-powered candidate ranking to help identify the best fits for positions
- **Dashboard**: Overview of key hiring metrics and recent activity
- **User Management**: Administrative controls for team members and permissions
- **Theme Support**: Light and dark mode for comfortable viewing
- **Authentication**: Secure login system with user session management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: SCSS, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Auth & API
- **Icons**: Lucide React
- **Testing**: Vitest
- **Linting**: ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
npm run test:watch
```

### Linting & Formatting

```bash
npm run lint
npm run format
npm run typecheck
```

## Project Structure

- `src/features/` - Feature modules (auth, dashboard, jobs, candidates, rankings, settings)
- `src/shared/` - Shared components, hooks, and utilities
- `src/test-setup.ts` - Test configuration

## License

This project is private.
