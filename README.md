# Rental Management Application

A full-stack rental property management system built with modern web technologies. This application allows property owners, managers, and tenants to manage properties, leases, and tenant information efficiently.

## Features

- **User Authentication**: Role-based authentication system (Admin, Staff, Owner, Tenant)
- **Property Management**: Add, edit, and view property details
- **Tenant Management**: Manage tenant information and profiles
- **Lease Management**: Create and track lease agreements
- **Return Analysis**: Analyze property investment returns
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

### Frontend
- **Next.js 15** - React framework for production
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management

## Project Structure

```
├── backend/
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── prisma/          # Database schema and migrations
│   └── index.js         # Server entry point
└── frontend/
    ├── src/
    │   ├── app/         # Next.js app router pages
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React context providers
    │   ├── store/       # State management
    │   ├── config/      # Configuration files
    │   └── types/       # TypeScript types
    └── next.config.ts   # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Create an admin user:
   ```bash
   node createAdminUser.js
   ```

5. Start the server:
   ```bash
   npm start
   ```
   
   The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=3001
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=file:./dev.db
```

### Frontend (.env.local)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API Endpoints

- **Auth**: `/api/auth` - User authentication
- **Properties**: `/api/properties` - Property management
- **Tenants**: `/api/tenants` - Tenant management
- **Leases**: `/api/leases` - Lease management

## Authentication

The application uses JWT tokens for authentication. Users are assigned roles:
- **Admin**: Full access to all features
- **Staff**: Property and tenant management
- **Owner**: Property management
- **Tenant**: Personal profile and lease information

## Development

### Database Migrations

To create a new migration:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

To view the database:
```bash
npx prisma studio
```

## Deployment

### Backend Deployment

1. Set environment variables for production
2. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

Or deploy to Vercel:
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
