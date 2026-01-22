# Civora Backend

A comprehensive GraphQL backend for the Civora food delivery platform built with Node.js, Express, Apollo Server, and MongoDB.

## Features

- **GraphQL API**: Complete GraphQL schema with queries, mutations, and subscriptions
- **Authentication**: JWT-based authentication for users, restaurants, and riders
- **Real-time Updates**: WebSocket subscriptions for order status and rider location updates
- **MongoDB**: NoSQL database with Mongoose ODM
- **India-focused**: Pre-configured with Indian cities and INR currency
- **Payment Integration**: Stripe payment processing setup
- **SMS Notifications**: Twilio integration for SMS alerts
- **File Upload**: Support for restaurant images and food photos
- **Admin Panel**: APIs for restaurant and order management

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: WebSocket/GraphQL Subscriptions
- **Payments**: Stripe
- **SMS**: Twilio
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository and navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Seed the database with initial data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8001/graphql`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=8001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/civora

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps
GOOGLE_MAPS_API_KEY=...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## API Endpoints

### GraphQL Playground
- **URL**: `http://localhost:8001/graphql`
- **WebSocket**: `ws://localhost:8001/graphql`

### Health Check
- **URL**: `http://localhost:8001/health`
- **Method**: GET

## Database Schema

### Core Entities
- **Users**: Customer accounts
- **Restaurants**: Restaurant profiles and menus
- **Riders**: Delivery personnel
- **Orders**: Order management
- **Foods**: Menu items with variations and addons
- **Categories**: Food categories
- **Countries/Cities**: Location management
- **Reviews**: Customer feedback

### Key Features
- User authentication and profiles
- Restaurant menu management
- Order placement and tracking
- Real-time order status updates
- Rider location tracking
- Payment processing
- Review and rating system

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Seed database
npm run seed
```

### Project Structure

```
src/
├── config/          # Database and configuration
├── graphql/         # GraphQL schema and resolvers
├── middleware/      # Authentication middleware
├── models/          # MongoDB models
├── scripts/         # Database seeding scripts
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## GraphQL Schema

The API provides comprehensive queries and mutations for:

- **Authentication**: Register, login, profile management
- **Location**: Countries, cities, zones
- **Restaurants**: Restaurant listings, menus, categories
- **Orders**: Order placement, tracking, history
- **Riders**: Rider management and location tracking
- **Reviews**: Customer feedback system
- **Admin**: Configuration and management APIs

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure Stripe for live payments
5. Set up Twilio for SMS
6. Configure email service
7. Set up proper logging and monitoring

### Docker Support

Add Dockerfile and docker-compose.yml for containerized deployment.

## Contributing

1. Follow TypeScript and GraphQL best practices
2. Write tests for new features
3. Update documentation
4. Follow conventional commit messages

## License

This project is proprietary software for Civora.