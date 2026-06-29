<!-- @format -->

# 💼 HireWise

[![Build and Deploy to GitHub Pages](https://github.com/Moleesh/HireWise/actions/workflows/main.yml/badge.svg)](https://github.com/Moleesh/HireWise/actions/workflows/main.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

<div align="center">
  <a href="https://bolt.new/">
    <img
      alt="Bolt.new"
      src="https://bolt.new/static/favicon.svg"
      width="96"
      height="96"
    />
  </a>
  <h2>Developed using Bolt.new</h2>
</div>

> **Transform Your Hiring Process** | Streamlined Recruitment from Job Posting to Perfect Candidate Match

A next-generation recruiting and talent management platform that revolutionizes how teams discover, evaluate, and hire top talent. Say goodbye to manual candidate sorting—let intelligent ranking[...]

---

## 🖥️ Language Composition

| Language   | Percentage |
| ---------- | ---------- |
| TypeScript | 88.8%      |
| SCSS       | 9.7%       |
| Other      | 1.5%       |

---

## ✨ Key Highlights

- 🎯 **AI-Powered Ranking** - Automatically identify the best candidates for your positions
- 🚀 **Smart Workflow** - Seamless journey from job posting to candidate selection
- 👥 **Unified Dashboard** - Real-time insights into your hiring pipeline
- 🔐 **Enterprise Security** - Role-based access control and secure authentication
- 🎨 **Beautiful UI** - Multi-theme UI with responsive design
- ⚡ **Lightning Fast** - Built with modern tech stack for peak performance

---

## 🌐 Live Demo

**▶️ [Visit the Live Application](https://Moleesh.github.io/HireWise/)** - See it in action right now!

---

## 🎯 Features

| Feature                    | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| 📋 **Job Management**      | Create, edit, and manage job postings with rich descriptions and custom requirements |
| 👤 **Candidate Tracking**  | Maintain detailed profiles and track every stage of the application lifecycle        |
| 🤖 **Smart Ranking**       | AI-driven candidate ranking to find the perfect fit for your positions               |
| 📑 **Candidate Reports**   | Build reusable Excel-ready reports with sortable table previews and saved workflows  |
| 📊 **Analytics Dashboard** | Key hiring metrics, pipeline overview, and performance analytics                     |
| 👨‍💼 **User Management**     | Team administration with role control, password reset, and username-based onboarding |
| 🌓 **Theme Switcher**      | Elegant light and dark mode support                                                  |
| 🔒 **Secure Auth**         | Industry-standard authentication with session management                             |

---

## 📱 Responsive Views

| View           | Behavior                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| **Small view** | Mobile-first stacked cards, compact filters, touch-friendly actions       |
| **Large view** | Wider dashboards, multi-column grids, side-by-side reports, richer tables |

Reports include two focused views and workflow tools:

- **Candidate List View** — filter candidates, preview rows in a sortable table, and export selected/visible rows.
- **Field Column Report** — choose columns and drag/drop to control export order.
- **Saved Workflows** — save reusable report setups and set defaults for repeat exports.

---

## 🛠️ Technology Stack

### Frontend

- **React** 19 (UI)
- **TypeScript** 6 (88.8%) — type-safe scripting
- **Vite** 8 — dev server & build tool
- **Tailwind CSS** 4 & SCSS (9.7%) — styling
- **Lucide React** 1 — icon library

### Backend & Database

- **Supabase** — hosted PostgreSQL+API
- **PLpgSQL** — PostgreSQL functions/stored procedures
- **Supabase Auth** — authentication

### Tools & Testing

- **Vitest** 4 — unit testing
- **Prettier** 3, **ESLint** 10 — code quality
- **GitHub Actions** — CI/CD
- **GitHub Pages** — deployment

---

## 🔢 Versions

- **Node.js**: 16+ (required)
- **TypeScript**: ^6.0.3
- **React**: ^19.2.6
- **Vite**: ^8.0.14
- **TailwindCSS**: ^4.3.0
- **Supabase JS**: ^2.106.1
- **Vitest**: ^4.1.7

---

## 🚀 Quick Start

### Prerequisites

```
Node.js v16+ | npm or yarn
```

### Installation & Development

```bash
# Clone and install
git clone https://github.com/Moleesh/HireWise.git
cd HireWise
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Available Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Deploy
npm run build            # Production build
npm run preview          # Preview production build

# Quality Assurance
npm run typecheck        # TypeScript checking
npm run lint             # Code linting
npm run format           # Auto-format code
npm run test             # Run tests
npm run test:watch      # Watch mode testing
```

---

## 📦 Project Architecture

```
src/
├── features/           # Feature modules
│   ├── auth/          # Authentication & login
│   ├── dashboard/     # Main dashboard
│   ├── jobs/          # Job management
│   ├── candidates/    # Candidate management
│   ├── rankings/      # Candidate ranking
│   ├── reports/       # Candidate table reports and reusable exports
│   └── settings/      # User settings
├── shared/            # Reusable components & utilities
│   ├── components/    # Shared UI components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions
└── test-setup.ts      # Test configuration
```

---

## 🔄 CI/CD & Deployment

### Automated Workflow

✅ Every push to `main` automatically:

1. Installs dependencies
2. Runs TypeScript checks
3. Builds the application
4. Deploys to GitHub Pages

**Workflow File**: `.github/workflows/main.yml`  
**Status**: [View Actions](https://github.com/Moleesh/HireWise/actions)  
**Live**: [Moleesh.github.io/HireWise](https://Moleesh.github.io/HireWise/)

### GitHub Pages Routing

- App is deployed under base path `/HireWise`.
- Build emits `dist/404.html` as an SPA fallback so deep links (for example `/HireWise/candidates`) reload correctly on GitHub Pages.

---

## 🤝 Contributing

We love contributions! Here's how to get started:

```bash
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m '✨ Add amazing feature'

# Push to GitHub
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📊 Performance Metrics

- ⚡ **Build Time**: < 10 seconds
- 📦 **Bundle Size**: Optimized for production
- 🎯 **Lighthouse Score**: 90+
- 🔄 **Type Coverage**: 100%

---

## 🐛 Issues & Support

Found a bug or have a feature request? [Open an Issue](https://github.com/Moleesh/HireWise/issues)

---

## 📄 License

This project is **private** and proprietary.

---

<div style="text-align: center;">

**[⬆ back to top](#-hirewise)**

Built with ❤️ by the HireWise Team

</div>
