# Environment Setup Guide

## Overview
This guide explains how to set up environment variables for the Shadow Report Alliance application. All sensitive configuration values are stored in environment files to keep them secure and out of version control.

## Prerequisites
- Node.js and npm installed
- Access to Supabase project credentials
- A secure method to generate random secrets

## Frontend Environment Setup

### 1. Create `.env` file in the root directory
Copy the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```

### 2. Configure Supabase credentials
Edit the `.env` file and add your Supabase project details:
```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

To find these values:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

## Backend Environment Setup

### 1. Create `.env` file in the server directory
```bash
cd server
cp .env.example .env
```

### 2. Generate a secure JWT secret
Generate a secure random string for JWT signing:
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[System.Convert]::ToBase64String((1..32 | ForEach {Get-Random -Maximum 256}))
```

### 3. Configure server environment
Edit `server/.env`:
```
JWT_SECRET=your_generated_jwt_secret
PORT=3001
```

## Environment Variables Reference

### Frontend Variables (Vite)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

### Backend Variables
- `JWT_SECRET`: Secret key for signing JWT tokens (keep this secure!)
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/shadowReport)
- `CORS_ORIGIN`: Allowed CORS origin for frontend (default: http://localhost:8085)

## Security Best Practices

1. **Never commit `.env` files**: These files are excluded in `.gitignore`
2. **Use strong secrets**: Generate random strings for JWT_SECRET
3. **Rotate secrets regularly**: Change JWT_SECRET periodically
4. **Different environments**: Use different credentials for development/production
5. **Secure storage**: Store production credentials in a secure vault

## Troubleshooting

### Missing environment variables error
If you see errors about missing environment variables:
1. Ensure `.env` files exist in correct locations
2. Check that variable names match exactly
3. Restart the development servers after changing `.env` files

### Vite not loading environment variables
- Variable names must start with `VITE_`
- Restart the dev server after changes
- Clear browser cache if values seem cached

### Server JWT errors
- Ensure JWT_SECRET is set and not empty
- Check that the secret is the same across all server files
- Verify dotenv is installed: `npm install dotenv`

## Production Deployment

For production deployments:
1. Set environment variables in your hosting platform
2. Never use the example values in production
3. Use strong, unique secrets
4. Enable HTTPS for all API endpoints
5. Consider using a secrets management service 