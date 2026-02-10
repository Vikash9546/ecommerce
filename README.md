# Lumina Premium Ecommerce

A premium, minimalist e-commerce platform built with React, Node.js, and MongoDB.

## Deployment on Render (Separate Services)

You can deploy the frontend and backend as two distinct services on Render for better performance and separation.

### 1. Backend (Web Service)
- **Repo**: This repo
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB string
  - `JWT_SECRET`: Your secret key
  - `FRONTEND_URL`: `https://your-frontend-link.onrender.com`
  - `NODE_ENV`: `production`

### 2. Frontend (Static Site)
- **Repo**: This repo
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://your-backend-link.onrender.com/api`

## Local Development
...

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
