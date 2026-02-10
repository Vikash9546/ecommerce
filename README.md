# Lumina Premium Ecommerce

A premium, minimalist e-commerce platform built with React, Node.js, and MongoDB.

## Deployment on Render

This project is configured for a single-service deployment on Render.

### Prerequisites
- A MongoDB database (e.g., MongoDB Atlas).
- A Render account.

### Steps
1. **Create a New Web Service**: Connect your GitHub repository.
2. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A long, random string.
   - `NODE_ENV`: `production`
   - `PORT`: 5001 (or any port, Render will provide one)
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

## Local Development

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
