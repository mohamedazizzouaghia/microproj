// @ts-check
import { test, expect } from '@playwright/test';

// ============================================================
//  GLOBAL SETUP: Login first, share token via file
// ============================================================
const BASE = 'http://localhost:8080';
let TOKEN = '';

async function getToken(request) {
  if (TOKEN) return TOKEN;
  const res = await request.post(`${BASE}/auth/login`, {
    data: { email: 'admin@esprit.tn', password: 'admin123' }
  });
  const body = await res.json();
  TOKEN = body.token || body;
  return TOKEN;
}

function headers(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// ============================================================
//  AUTH-SERVICE
// ============================================================
test.describe.serial('🔐 AUTH-SERVICE', () => {

  test('POST /auth/register — Register a new student', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/register`, {
      data: {
        firstName: 'Test', lastName: 'Student',
        email: `test${Date.now()}@esprit.tn`, password: 'test1234', role: 'STUDENT'
      }
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('POST /auth/login — Login as admin', async ({ request }) => {
    const token = await getToken(request);
    expect(token).toBeTruthy();
    console.log('✅ Got JWT token');
  });

  test('GET /auth/me — Get current user info', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/auth/me`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.email).toBe('admin@esprit.tn');
    console.log('✅ Current user:', body.email);
  });

  test('POST /auth/login — Wrong credentials returns error', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { email: 'wrong@esprit.tn', password: 'wrongpass' }
    });
    expect(res.ok()).toBeFalsy();
    console.log('✅ Wrong credentials rejected');
  });
});

// ============================================================
//  USER-SERVICE
// ============================================================
test.describe.serial('👤 USER-SERVICE', () => {

  test('GET /api/users — List all users', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/users`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const users = await res.json();
    expect(Array.isArray(users)).toBeTruthy();
    console.log(`✅ Found ${users.length} users`);
  });

  test('POST /api/users — Create a user profile', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${BASE}/api/users`, {
      headers: headers(token),
      data: {
        userId: 999, firstName: 'PlaywrightTest', lastName: 'User',
        email: 'playwright@esprit.tn', department: 'INFO', year: 3,
        phone: '12345678', bio: 'Created by Playwright'
      }
    });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ User profile created');
  });

  test('GET /api/users/stats — Get user stats', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/users/stats`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const stats = await res.json();
    console.log('✅ User stats:', JSON.stringify(stats).substring(0, 100));
  });
});

// ============================================================
//  EVENT-SERVICE
// ============================================================
let createdEventId;

test.describe.serial('📅 EVENT-SERVICE', () => {

  test('GET /api/events — List all events', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/events`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const events = await res.json();
    expect(Array.isArray(events)).toBeTruthy();
    console.log(`✅ Found ${events.length} events`);
  });

  test('POST /api/events — Create event', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${BASE}/api/events`, {
      headers: headers(token),
      data: {
        title: 'Playwright Test Event', description: 'Auto-generated',
        date: '2026-08-15', capacity: 50, registeredCount: 0,
        category: 'CONFERENCE', status: 'UPCOMING', organizerId: 1
      }
    });
    expect(res.status()).toBeLessThan(500);
    if (res.ok() || res.status() === 201) {
      const event = await res.json();
      createdEventId = event.id;
      console.log(`✅ Event created id=${event.id}`);
    }
  });

  test('GET /api/events/:id — Get event by ID', async ({ request }) => {
    const token = await getToken(request);
    const id = createdEventId || 1;
    const res = await request.get(`${BASE}/api/events/${id}`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const event = await res.json();
    console.log(`✅ Got event: ${event.title}`);
  });

  test('POST /api/events/:id/register — Register to event', async ({ request }) => {
    const token = await getToken(request);
    const id = createdEventId || 1;
    const res = await request.post(`${BASE}/api/events/${id}/register?userId=1`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Registered to event');
  });

  test('DELETE /api/events/:id/unregister — Unregister', async ({ request }) => {
    const token = await getToken(request);
    const id = createdEventId || 1;
    const res = await request.delete(`${BASE}/api/events/${id}/unregister?userId=1`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Unregistered from event');
  });

  test('GET /api/events/stats — Get event stats', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/events/stats`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const stats = await res.json();
    console.log('✅ Event stats:', JSON.stringify(stats).substring(0, 100));
  });
});

// ============================================================
//  RESERVATION-SERVICE
// ============================================================
let createdReservationId;

test.describe.serial('🏫 RESERVATION-SERVICE', () => {

  test('GET /api/reservations — List all', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/reservations`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
    console.log(`✅ Found ${data.length} reservations`);
  });

  test('POST /api/reservations — Create reservation', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${BASE}/api/reservations`, {
      headers: headers(token),
      data: { roomName: 'Amphi A', date: '2026-08-20', purpose: 'Playwright Booking', eventId: 1, studentId: 1 }
    });
    expect(res.status()).toBeLessThan(500);
    if (res.ok() || res.status() === 201) {
      const r = await res.json();
      createdReservationId = r.id;
      console.log(`✅ Reservation created id=${r.id}`);
    }
  });

  test('GET /api/rooms — List rooms', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/rooms`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Rooms endpoint responded');
  });

  test('PUT /api/reservations/:id/approve — Approve', async ({ request }) => {
    const token = await getToken(request);
    const id = createdReservationId || 1;
    const res = await request.put(`${BASE}/api/reservations/${id}/approve`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Reservation approved');
  });

  test('GET /api/reservations/stats — Stats', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/reservations/stats`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Reservation stats retrieved');
  });
});

// ============================================================
//  CLUB-SERVICE
// ============================================================
let createdClubId;

test.describe.serial('🏛️ CLUB-SERVICE', () => {

  test('GET /api/clubs — List all clubs', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/clubs`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const clubs = await res.json();
    expect(Array.isArray(clubs)).toBeTruthy();
    console.log(`✅ Found ${clubs.length} clubs`);
  });

  test('POST /api/clubs — Create club', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${BASE}/api/clubs`, {
      headers: headers(token),
      data: { name: 'Playwright Club', description: 'Auto test', category: 'Tech', presidentId: 1 }
    });
    expect(res.status()).toBeLessThan(500);
    if (res.ok() || res.status() === 201) {
      const club = await res.json();
      createdClubId = club.id;
      console.log(`✅ Club created id=${club.id}`);
    }
  });

  test('GET /api/clubs/:id — Get club', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.get(`${BASE}/api/clubs/${id}`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    console.log('✅ Got club details');
  });

  test('PUT /api/clubs/:id — Update club', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.put(`${BASE}/api/clubs/${id}`, {
      headers: headers(token),
      data: { name: 'Playwright Club UPDATED', description: 'Updated', category: 'Science' }
    });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Club updated');
  });

  test('POST /api/clubs/:id/join — Join club', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.post(`${BASE}/api/clubs/${id}/join`, {
      headers: headers(token),
      data: { userId: 99, role: 'MEMBER' }
    });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Joined club');
  });

  test('GET /api/clubs/:id/posts — Get posts', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.get(`${BASE}/api/clubs/${id}/posts`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const posts = await res.json();
    console.log(`✅ Found ${posts.length} posts`);
  });

  test('POST /api/clubs/:id/posts — Create post', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.post(`${BASE}/api/clubs/${id}/posts`, {
      headers: headers(token),
      data: { title: 'Playwright Post', content: 'Auto test post', authorId: 1 }
    });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Post created');
  });

  test('GET /api/clubs/stats — Stats', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/clubs/stats`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const stats = await res.json();
    expect(stats.total !== undefined).toBeTruthy();
    console.log('✅ Club stats:', JSON.stringify(stats).substring(0, 100));
  });

  test('DELETE /api/clubs/:id/leave — Leave club', async ({ request }) => {
    const token = await getToken(request);
    const id = createdClubId || 1;
    const res = await request.delete(`${BASE}/api/clubs/${id}/leave?userId=99`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Left club');
  });

  test('DELETE /api/clubs/:id — Delete club', async ({ request }) => {
    if (!createdClubId) { console.log('⏭️ Skipped (no club created)'); return; }
    const token = await getToken(request);
    const res = await request.delete(`${BASE}/api/clubs/${createdClubId}`, { headers: headers(token) });
    expect(res.status()).toBeLessThan(500);
    console.log('✅ Club deleted');
  });
});

// ============================================================
//  INCIDENT-SERVICE
// ============================================================
let createdIncidentId;

test.describe.serial('🚨 INCIDENT-SERVICE', () => {

  test('GET /api/incidents — List all', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/incidents`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
    console.log(`✅ Found ${data.length} incidents`);
  });

  test('POST /api/incidents — Create incident', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${BASE}/api/incidents`, {
      headers: headers(token),
      data: {
        title: 'Playwright Incident', description: 'Auto test',
        location: 'Block Z', category: 'MAINTENANCE', priority: 'HIGH',
        status: 'OPEN', reportedBy: 'playwright@esprit.tn'
      }
    });
    expect(res.ok()).toBeTruthy();
    const incident = await res.json();
    createdIncidentId = incident.id;
    expect(incident.status).toBe('OPEN');
    console.log(`✅ Incident created id=${incident.id}`);
  });

  test('GET /api/incidents/all — Admin list', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/incidents/all`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    console.log(`✅ Admin: ${data.length} incidents`);
  });

  test('PUT /api/incidents/:id/status — IN_PROGRESS', async ({ request }) => {
    const token = await getToken(request);
    const id = createdIncidentId || 1;
    const res = await request.put(`${BASE}/api/incidents/${id}/status?status=IN_PROGRESS`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const incident = await res.json();
    expect(incident.status).toBe('IN_PROGRESS');
    console.log('✅ Status → IN_PROGRESS');
  });

  test('PUT /api/incidents/:id/status — RESOLVED', async ({ request }) => {
    const token = await getToken(request);
    const id = createdIncidentId || 1;
    const res = await request.put(`${BASE}/api/incidents/${id}/status?status=RESOLVED`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const incident = await res.json();
    expect(incident.status).toBe('RESOLVED');
    console.log('✅ Status → RESOLVED');
  });

  test('PUT /api/incidents/:id/assign — Assign', async ({ request }) => {
    const token = await getToken(request);
    const id = createdIncidentId || 1;
    const res = await request.put(`${BASE}/api/incidents/${id}/assign?assignedTo=admin@esprit.tn`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const incident = await res.json();
    expect(incident.assignedTo).toBe('admin@esprit.tn');
    console.log('✅ Incident assigned');
  });

  test('GET /api/incidents/stats — Stats', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.get(`${BASE}/api/incidents/stats`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    const stats = await res.json();
    expect(stats.total).toBeGreaterThan(0);
    console.log('✅ Incident stats:', JSON.stringify(stats).substring(0, 120));
  });

  test('DELETE /api/incidents/:id — Delete', async ({ request }) => {
    if (!createdIncidentId) { console.log('⏭️ Skipped'); return; }
    const token = await getToken(request);
    const res = await request.delete(`${BASE}/api/incidents/${createdIncidentId}`, { headers: headers(token) });
    expect(res.ok()).toBeTruthy();
    console.log('✅ Incident deleted');
  });
});

// ============================================================
//  SWAGGER / OPENAPI
// ============================================================
test.describe('📚 SWAGGER & OPENAPI', () => {
  const services = ['user-service', 'event-service', 'reservation-service', 'auth-service', 'club-service', 'incident-service'];

  for (const svc of services) {
    test(`GET /v3/api-docs/${svc} — spec accessible`, async ({ request }) => {
      const res = await request.get(`${BASE}/v3/api-docs/${svc}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.openapi).toBeTruthy();
      console.log(`✅ ${svc} OpenAPI ${body.openapi}`);
    });
  }
});

// ============================================================
//  EUREKA
// ============================================================
test.describe('🧭 EUREKA', () => {
  test('GET /eureka/apps — All services registered', async ({ request }) => {
    const res = await request.get('http://localhost:8761/eureka/apps', {
      headers: { Accept: 'application/json' }
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const apps = body.applications?.application || [];
    const names = apps.map(a => a.name);
    console.log(`✅ Eureka: ${names.join(', ')}`);
    expect(names.length).toBeGreaterThanOrEqual(2);
  });
});
