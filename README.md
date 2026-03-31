# EduSchool — HTML Learning Platform

An educational platform for teaching HTML through drag-and-drop blocks. Students learn by assembling HTML tag blocks into web pages, with live preview and AI-protected assignments. Teachers manage classes, assign homework from a bank of 500+ randomized tasks, monitor progress, and grade submissions.

## Features

### Student
- Sign up and join classes by code + password
- View assigned homework with theory blocks
- Build HTML pages using a drag-and-drop block editor
- Live preview of the resulting web page
- Submit work for teacher review
- Receive grades and feedback with block-level annotations

### Teacher
- Create classes with join codes and passwords
- Assign homework from 10 topics with 500+ task variants
- Each student receives a unique randomized task
- Monitor student progress in real-time
- Grade submissions and leave block-level feedback
- View class statistics and export reports

### Editor
- Drag HTML tag blocks from a categorized palette
- Drop into workspace with nested structure support
- Type content inside blocks (headings, paragraphs, links, etc.)
- Set attributes (href, src, alt, type)
- Undo support
- AI-protected: only internal blocks accepted, no code pasting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn/ui v4 |
| Drag & Drop | @dnd-kit/core |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (bcryptjs) |

## Project Structure

```
EduSchool/
├── client/                  # Next.js frontend
│   └── src/
│       ├── app/             # Pages (App Router)
│       │   ├── login/
│       │   ├── register/
│       │   ├── teacher/     # Teacher dashboard pages
│       │   └── student/     # Student dashboard pages
│       ├── components/
│       │   ├── ui/          # shadcn/ui components
│       │   ├── layout/      # Dashboard layout
│       │   └── editor/      # HTML block editor
│       ├── hooks/
│       ├── lib/
│       ├── services/        # API service layer
│       ├── store/           # Zustand stores
│       └── types/
├── server/                  # Express backend
│   └── src/
│       ├── config/          # DB + env config
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Auth, role, error
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routes
│       ├── services/        # Business logic
│       ├── validators/      # Zod schemas
│       ├── utils/
│       ├── seed/            # Task bank seeder
│       └── app.ts           # Entry point
└── package.json             # Root scripts
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- npm

### Installation

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

### Configuration

1. Server: edit `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduschool
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

2. Client: edit `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Seed the Task Bank

```bash
npm run seed
```

This populates the database with 500+ HTML tasks across 10 topics.

### Run in Development

```bash
npm run dev
```

This starts both the server (port 5000) and client (port 3000) concurrently.

### Task Topics
1. HTML Basics
2. Headings
3. Text Formatting
4. Links
5. Images
6. Lists
7. Tables
8. Forms
9. Semantic HTML
10. Div and Span

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get current user

### Classes
- `POST /api/classes` — Create class (teacher)
- `GET /api/classes/teacher` — Get teacher's classes
- `GET /api/classes/teacher/:classId` — Get class detail
- `POST /api/classes/join` — Join class (student)
- `GET /api/classes/student` — Get student's classes

### Homework
- `POST /api/homework` — Create homework (teacher)
- `GET /api/homework/teacher` — Get teacher's homeworks
- `GET /api/homework/student` — Get student's homeworks
- `GET /api/homework/:homeworkId` — Get homework detail
- `GET /api/homework/:homeworkId/monitoring` — Monitor submissions
- `PATCH /api/homework/:homeworkId/close` — Close homework
- `GET /api/homework/topics` — Get available topics

### Submissions
- `GET /api/submissions/homework/:homeworkId` — Get student submission
- `PUT /api/submissions/homework/:homeworkId/save` — Save progress
- `POST /api/submissions/homework/:homeworkId/submit` — Submit work
- `POST /api/submissions/:submissionId/grade` — Grade submission
- `POST /api/submissions/:submissionId/return` — Return for correction
- `GET /api/submissions/stats/class/:classId` — Class statistics
