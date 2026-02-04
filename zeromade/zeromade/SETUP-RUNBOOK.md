# Zeromade — Get Admin & User Login Working

Follow these steps so both **admin login** and **user login** work when you run the site and DB.

**Quick start (after MongoDB is running):**
```powershell
cd zeromade
.\start-all.ps1
```

---

## Step 1: MongoDB (required first)

MongoDB must be running before backend or seed.

**Windows:** Start MongoDB service or run `mongod`
```powershell
net start MongoDB
# Or if installed as standalone: mongod
```

**Mac/Linux:** `mongod` or `brew services start mongodb-community`

**Cloud:** Use MongoDB Atlas and set `MONGO_URI` in `backend/.env` to your Atlas connection string.

---

## Step 2: Backend

```bash
cd zeromade/backend
cp .env.example .env
```

Edit `.env` and set:

- `MONGO_URI` or `MONGODB_URI` — e.g. `mongodb://127.0.0.1:27017/zeromade`
- `JWT_SECRET` — any strong secret
- `CLIENT_URL` — e.g. `http://localhost:3001` (match your frontend port)

```bash
npm install
npm run dev
```

Backend should run on **port 5000**.

---

## Step 3: Create Admin (one-time)

In a new terminal:

```bash
cd zeromade/backend
node seedAdmin.js
```

You should see: `Admin created successfully.`

Admin credentials:

- **Email:** `admin@zeromade.com`
- **Password:** `Admin@123`

---

## Step 4: Frontend

```bash
cd zeromade/frontend
cp .env.local.example .env.local
```

Edit `.env.local` and set (if needed):

- `NEXT_PUBLIC_API_URL=http://localhost:5000`

```bash
npm install
npm run dev
```

Frontend should run on **port 3001** (or 3000 if you changed it).

---

## Step 5: Test Logins

### User login

1. Open `http://localhost:3001/login`
2. Click **Sign up**
3. Enter name, email, password → Sign up
4. You are logged in as **User** and redirected to `/`
5. Log out (or open `/login` again)
6. Select **Login as: User**
7. Enter the same email and password → Login
8. You should be redirected to `/`

### Admin login

1. Open `http://localhost:3001/login`
2. Select **Login as: Admin**
3. Email: `admin@zeromade.com`
4. Password: `Admin@123`
5. Click **Login**
6. You should be redirected to `/admin/dashboard`

---

## Summary

| Login type | How to get account | Login as dropdown |
|------------|--------------------|-------------------|
| **User**   | Sign up on `/login` | User              |
| **Admin**  | Run `node seedAdmin.js` | Admin         |

Once both logins work, you can proceed with future work.
