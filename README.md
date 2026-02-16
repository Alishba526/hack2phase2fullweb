# Todo Web Application - Frontend

This is the frontend for the Todo Web Application, built with Next.js. It connects to a backend API hosted on Hugging Face Spaces.

## Features

- User registration and authentication
- Login/logout functionality
- Dashboard for managing todos
- Responsive design for all device sizes

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Environment Setup

Create a `.env.local` file in the root of the frontend directory with the following:

```env
NEXT_PUBLIC_API_BASE_URL=https://alishba526-alishbarehman.hf.space
BETTER_AUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEON_DATABASE_URL=your-neon-database-url
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Connecting to Backend

The frontend is configured to connect to a backend API hosted on Hugging Face Spaces at:
`https://alishba526-alishbarehman.hf.space`

The authentication service handles communication with the backend for:
- User registration (`POST /auth/register`)
- User login (`POST /auth/login`)
- Getting user info (`GET /auth/me`)

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs the linter

## Deployment

The frontend is designed to be deployed on Vercel. When deploying:

1. Make sure the environment variables are set correctly in your Vercel project settings
2. The `NEXT_PUBLIC_API_BASE_URL` should point to your backend API
3. Ensure CORS settings on the backend allow requests from your Vercel domain

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend allows requests from your frontend domain
2. **API Connection Timeout**: Hugging Face Spaces may take a moment to spin up after inactivity
3. **Authentication Failures**: Verify that the backend is properly configured and accessible

### Verifying Backend Connection

You can test the backend connection using the test script:

```bash
node test_connection.js
```

This will verify that all authentication endpoints are accessible.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)