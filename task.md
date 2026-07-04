# Tasks

- [x] Implement `incident-service` at `c:\Users\aziz\Desktop\springproj\incident-service`.
- [x] Port: 8086.
- [x] Entities: `Incident` (id, title, description, location, category, priority, status, reportedBy, assignedTo, createdAt, resolvedAt).
- [x] Endpoints:
  - [x] `GET /api/incidents`
  - [x] `GET /api/incidents/all` (ADMIN)
  - [x] `POST /api/incidents`
  - [x] `PUT /api/incidents/{id}/status` (ADMIN)
  - [x] `PUT /api/incidents/{id}/assign` (ADMIN)
  - [x] `DELETE /api/incidents/{id}`
  - [x] `GET /api/incidents/stats`
- [x] Create a DataLoader that inserts 10 incidents in different states/priorities.
- [x] Run it to test.

## Frontend Overhaul
- [x] Install Tailwind CSS & PostCSS & `recharts` & `lucide-react` & `react-hot-toast` & `axios` & `react-router-dom`.
- [x] Configure Tailwind (`tailwind.config.js` and `index.css`). Use color scheme: deep blue #1e3a5f + white + accent orange #f97316.
- [x] Create generic `Axios` instance in `src/api.js`.
- [x] Build all pages: `/login`, `/register`, `/` (Dashboard), `/events`, `/reservations`, `/clubs`, `/incidents`, `/profile`, `/admin`.
- [x] Add Sidebar with lucide icons, Top navbar (avatar + logout).
- [x] Implement Role-based routing (Admin vs Student).

## Refactoring Services
- [x] `user-service`: Update entity to `UserProfile`. Add `GET /api/users/stats`. Add DataLoader.
- [x] `event-service`: Update `Event` entity. Add `EventRegistration` entity. Add endpoints: `POST /api/events/{id}/register`, `DELETE /api/events/{id}/unregister`, `GET /api/events/stats`. Add DataLoader.
- [x] `reservation-service`: Add `Room` entity. Update `Reservation` entity. Add endpoints: `PUT /api/reservations/{id}/approve`, `PUT /api/reservations/{id}/reject`, `GET /api/rooms`, `GET /api/reservations/stats`. Add DataLoader.
## Auth & Gateway Tasks
- [x] Implement `auth-service` with H2 DB, JJWT, and Spring Security.
- [x] Create Entities: User, Endpoints: /auth/register, /auth/login, /auth/me.
- [x] Create DataLoader (1 admin + 5 students).
- [x] Register on Eureka as auth-service on port 8084.
- [x] Update api-gateway with global JWT validation filter.
- [x] Add routing for /auth/**, /api/clubs/**, /api/incidents/** to gateway.


- [x] Implement `club-service` at `c:\Users\aziz\Desktop\springproj\club-service`.
- [x] Port: 8085.
- [x] Entities: `Club`, `ClubMembership`, `ClubPost`.
- [x] Endpoints implemented.
- [x] DataLoader created.
- [x] Run it to test (running...)
