# Zeromade Backend

Node.js + Express API for Zeromade clothing website.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `MONGO_URI` or `MONGODB_URI` – MongoDB connection (e.g. `mongodb://127.0.0.1:27017/zeromade`)
   - `JWT_SECRET` – Strong secret for JWT (change in production)
   - `CLIENT_URL` – Frontend origin (e.g. `http://localhost:3000` or `http://localhost:3001`)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Server runs on `http://localhost:5000` by default.

## First admin user (backend only)

Admins are **never** created from the frontend or signup. Use the seeding script:

```bash
# From project root
node backend/seedAdmin.js

# Or from backend/
node seedAdmin.js
```

- Connects to MongoDB using `.env` (`MONGO_URI` or `MONGODB_URI`).
- If an admin already exists → exits safely (no duplicate).
- If not → creates **one** admin with hashed password and `role: "admin"`.
- Default placeholder credentials (change after first login):
  - Email: `admin@zeromade.com`
  - Password: `Admin@123`

**Change admin password later:** update in MongoDB (re-hash with bcrypt), or add a “change password” API for logged-in admin and call it after first login.

## API overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- **Products:** `GET /api/products`, `GET /api/products/:id`, `POST/PUT/DELETE /api/products` (admin)
- **Materials:** `GET /api/materials`, `POST /api/materials` (admin)
- **Users:** `GET /api/users` (admin only)

Security: Helmet, CORS, rate limiting, JWT in HTTP-only cookie, bcrypt, express-validator.

## Troubleshooting: "Failed to fetch"

- **Backend running:** Ensure `npm run dev` is running in `backend/` (port 5000).
- **CORS:** In development, backend allows `http://localhost:3000` and `http://localhost:3001`. Set `CLIENT_URL` to your frontend origin if you use another port.
- **Frontend API URL:** Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in frontend `.env.local` (or leave default).
- **MongoDB:** Ensure MongoDB is running and `MONGO_URI` / `MONGODB_URI` in `.env` is correct.
