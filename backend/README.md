# Node.js Express Backend API

This is the backend API for the Node React application, built with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables:
   - Copy `.env.development` to `.env` for development:
     ```
     cp .env.development .env
     ```
   - Or use `.env.production` for production:
     ```
     cp .env.production .env
     ```
   - Update the database connection string and other variables as needed

5. Set up the database and run migrations:
   ```
   npm run db:setup-migrations
   ```

## Running the Application

### Development Mode
```
npm run start:dev
```

### Production Mode
```
npm run start:prod
```

### Default Mode
```
npm start
```

## Available Scripts

- `npm start` - Start the server
- `npm run start:dev` - Start the server in development mode
- `npm run start:prod` - Start the server in production mode
- `npm test` - Run tests
- `npm run db:setup-migrations` - Set up database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:reset` - Reset the database (caution: this will delete all data)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### API Keys
- `GET /api/api-keys` - Get all API keys
- `GET /api/api-keys/:id` - Get API key by ID
- `POST /api/api-keys` - Create API key
- `PUT /api/api-keys/:id` - Update API key
- `DELETE /api/api-keys/:id` - Delete API key

## Project Structure

```
backend/
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── repositories/    # Data access layer
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Request validation schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── scripts/             # Utility scripts
├── logs/                # Application logs
├── .env                 # Environment variables
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
└── package.json         # Project dependencies
```
