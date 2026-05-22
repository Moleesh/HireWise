# HireWise

[![Build and Deploy to GitHub Pages](https://github.com/Moleesh/HireWise/actions/workflows/main.yml/badge.svg)](https://github.com/Moleesh/HireWise/actions/workflows/main.yml)

A comprehensive recruiting and talent management platform designed to streamline the hiring process from job posting to candidate ranking and selection.

## 🚀 Live Demo

- **Test Site**: [https://Moleesh.github.io/HireWise/](https://Moleesh.github.io/HireWise/)

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
- **Deployment**: GitHub Pages + GitHub Actions

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

## Deployment

This project is automatically built and deployed to GitHub Pages on every push to the `main` branch via GitHub Actions.

- **Workflow**: `.github/workflows/main.yml`
- **Status**: Check the [Actions](https://github.com/Moleesh/HireWise/actions) tab for build status
- **Live URL**: [https://Moleesh.github.io/HireWise/](https://Moleesh.github.io/HireWise/)

## Project Structure

- `src/features/` - Feature modules (auth, dashboard, jobs, candidates, rankings, settings)
- `src/shared/` - Shared components, hooks, and utilities
- `src/test-setup.ts` - Test configuration
- `.github/workflows/` - CI/CD automation

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is private.
