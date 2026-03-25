# Lumina Premium Ecommerce

A premium, minimalist e-commerce platform built with React, Node.js, and MongoDB.

## 📝 Description
Lumina is a modern e-commerce solution designed for a seamless shopping experience. It features a clean, responsive interface, robust backend management, and a focus on visual aesthetics and user convenience. Whether you're browsing products, managing your cart, or tracking orders, Lumina provides a fluid and premium feel.

## ✨ Key Features
- **User Authentication**: Secure signup and login with JWT-based authentication.
- **Product Discovery**: Browse a wide range of products with detailed views, high-quality images, and customer reviews.
- **Shopping Cart**: Real-time cart management to add, remove, and update item quantities.
- **Order Management**: Complete checkout process with order history and real-time status tracking.
- **Wishlist**: Save favorite items for later with a dedicated wishlist view.
- **Rating & Reviews**: Share feedback and view ratings from other shoppers to make informed decisions.
- **Profile Management**: Personal user profiles to manage addresses and view order details.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views for a consistent experience.

## 🏗️ System Design
The application follows a **Client-Server Architecture**:
- **Frontend**: A Single Page Application (SPA) built with React, communicating with the backend via RESTful APIs.
- **Backend**: A Node.js and Express server that handles business logic, security, and database interactions.
- **Database**: MongoDB for persistent storage, structured with Mongoose models for data integrity.
- **Authentication**: Secure JWT-based sessions with hashed passwords stored in the database.
- **State Management**: React Context API is used for global state (Auth, Cart) to ensure data consistency across the app.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide-React, Framer Motion.
- **Backend**: Node.js, Express.js, Mongoose, JWT.
- **Database**: MongoDB.
- **Deployment**: Render (Static Site for Frontend, Web Service for Backend).

## 📁 Folder Structure & File Functionality

### 🖥️ Frontend (`/frontend`)
The frontend is built with **React**, **Vite**, and **Tailwind CSS**.

- **`src/api/`**: Contains `api.js` for Axios configuration and centralized API request functions.
- **`src/components/`**: Reusable UI components like `Navbar`, `Footer`, and common elements.
- **`src/context/`**: React Context for global state management (e.g., `AuthContext`, `CartContext`).
- **`src/pages/`**: Individual page components representing routes:
  - `Home.jsx`: The landing page with featured products and hero sections.
  - `ProductDetail.jsx`: Detailed view for a single product with reviews and variants.
  - `Cart.jsx`: User's shopping cart management.
  - `Checkout.jsx`: Multistep checkout process and payment integration.
  - `Auth/`: Login and Signup pages.
  - `Profile.jsx`: User profile, order history, and address management.
- **`src/assets/`**: Images, icons, and static resources.
- **`src/App.jsx`**: Main routing logic and application wrapper.
- **`src/main.jsx`**: Entry point for the React application.

### ⚙️ Backend (`/backend`)
The backend is a **Node.js** and **Express** server using **MongoDB** (Mongoose).

- **`src/configs/`**: Database connection and other configuration files.
- **`src/controllers/`**: Logical handlers for each route:
  - `authController.js`: User authentication logic (signup, login).
  - `productController.js`: Operations for fetching and managing products.
  - `cartController.js`: Operations for adding or removing items from the cart.
  - `orderController.js`: Logic for processing and retrieving orders.
  - `reviewController.js`: Managing product reviews and ratings.
- **`src/models/`**: Mongoose schemas defining the structure of data in MongoDB:
  - `User.js`, `Product.js`, `Cart.js`, `Order.js`, `Review.js`, `Wishlist.js`.
- **`src/routes/`**: API endpoint definitions that link URLs to controller functions.
- **`src/middleware/`**: Custom middleware for authentication and error handling.
- **`src/app.js`**: Main Express app setup, connecting middleware and routes.
- **`server.js`**: Entry point that starts the server listening on a port.
- **`bulkSeed.js`**: Script to seed the database with initial product and user data.

## 🚀 Getting Started

### 📦 Local Development

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 🌍 Deployment on Render (Separate Services)

#### 1. Backend (Web Service)
- **Repo**: This repo
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB connection string
  - `JWT_SECRET`: Your JWT signing secret
  - `FRONTEND_URL`: `https://your-frontend-link.onrender.com`
  - `NODE_ENV`: `production`

#### 2. Frontend (Static Site)
- **Repo**: This repo
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://your-backend-link.onrender.com/api`
