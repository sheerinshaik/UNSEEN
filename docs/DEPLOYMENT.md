# UNSEEN — Production Deployment Guide

## 1. Hosting Architecture Overview

UNSEEN is designed for deployment as a unified Node.js full-stack application (where Express serves both the REST API and the optimized static client build from `client/dist`), or as decoupled services (Static Frontend on Vercel/Netlify + Express API on Render/Railway/Fly.io/AWS).

### Recommended Single-Host Deployment (e.g. Render, Railway, AWS ECS, Fly.io):
1. **Frontend**: Built via `npm run build` into `client/dist`.
2. **Backend**: Express server serves `/api/*` and acts as fallback static host for `client/dist/index.html`.
3. **Database**: Managed MongoDB (MongoDB Atlas or DigitalOcean Managed MongoDB).

---

## 2. Environment Variables Checklist

Ensure these variables are configured in your production hosting dashboard:

| Variable | Description | Production Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Listening HTTP port | `5000` (or host assigned) |
| `MONGODB_URI` | Managed MongoDB connection string | `mongodb+srv://unseen_user:PASS@cluster.mongodb.net/unseen_prod` |
| `JWT_SECRET` | Signing secret (min 32 characters) | *Cryptographically random 64-char hex* |
| `SESSION_SECRET` | Session encryption key | *Cryptographically random 64-char hex* |
| `COOKIE_SECURE` | Enable HTTPS-only cookie transmission | `true` |
| `COOKIE_SAME_SITE` | SameSite cookie attribute | `lax` |
| `CLIENT_ORIGIN` | Production domain | `https://unseen.yourdomain.com` |
| `BOOTSTRAP_ADMIN_EMAIL` | Default admin email for bootstrap | `admin@yourdomain.com` |
| `BOOTSTRAP_ADMIN_PASSWORD`| Initial admin password | *Strong temporary password* |

---

## 3. Step-by-Step Production Build & Start

### Step 1: Install dependencies and build client bundle
```bash
npm run install:all
npm run build
```

### Step 2: Bootstrap the initial production administrator
```bash
npm run bootstrap:admin
```
*(Notice: Never seed fictional demo users into a production database. The bootstrap script only provisions the root administrator.)*

### Step 3: Launch production server
```bash
npm start
```

---

## 4. Health Check & Smoke-Test Checklist

Verify deployment health with this checklist:

1. **Health Check Endpoint**:
   ```bash
   curl -i https://your-deployment-domain.com/api/health
   ```
   Must return HTTP 200 with `status: "healthy"` and `database: "connected"`.
2. **Security Headers**:
   Verify response headers contain `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and strict cookie flags.
3. **Session Cookie Isolation**:
   Log in to the web interface and verify the `unseen_session` cookie is marked `HttpOnly` and `Secure`.
4. **Report Submission Verification**:
   Submit a test report and confirm a non-sequential reference (`UNS-XXXX-XXXX-XXXX`) and one-time tracking secret are generated.
5. **Reviewer Queue Isolation**:
   Sign in with a reviewer account and verify the report narrative appears with **zero submitter identity fields**.
