# Phase 1: Superuser Dashboard Architecture & Planning

## 1. Full Dashboard Architecture
The platform follows an N-Tier, separated presentation architecture:
- **Presentation Layer (Frontend):** Next.js (App Router), React, TypeScript, Tailwind CSS. Implements Server-Side Rendering (SSR) for performance and SEO-like discoverability, with React Query for client-side state/data fetching.
- **Application Layer (Backend API):** ASP.NET Core Web API, strictly enforcing RESTful principles. Handles business logic, role verification, and orchestrates domain services.
- **Data Access Layer:** Entity Framework Core (Code-First) mapping to PostgreSQL.
- **Storage/Media Layer:** Local disk storage with a background task pipeline (e.g., ImageSharp or FFmpeg) for thumbnail generation.
- **Caching Layer (Future):** Redis can be added later for caching hierarchical structures (Regions/Departments).

## 2. UI Layout Structure
The dashboard uses a classic enterprise layout to maximize screen real estate and data visibility.
- **Layout Type:** Fixed Sidebar + Topbar + Scrollable Main Content Area.
- **Behavior:** The layout is responsive. On desktop, the sidebar is fixed and can be collapsed to icon-only. On mobile/tablet, it hides behind a hamburger menu.
- **Theme:** Clean, high-contrast, professional (Light/Dark mode toggleable).

## 3. Sidebar Navigation Structure
Grouped logically for a superuser handling Civil Engineering projects:
- **Dashboard** (Main Overview)
- **Hierarchy Management**
  - Regions & Cities
  - Departments (Including Accounts Branch - Future)
  - Portfolios
- **Project Management**
  - All Projects
  - Map View (OpenStreetMap/Leaflet)
- **User & Access Control**
  - User Directory
  - Roles & Permissions
- **System & Audit**
  - Activity Feed & Logs
  - System Errors & Server Logs
- **Settings**
  - Global Configurations

## 4. Topbar Structure
- **Left:** Branding/Logo and Sidebar Toggle.
- **Middle:** Global Search (Search projects, users, coordinates, or IDs).
- **Right:**
  - System Health/Status Icon (Green/Red based on server logs).
  - Notifications Bell (Pending manager comments, overdue tasks).
  - User Profile Dropdown (My Profile, Sign Out).

## 5. Dashboard Widgets/Cards (Superuser View)
- **Top KPIs (Number Cards):** Total Active Projects, Projects at Risk, Total Users, Open Feedback/Comments.
- **System Health:** CPU/Memory usage, Error Rate (derived from server logs).
- **Recent Activity:** A scrolling ticker of the latest user logins or high-level database changes.
- **Quick Actions:** Create Project, Add User, View Server Logs.

## 6. Analytics Sections
- **Project Distribution:** Bar chart showing Projects by Region/City.
- **Status Overview:** Donut chart of Project Statuses (On Track, Delayed, Completed).
- **Feedback Loop Metrics:** Chart showing the resolution time of Manager Comments (Yellow to Green).

## 7. Table Structures
Enterprise tables must include:
- Server-side Pagination, Sorting, and Filtering.
- Sticky headers.
- **Action Columns:** View, Edit, Delete (Requires comment prompt), Audit History.
- **Row Expansion:** Clicking a Project row expands to show its Subprojects.

## 8. Drill-down Navigation Behavior
- **Breadcrumbs:** Essential for hierarchy (e.g., `Region: North > City: Seattle > Dept: Civil > Portfolio: 2024 > Project: Bridge A > Subproject: Foundation`).
- **Deep Linking:** Every entity view (e.g., a specific project or user) must have a unique URL so superusers can share links directly.

## 9. Recommended Pages/Modules
- **Project Hub:** The main data grid for infrastructure projects.
- **Map Dashboard:** A full-screen Leaflet.js map showing all project coordinates via markers.
- **User Matrix:** Grid showing Users vs. Assigned Roles.
- **Feedback Resolution Center:** Dedicated module to view all "Manager Comments" that are Pending (Yellow) or Resolved (Green).

## 10. User Management Workflow
1. **No self-registration.** Superuser navigates to "Add User".
2. Enters Username, Password (manually generated), Name, and internal Notes.
3. Assigns a primary Role (e.g., Manager, Engineer).
4. User logs in and must change their password on first login (Username remains fixed).

## 11. Role Management Workflow
1. Superuser views a list of standard roles (Admin, Manager, Engineer).
2. Superuser can create Custom Roles.
3. A Custom Role is defined by assigning specific granular permissions from the Permission Matrix.

## 12. Permission Management Workflow
- **Matrix UI:** A grid where Rows are Modules/Actions (e.g., `Project:Create`, `Comment:Resolve`) and Columns are Roles.
- Permissions are strictly evaluated on the ASP.NET Backend using Policy-Based Authorization. The UI simply hides/disables buttons based on the user's JWT claims.

## 13. Project Monitoring Workflow
- Projects are created under a specific node in the hierarchy (Region/City/Dept/Portfolio).
- Optional Subprojects can be added.
- **Feedback Loop:** Managers (View-Only) can drop comments. These default to "Pending" (Yellow ✓). Admins/Engineers act on them and mark them "Resolved" (Green ✓) or "Rejected" (with admin remarks).
- **Media Pipeline:** Users upload "Before" and "After" images. The backend generates a compressed thumbnail and stores the original. The UI displays thumbnails; clicking opens a Lightbox gallery.

## 14. Suggested Charts/Graphs
- **Burn-down Charts:** For task completion across a portfolio.
- **Heatmaps:** Showing geographic density of projects on the OpenStreetMap.

## 15. Notification Architecture
- **Phase 1:** Polling or server-side rendered alert badges on the topbar.
- **Future:** ASP.NET SignalR for real-time WebSocket pushes (e.g., instantly notifying a manager when their comment is resolved).

## 16. Audit Logging Architecture
- **System Logs:** File-based logging (Serilog in ASP.NET) for server errors, stack traces, and health. Viewable by Superuser in the UI.
- **Data Audit Logs:** Every CRUD operation (including those by the Superuser) is intercepted by EF Core Interceptors.
- **Read Audits:** Dedicated middleware logs `GET` requests (who viewed what entity) to a separate `AuditReadLogs` table.
- **Deletions:** Soft-delete approach. Deleting a record requires a mandatory "Reason" text field, saved into the audit log.

## 17. Database Entities Involved (High-Level)
- `Users`, `Roles`, `UserRoles`, `Permissions`, `RolePermissions`
- `Regions`, `Cities`, `Departments`, `Portfolios`
- `Projects`, `Subprojects`
- `ProjectComments` (Feedback loop: Status, User, Text, AdminRemarks)
- `ProjectImages` (Type: Before/After, ThumbnailPath, OriginalPath)
- `AuditLogs` (Action, UserId, Entity, Timestamp, DeleteReason)

## 18. API Module Structure
Clean Architecture structure in ASP.NET:
- `Controllers/` (API Endpoints)
- `Application/` (DTOs, Interfaces, Logic)
- `Domain/` (Entities, Enums)
- `Infrastructure/` (EF Core DbContext, Map Services, Image Processing)

## 19. Frontend Component Hierarchy
- `app/` (Next.js pages and routing)
- `components/`
  - `layout/` (Sidebar, Topbar)
  - `ui/` (Buttons, Modals, Tables, Lightbox)
  - `maps/` (Leaflet wrappers)
- `hooks/` (Data fetching, React Query)
- `lib/` (API clients, auth utilities)

## 20. Security Architecture
- **Auth:** JWT tokens stored in HTTP-Only secure cookies (preventing XSS).
- **API Security:** All endpoints require an `[Authorize]` attribute.
- **Data Security:** EF Core Global Query Filters can be used later to enforce Row-Level Security for lower-level users.
- **Input Validation:** FluentValidation in ASP.NET and Zod in Next.js to prevent SQL injection and bad data.

## 21. Suggested PostgreSQL Schema Structure
- `auth` schema: Users, Roles, JWT refresh tokens.
- `org` schema: Regions, Cities, Departments.
- `proj` schema: Projects, Subprojects, Comments, Images.
- `audit` schema: Highly indexed append-only tables for Read/Write logs.

## 22. Enterprise-grade Folder Structure (Monorepo approach)
```
/solution-root
  /frontend (Next.js)
  /backend (ASP.NET Core API)
  /docs (Architecture, API contracts)
  /deploy (Dockerfiles, future CI/CD)
```

## 23. Recommended Scalable Architecture Patterns
- **Repository Pattern / Unit of Work:** To abstract EF Core and make unit testing easier.
- **CQRS (Command Query Responsibility Segregation):** Consider for the backend to separate heavy read queries (dashboard analytics) from write commands (project updates).
- **Background Workers:** Use ASP.NET Hosted Services for generating image thumbnails so the UI doesn't block while waiting for compression.

## 24. Suggested Responsive Layout Behavior
- **Desktop (1024px+):** Full data grids, visible sidebar.
- **Tablet (768px - 1024px):** Condensed table columns, collapsible sidebar.
- **Mobile (<768px):** Data tables convert to stackable card views. Maps become full screen with easy touch panning.

## 25. Future Scalability Recommendations
- **Accounts Branch:** Build a dedicated schema (`finance`) to track project budgets vs. actuals.
- **Enterprise SSO:** Integrate IdentityServer or OpenIddict into the ASP.NET backend to support SAML/Entra ID.
- **Map Clustering:** As projects scale into the thousands, implement Marker Clustering in Leaflet to prevent UI lag.
- **Cloud Storage:** Migrate the local image storage to an S3-compatible service (AWS, MinIO) for better backup and scalability.
