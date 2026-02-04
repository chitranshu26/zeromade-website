# Zeromade – Full-stack clothing website

Full-stack app: Next.js frontend + Node.js/Express backend + MongoDB.

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, CLIENT_URL (e.g. http://localhost:3001)
npm install
npm run dev
```

Runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Optional: set NEXT_PUBLIC_API_URL=http://localhost:5000 (default)
npm install
npm run dev
```

Runs at `http://localhost:3001`.

### 3. First admin user

1. Open `http://localhost:3001/login` and **Sign up** with any email/password.
2. In MongoDB: `db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })`
3. Log in again; you’ll be redirected to **Admin Dashboard**.

## Structure

- **backend/** – Express API, MongoDB, JWT auth, admin-only routes.
- **frontend/** – Next.js app; shop and product pages use the API; login/signup and admin dashboard wired to backend.

See `backend/README.md` for API details and security notes.
