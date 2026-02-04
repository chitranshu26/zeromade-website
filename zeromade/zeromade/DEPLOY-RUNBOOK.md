# Deploy Zeromade to Vercel

This guide will help you deploy the **Backend** (Express) and **Frontend** (Next.js) to Vercel.
Since Vercel is stateless, we will use **MongoDB Atlas** for the database.

---

## Part 1: MongoDB Atlas (Database)

1.  **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  **Create Cluster:** Create a **FREE** shared cluster (e.g. AWS).
3.  **Create User:** In **Database Access**, create a user (e.g. `zeromade_admin` / `password123`).
4.  **Allow Access:** In **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere) so Vercel can connect.
5.  **Get Connection String:**
    - Click **Connect** -> **Drivers** -> **Node.js**
    - Copy the string. It looks like:
      `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    - Replace `<username>` and `<password>` with your actual credentials.

**Save this string!** You will need it as `MONGO_URI`.

---

## Part 2: Deploy Backend

1.  **Push Code:** Ensure your code is pushed to GitHub.
2.  **Vercel Dashboard:** Go to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3.  **Import Repo:** Select your `Zeromade` repository.
4.  **Configure Project:**
    - **Root Directory:** Select the specific folder `zeromade/backend`.
    - **Framework Preset:** Other (or leave default).
    - **Environment Variables:**
        - `MONGO_URI` = (Your Atlas connection string)
        - `JWT_SECRET` = (Any random secret string)
        - `CLIENT_URL` = `https://<your-frontend-project>.vercel.app` (You don't have this yet, you can update it later).
        - `NODE_ENV` = `production`
5.  **Deploy:** Click Deploy.
6.  **Get URL:** Once finished, copy the domain (e.g., `https://zeromade-backend.vercel.app`).

---

## Part 3: Deploy Frontend

1.  **Vercel Dashboard:** Click **Add New** -> **Project**.
2.  **Import Repo:** Select the same `Zeromade` repository *again*.
3.  **Configure Project:**
    - **Root Directory:** Select `zeromade/frontend`.
    - **Framework Preset:** Next.js.
    - **Environment Variables:**
        - `NEXT_PUBLIC_API_URL` = (Your **Backend URL** from Part 2, e.g., `https://zeromade-backend.vercel.app`)
4.  **Deploy:** Click Deploy.

---

## Part 4: Final Connect

1.  Go back to your **Backend Project** in Vercel.
2.  Go to **Settings** -> **Environment Variables**.
3.  Add/Edit `CLIENT_URL` and set it to your **Frontend URL** (e.g., `https://zeromade-frontend.vercel.app`).
4.  **Redeploy** the Backend (Go to Deployments -> Redeploy latest) for the change to take effect.

---

## Part 5: One-Time Setup (Admin)

Since we can't run `seedAdmin.js` easily in production:

1.  Open your **Frontend URL**.
2.  Go to `/login` -> **Sign up**.
3.  Create a user (e.g., `admin@zeromade.com`).
4.  Go to **MongoDB Atlas** -> **Browse Collections**.
5.  Find the `users` collection.
6.  Find your user and edit the field `role`: change `"user"` to `"admin"`.
7.  Click **Update**.
8.  Log out and log back in as **Admin**.
