# Deployment Guide: Rental Management App

This guide will help you deploy your rental management application with:
- Frontend (Next.js) on Vercel
- Backend (Express.js) on Render
- Database (PostgreSQL) on Render

## Prerequisites

1. GitHub account (already set up)
2. Vercel account (already connected)
3. Render account (free to create at https://render.com)

## Backend Deployment on Render

### Step 1: Update Prisma Schema for PostgreSQL

First, we need to update your Prisma schema to use PostgreSQL instead of SQLite:

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... rest of your models remain the same
```

### Step 2: Update Environment Variables

Create a `.env.production` file in your backend directory:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Step 3: Deploy to Render

1. Go to https://render.com and sign up/sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - Name: rental-management-backend
   - Region: Choose the closest to your users
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - DATABASE_URL: (will be set after creating database)
   - JWT_SECRET: your-super-secret-jwt-key-change-this
6. Click "Create Web Service"

### Step 4: Set up PostgreSQL Database on Render

1. Click "New" → "PostgreSQL"
2. Choose a name (e.g., rental-management-db)
3. Select Free tier
4. Click "Create Database"
5. Once created, copy the "External Database URL"
6. Go back to your web service settings
7. Update the DATABASE_URL environment variable with the copied URL
8. Click "Save Changes"

### Step 5: Run Database Migrations

After deployment, you'll need to run your Prisma migrations:

1. Install Render CLI: `npm install -g render-cli`
2. Login: `render login`
3. Find your service: `render services`
4. Run migrations: `render run <service-id> -- npx prisma migrate deploy`

### Step 6: Create Admin User

After migrations are complete:

1. SSH into your Render service or use the console
2. Run: `node createAdminUser.js`

## Frontend Configuration

### Update Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your rental-management-app project
3. Go to Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_API_URL` = `https://your-render-backend-url.onrender.com`

### Redeploy Frontend

1. Go to your project deployments
2. Click "Redeploy" to apply the new environment variable

## Migration from SQLite to PostgreSQL

If you have existing data in SQLite that you want to migrate:

1. Export data from SQLite:
   ```bash
   sqlite3 backend/prisma/dev.db .dump > backup.sql
   ```

2. After setting up PostgreSQL on Render, you can import the data using tools like pgloader or manually recreate the records.

## Cost Considerations

- Render Free Tier: $0/month (with limitations)
- Render Starter Plan: $7/month (recommended for production)
- PostgreSQL Free Tier: $0/month (500MB storage, sleeps after inactivity)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Database Connection**: Verify DATABASE_URL is correctly set
3. **Environment Variables**: Check that all required variables are set in Render

### Checking Logs:

1. Go to your Render dashboard
2. Select your web service
3. Click "Logs" to view real-time logs

## Scaling

When you need to upgrade:
1. Go to your Render dashboard
2. Select your services
3. Click "Upgrade Plan"
4. Choose the appropriate tier based on your usage

This setup should cost $0-7/month for the first year with Render's free tier offerings.
