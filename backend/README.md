# InfraPM API - Backend Guide

This is the `.NET 8` ASP.NET Core REST API backend for the Infrastructure Project Management system.

## 1. Database Creation (PostgreSQL)

You have two options to create the database:

### Option A: Apply the pre-generated SQL Script (Recommended)
1. Ensure your PostgreSQL server is running.
2. Connect to your PostgreSQL server via `psql` or pgAdmin.
3. Create a database named `InfraPM`.
4. Run the idempotent script located at `backend/DatabaseSchema.sql` against the new database.

### Option B: Use Entity Framework Core CLI
If you have `dotnet-ef` installed locally:
1. Open terminal in the `backend/` directory.
2. Run `dotnet ef database update`.
*(Note: Ensure your `appsettings.json` or `Program.cs` default connection string points to a valid PostgreSQL instance).*

## 2. API Endpoints

Once the database is running, start the server using `dotnet run`. The application will start on a local port (e.g. `http://localhost:5000`).

### Swagger Documentation
Navigate to `http://localhost:<PORT>/swagger` in your browser to view and test all available endpoints using the auto-generated Swagger UI.

### Available Endpoints (Phase 4 Snapshot):
- `GET /api/projects` - Retrieves all Umbrella/Mega projects along with a lightweight nested list of their Sub-projects.
- `GET /api/projects/{id}` - Retrieves a specific project.
- `POST /api/projects` - Creates a new Mega or Sub-project. Pass `parentProjectId` to link a sub-project.
- `GET /api/auditlogs` - Retrieves the system audit logs (historical JSONB tracking).

## 3. Coming in Phase 5
- JWT Authentication and Role-Based Access Control endpoints (Login, Create User).
- Integration testing with the Next.js frontend.
