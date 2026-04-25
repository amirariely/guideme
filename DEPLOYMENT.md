# GuideMe — Deploy Frontend + Backend to Render (Free)

5-minute deployment guide for the web app and landing page.

---

## What Gets Deployed

✅ Express Backend API + PostgreSQL
✅ React Frontend App  
✅ Your Custom Landing Page

---

## Before You Start

### 1. Push to GitHub

```bash
cd guideme
git init
git add .
git commit -m "GuideMe - Ready to deploy"
git remote add origin https://github.com/YOUR_USERNAME/guideme.git
git push -u origin main
```

### 2. Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the output.

---

## Deploy (5 Steps)

### Step 1: Create Render Account

https://render.com → Sign up with GitHub → Authorize

### Step 2: Deploy Backend

1. Click **New +** → **Web Service**
2. Select your `guideme` repo
3. Fill in:
   - **Name:** `guideme-backend`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm run start`
   - **Plan:** Free
4. Click **Create Web Service** ✅

### Step 3: Create Database

1. Click **New +** → **PostgreSQL**
2. **Name:** `guideme-db`
3. **Plan:** Free
4. **Copy the DATABASE_URL** from the connection details

### Step 4: Add Environment Variables

In your `guideme-backend` service:

1. Go to **Environment**
2. Add these variables:

```
DATABASE_URL = (paste from Step 3)
JWT_SECRET = (paste from Pre-Deployment Step 2)
ANTHROPIC_API_KEY = (your Anthropic API key)
NODE_ENV = production
```

Service auto-redeploys ✅

### Step 5: Deploy Frontend + Landing Page

1. Click **New +** → **Static Site**
2. Select your `guideme` repo
3. Fill in:
   - **Name:** `guideme-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Click **Create Static Site** ✅

---

## Update API URL

Edit `frontend/.env`:

```
VITE_API_URL=https://guideme-backend.onrender.com
```

Push the change:

```bash
git add frontend/.env
git commit -m "Update production API URL"
git push
```

Frontend auto-rebuilds on Render ✅

---

## Test It

```bash
# Backend should be running
curl https://guideme-backend.onrender.com/api/auth/me

# Frontend should load
open https://guideme-frontend.onrender.com

# Landing page
open https://guideme-landing.onrender.com
```

---

## Run Database Migrations

In Render dashboard for `guideme-backend`:

1. Click **Shell**
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

Or edit `backend/package.json` to auto-migrate on start:
```json
{
  "scripts": {
    "start": "npx prisma migrate deploy && node src/index.js"
  }
}
```

---

## Your Live URLs

- **Landing Page:** https://guideme-landing.onrender.com
- **App:** https://guideme-frontend.onrender.com
- **Backend API:** https://guideme-backend.onrender.com

---

## Optional: Custom Domain

Buy a domain, then in Render for each service:
- **Settings** → **Custom Domains** → Add your domain
- Follow DNS instructions

---

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| Compute | 750 hrs/month |
| Database | 1 GB |
| Bandwidth | Unlimited |
| Spin-down | 15 min idle (restart ~30s) |

For production (no downtime): Upgrade to Starter plan ($7+/month per service)

---

**That's it! Your app is live.** 🚀

For help: https://render.com/docs
