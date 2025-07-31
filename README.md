# Internal Management System — Full-Stack Business Operations Platform

A professional-grade **full-stack application**, built with **React.js** (Frontend) and **Node.js + Express** (Backend), simulating a real internal company tool for **task delegation**,
**user communication**, and **role-based access control**.

> Designed as a polished portfolio piece — showcasing clean architecture, live file-based persistence, and full UI/UX responsiveness — optimized for both human and AI screening.


##  Tech Stack & Architecture

- **Frontend:** React.js (Hooks-based, component-driven design)
- **HTTP Client:** Axios for clean, promise-based API interaction
- **Backend:** Node.js + Express REST API
- **Storage:** File-system persistence using Node’s `fs` module with JSON simulation (`users.json`, `tasks.json`, `messages.json`)
- **Drag & Drop:** Native HTML5 API with custom logic — no external libraries
- **Styling:** Custom CSS, responsive-ready layout, animated feedback
- **Role-Based Logic:** Dynamic render logic for `Admin` vs `Employee` views


## Core Features

### Authentication & Role-Based Access
- Secure login with two roles: `Admin (Boss)` and `Employee`
- UI and functionality dynamically change based on user role

### Task Assignment Workflow
- Admins create tasks with title, description, and deadline
- Assign tasks via **drag-and-drop** onto employee cards
- Deadline-aware styling: auto‑highlight overdue or urgent tasks in red
- Task lifecycle: Assigned → Marked as Done by Employee → Approved by Admin

### Bi-Directional Messaging System
- **All users can message anyone**, peer-to-peer internal communication
- Supports:
  - Subject and message body
  - Read/unread tracking
  - Reply with auto-prefixed subject ("Re: …")
  - **Notification indicators**: blinking red dot in navbar/profile menu
  - Modal-based message viewer with reply/cancel options
  - Structured threaded message flow using JSON storage

### Employee Directory & Profile Pages
- Searchable employee list by name  
- Profile cards show picture, name, position, and messaging option
- Personal profile page includes:
  - Image, name, role
  - Assigned task list (or a friendly “Everything is done! 😊” message)
  - Message inbox with color-coded status:
    - 🔴 Unread
    - ⚪ Read but no reply
    - 🟢 Replied

### UX & Navigation
- Clear **navbar with burger menu** offering access to Dashboard, Profile, Directory, Logout
- Smooth transitions, hover effects, notifications
- UI optimized for desktop and minimal responsive behavior (flex-wrap, max-width logic)

## Why This Project Stands Out

> “Not just a to‑do app: a full‑blown internal collaboration platform.”

- Demonstrates **full-stack fluency** (React + Axios + Node + Express + fs)
- Showcases **role-based access control**, conditional rendering, and secure UI logic
- Implements **drag-and-drop UX** with minimal dependencies
- Messaging system with read status, threading, notifications
- Backend file-based persistence simulating database behavior without external dependencies
- Ready to scale toward JWT authentication, bcrypt hashing, real databases (MongoDB, PostgreSQL)


## Recruiter-Driven Skill Highlights

People searching for **Frontend Developer**, **Backend Developer**, or **Full‑Stack Engineer** will find:

- `React`, `Redux`, style state management with hooks  
- `Express`, `REST API`, `Axios`, `CRUD operations`  
- `Role-based authentication`, `file system I/O`  
- `Task lifecycle`, `drag-and-drop UI logic`, `message notification system`  
- Clean, modular **project structure** and separation of concerns


## Setup & Run Locally

```bash
git clone https://github.com/Code-It-David/internal-management-system-demo.git
cd server
npm install
node server.js
# Open another terminal:
cd ../client
npm install
npm start
```

# Roadmap & Expansion Ideas

- Integrate JWT authentication and bcrypt password hashing
- Move to real database backend (MongoDB, PostgreSQL)
- Add user registration workflow
- Implement dark/light theme switcher
- Allow profile image upload and richer user settings


# About the Developer

Built independently as a career-focused portfolio project, this app reflects:
- Solid architectural thinking in full-stack settings
- UI/UX design with an emphasis on clarity and industry-aligned terminology
- Clean code organization, modular components, full CRUD implementation
- A readiness to integrate enterprise patterns and extend toward production-scale features

If you’re seeking a developer with front-end and back-end fluency (React + Node.js), strong logical thinking, and the ability to build intuitive business workflows —
Let’s connect.

- LinkedIn: https://www.linkedin.com/in/fullstack-craftsman


