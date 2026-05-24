# VPS Deployment Guide

Since you already have PostgreSQL running in a container on your Linux VPS, you can easily deploy the InfraPM platform using Docker Compose.

## 1. Prepare the `.env` file
Create a `.env` file in the root of the project directory on your VPS.

```env
# -----------------------------
# Docker Compose Variables
# -----------------------------

# Point this to your existing PostgreSQL container (e.g. Host=postgres-container-ip or the VPS IP)
INFRAPM_DB_CONNECTION=Host=YOUR_POSTGRES_IP;Database=InfraPM;Username=YOUR_PG_USER;Password=YOUR_PG_PASSWORD

# Generate a strong, random 256-bit string here
INFRAPM_JWT_SECRET=super_secret_jwt_key_that_is_at_least_32_characters_long

# The URL where your Next.js frontend will be hosted (for CORS)
FRONTEND_URL=http://YOUR_VPS_IP_OR_DOMAIN:3000

# The default password for the initial Superuser account created on startup
DEFAULT_SUPERUSER_PASSWORD=Admin!2345Enterprise
```

## 2. Deploy using Docker Compose
Ensure Docker and Docker Compose are installed on your Linux VPS.

Run the following command from the root of the project where `docker-compose.yml` is located:

```bash
docker compose up -d --build
```

### What happens next?
1. Docker will build the Next.js `standalone` production image.
2. Docker will build the ASP.NET Core `Release` image.
3. When the ASP.NET backend starts, it will **automatically** connect to your PostgreSQL database, apply the Entity Framework tables, and seed the default Superuser account!

## 3. Login
1. Navigate to `http://YOUR_VPS_IP_OR_DOMAIN:3000/login` in your web browser.
2. Enter the following credentials:
   - **Username:** `admin`
   - **Password:** *Whatever you set in `DEFAULT_SUPERUSER_PASSWORD`*
3. You will immediately have access to the Superuser Dashboard and the User Directory to start inviting your Project Managers and Engineers!