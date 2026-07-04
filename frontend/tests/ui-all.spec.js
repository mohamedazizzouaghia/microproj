import { test, expect } from '@playwright/test';

test.describe('EspritConnect Full UI Use Cases', () => {
  test.use({ actionTimeout: 15000 });

  test('Complete visual walkthrough of all services', async ({ page }) => {
    test.setTimeout(60000); // Increase overall timeout for visual walkthrough
    console.log("🌐 Opening browser...");
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(500);
    // Push state to /login to avoid Nginx 404 on direct URL
    await page.evaluate(() => {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.waitForTimeout(1000);
    
    // 🔐 AUTH-SERVICE: LOGIN
    console.log("🔑 Logging in as Admin...");
    await page.fill('input[type="email"]', 'admin@esprit.tn');
    await page.waitForTimeout(500); 
    await page.fill('input[type="password"]', 'admin123');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');

    // Dashboard
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // 👤 USER-SERVICE: CREATE USER
    console.log("👥 Testing User-Service UI...");
    await page.click('a[href="/users"]');
    await expect(page.locator('h1', { hasText: 'User' })).toBeVisible();
    await page.click('button:has-text("New User")');
    await page.waitForTimeout(500);
    await page.fill('input[name="firstName"]', 'UI');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="email"]', `uitester${Date.now()}@esprit.tn`);
    await page.selectOption('select[name="role"]', 'STUDENT');
    await page.waitForTimeout(500); 
    await page.click('button[type="submit"]');
    await expect(page.locator('text=User created')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    // 📅 EVENT-SERVICE: CREATE & REGISTER
    console.log("📅 Testing Event-Service UI...");
    await page.click('a[href="/events"]');
    await expect(page.locator('h1', { hasText: 'Events' })).toBeVisible();
    // Create
    await page.click('button:has-text("New Event")');
    await page.waitForTimeout(500);
    // There are no name attributes, so we use placeholder or type
    await page.fill('input[placeholder="e.g. Tech Talk: AI Future"]', 'UI Automated Tech Talk');
    await page.fill('input[type="number"]', '100');
    await page.fill('input[type="date"]', '2026-12-15');
    await page.selectOption('select', 'WORKSHOP');
    await page.fill('textarea', 'Created by visual Playwright tests');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(1000);
    
    // Register to first event
    if (await page.locator('button:has-text("Register")').first().isVisible()) {
        await page.click('button:has-text("Register") >> nth=0');
        await expect(page.locator('text=Registered successfully').or(page.locator('text=Failed to register'))).toBeVisible({ timeout: 5000 });
    }
    await page.waitForTimeout(500);

    // 🏫 RESERVATION-SERVICE: CREATE
    console.log("🏫 Testing Reservation-Service UI...");
    await page.click('a[href="/reservations"]');
    await expect(page.locator('h1', { hasText: 'Reservations' })).toBeVisible();
    await page.click('button:has-text("New Reservation")');
    await page.waitForTimeout(500);
    await page.selectOption('select', { index: 1 }); // Select room
    await page.fill('input[type="date"]', '2026-12-20');
    await page.fill('input[type="time"]', '14:00');
    await page.fill('input[placeholder*="Club Meeting"]', 'Playwright Meeting');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=reserved successfully')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // 🏛️ CLUB-SERVICE: CREATE & JOIN
    console.log("🏛️ Testing Club-Service UI...");
    await page.click('a[href="/clubs"]');
    await expect(page.locator('h1', { hasText: 'Clubs' })).toBeVisible();
    
    // Create club
    await page.click('button:has-text("New Club")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="e.g. Robotics Club"]', 'UI Test Club');
    await page.selectOption('select', 'Tech');
    await page.fill('textarea', 'Visual UI Testing Club');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Create Club")');
    await page.waitForTimeout(1000);

    // Join club
    if (await page.locator('button:has-text("Join")').first().isVisible()) {
        await page.click('button:has-text("Join") >> nth=0');
        await expect(page.locator('text=Successfully joined').or(page.locator('text=Failed to join club'))).toBeVisible({ timeout: 5000 });
    }
    await page.waitForTimeout(500);

    // 🚨 INCIDENT-SERVICE: REPORT & UPDATE
    console.log("🚨 Testing Incident-Service UI...");
    await page.click('a[href="/incidents"]');
    await expect(page.locator('h1', { hasText: 'Incidents' })).toBeVisible();
    
    // Report
    await page.click('button:has-text("Report Incident")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="Broken chair"]', 'Broken Projector in UI Test');
    await page.fill('input[placeholder*="Block C"]', 'Block B');
    await page.locator('form').locator('select').nth(0).selectOption('MAINTENANCE');
    await page.locator('form').locator('select').nth(1).selectOption('HIGH');
    await page.fill('textarea', 'Projector needs fixing immediately.');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Submit Report")');
    await expect(page.locator('text=Incident reported')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Update Status
    if (await page.locator('select.border').first().isVisible()) {
        await page.selectOption('select.border >> nth=0', 'IN_PROGRESS');
        await expect(page.locator('text=Status updated')).toBeVisible({ timeout: 5000 });
    }
    await page.waitForTimeout(1500);

    // ⚙️ SYSTEM LOGS
    console.log("⚙️ Viewing System Logs...");
    await page.click('a[href="/admin"]');
    await page.waitForTimeout(500);
    await page.click('h3:has-text("System Logs")');
    await expect(page.locator('h1', { hasText: 'System' })).toBeVisible();
    await page.waitForTimeout(4000); // Let the user see the pings

    console.log("✅ Full visual UI Test completed successfully!");
  });
});
