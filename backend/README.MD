# Backend Service

This is the backend service for a news platform built with Node.js, Express, and PostgreSQL.

## Technologies Used

- **Node.js & Express**: Web application framework
- **Prisma**: ORM for database operations
- **PostgreSQL**: Primary database
- **JWT**: Authentication
- **Socket.io**: Real-time notifications
- **Winston & Morgan**: Logging
- **Nodemailer**: Email services
- **Swagger**: API documentation

## Project Structure

```
backend/
├── prisma/                 # Database schema and migrations
├── src/
│   ├── configs/           # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── server.js         # Express app setup
│   └── websocket.js      # WebSocket setup
└── logs/                  # Application logs
```

## Features

- **Authentication System**

  - JWT-based authentication
  - Role-based access control (User, Admin, Journalist)
  - OTP system for registration/password reset

- **Article Management**

  - CRUD operations for articles
  - Categories and tags
  - Draft/publish workflow
  - View counting

- **User Interactions**

  - Comments system
  - Article likes
  - Follow journalists
  - Content reporting

- **Notification System**

  - Real-time notifications via WebSocket
  - Multiple notification types (messages, comments, likes, etc.)

- **Logging & Monitoring**
  - Request logging with Morgan
  - Application logging with Winston
  - Daily rotating log files

## Getting Started

1. **Prerequisites**

   - Node.js (v14 or higher)
   - PostgreSQL
   - npm

2. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   JWT_SECRET="your-jwt-secret"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   ```

3. **Installation**

   ```bash
   # Install dependencies
   npm install

   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database (optional)
   npx prisma db seed
   ```

4. **Running the Server**
   ```bash
   # Development mode with nodemon
   npm start
   ```

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **User**: User accounts with role-based access
- **Article**: News articles with categories and tags
- **Category**: Article categories
- **Tag**: Article tags
- **Comment**: User comments on articles
- **ArticleLike**: Article likes tracking
- **Follow**: Journalist following system
- **Notification**: User notifications
- **Report**: Content reporting system
- **Configuration**: System configuration

## API Structure

- **/auth**: Authentication endpoints

  - POST /register: User registration
  - POST /login: User login
  - POST /refresh-token: Refresh JWT token

- **/articles**: Article management

  - GET /: List articles
  - POST /: Create article
  - GET /:id: Get article details
  - PUT /:id: Update article
  - DELETE /:id: Delete article

- **/users**: User management

  - GET /profile: Get user profile
  - PUT /profile: Update profile
  - GET /:id/articles: Get user's articles

- **/notifications**: Notification management
  - GET /: List notifications
  - PUT /:id/read: Mark notification as read

## WebSocket Events

The application uses Socket.io for real-time features:

- `notification`: New notification
- `online-status`: User online status updates
- `article-update`: Real-time article updates

## Development Guidelines

1. **Code Structure**

   - Follow MVC pattern
   - Use services for business logic
   - Keep controllers thin
   - Use middleware for common operations

2. **Error Handling**

   - Use try-catch in async functions
   - Return consistent error responses
   - Log errors appropriately

3. **Database Operations**

   - Use Prisma transactions for related operations
   - Include necessary relations in queries
   - Optimize queries for performance

4. **Testing**

   - Write unit tests for services
   - Test API endpoints
   - Validate websocket events

5. **Security**
   - Validate all inputs
   - Use middleware for authentication
   - Implement rate limiting
   - Sanitize user data

## Common Issues

1. **Database Connection**

   - Verify DATABASE_URL in .env
   - Check PostgreSQL service status
   - Ensure correct permissions

2. **Email Service**

   - Verify SMTP settings
   - Check email templates
   - Monitor email queue

3. **WebSocket**
   - Check client connection
   - Monitor event emissions
   - Verify authentication
