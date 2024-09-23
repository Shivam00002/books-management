# Book Management Application

This project is a full-stack application for managing books, built with Next.js, Tailwind CSS, and TypeScript for the front end, and Express.js with Node.js for the backend. The application allows users to sign up, log in, and create their own book entries.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Setting up the Server](#setting-up-the-server)
  - [Setting up the Client](#setting-up-the-client)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## Features

1. User authentication (signup and login)
2. Book management (create, read, update, delete)
3. Responsive user interface
4. Input validation with error handling
5. JSON state dump functionality

## Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

### Setting up the Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add the following environment variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```

### Setting up the Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the client directory and add the following environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and visit `http://localhost:3000` to access the application.

## Project Structure

```
project-root/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
└── server/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── package.json
    └── server.js
```

## API Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- GET /api/books - Get all books for a user
- POST /api/books - Create a new book
- PUT /api/books/:id - Update a book
- DELETE /api/books/:id - Delete a book

## Database

This project uses MongoDB as the database. Make sure you have a MongoDB instance running and update the `MONGODB_URI` in the server's `.env` file.

## Deployment

- Backend API: Deployed on Vercel
- Frontend: Deployed on Vercel

To deploy your own instance:

1. Set up a Vercel account and install the Vercel CLI.
2. Configure your environment variables in the Vercel dashboard.
3. Deploy the server:
   ```bash
   cd server
   vercel
   ```
4. Deploy the client:
   ```bash
   cd client
   vercel
   ```
