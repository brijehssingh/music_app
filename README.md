# Pulse Music App

Pulse is a complete MERN music streaming project with authentication, artist collections, audio playback, song uploads, search, and personal song management.

## Features

- Create listener or premium accounts
- Secure login with JWT stored in an HTTP-only cookie
- Restore the logged-in session after a page refresh
- Browse artists and open their song collections
- Search songs inside an artist collection
- Play, pause, seek, skip, and control volume
- Upload MP3, WAV, M4A, or OGG files (premium users)
- View and delete your own uploaded songs
- Responsive modern UI for mobile, tablet, and desktop
- Loading, empty, validation, success, and error states

## Tech stack

- Frontend: React 19, Vite, React Router, Zustand, Axios, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer
- Media storage: ImageKit

## Project structure

```text
backendpractice/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── models/
│   │   └── srevices/
│   ├── .env.example
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── store/
    └── .env.example
```

## Setup

### 1. Backend

Open a terminal inside `backend`:

```bash
npm install
```

Copy `.env.example` to `.env`, then add your MongoDB and ImageKit values:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

Open a second terminal inside `frontend`:

```bash
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in the browser.

## Production build

Inside `frontend`:

```bash
npm run lint
npm run build
```

For cross-site frontend/backend deployment, set `NODE_ENV=production`, add the deployed frontend URL to `CLIENT_ORIGIN`, and use HTTPS so the secure authentication cookie works.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Restore current user |
| GET | `/api/auth/artists` | List artists |
| GET | `/api/auth/artistSongs/:id` | Get an artist's songs |
| GET | `/api/auth/allsong` | Get all songs |
| GET | `/api/auth/getMySongs` | Get logged-in user's songs |
| POST | `/api/auth/upload` | Upload a song |
| DELETE | `/api/auth/deletemusic/:id` | Delete an owned song |
| GET | `/api/auth/searchSongs/:id?query=` | Search an artist's songs |

## Important

Do not commit `.env` files. They contain database, JWT, and media-storage secrets. Use the included `.env.example` files when sharing or deploying the project.
