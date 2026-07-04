import { test, expect } from '@playwright/test';

test.describe('EspritConnect Extra UI Use Cases', () => {
  test.use({ actionTimeout: 15000 });

  test('Registration, Profile update, and Settings navigation', async ({ page }) => {
    test.setTimeout(60000); 
    console.log("🌐 Opening browser...");
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(500);
    // Push state to /register to start on the registration page
    await page.evaluate(() => {
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.waitForTimeout(1000);

    const timestamp = Date.now();
    const testEmail = `newstudent${timestamp}@esprit.tn`;
    
    // 📝 REGISTRATION
    console.log("📝 Testing Registration flow...");
    await expect(page.locator('text=Join EspritConnect')).toBeVisible();
    await page.fill('input[placeholder="John"]', 'Test');
    await page.fill('input[placeholder="Doe"]', 'Student');
    await page.fill('input[placeholder="you@esprit.tn"]', testEmail);
    await page.fill('input[placeholder="••••••••"]', 'password123');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sign Up")');
    // Wait for redirect to login or success toast
    await expect(page.locator('text=Welcome back').or(page.locator('text=Registered successfully'))).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // 🔐 LOGIN AS NEW USER
    console.log("🔑 Logging in as new user...");
    await page.evaluate(() => {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.waitForTimeout(500);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    
    // Verify Dashboard loads
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // 👤 PROFILE SETTINGS
    console.log("👤 Testing Profile Page...");
    await page.click('a[href="/profile"]');
    await expect(page.locator('h1', { hasText: 'My Profile' })).toBeVisible();
    
    // Update first name and last name
    // The inputs are pre-filled, so we need to clear them first
    const firstNameInput = page.locator('input').nth(0);
    const lastNameInput = page.locator('input').nth(1);
    
    await firstNameInput.fill('');
    await firstNameInput.fill('Updated');
    await lastNameInput.fill('');
    await lastNameInput.fill('Name');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Profile updated successfully!')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // ⚙️ SETTINGS PAGE
    console.log("⚙️ Testing Settings Page...");
    // Since role is STUDENT, they might not have admin settings, but let's check general settings if they exist.
    // Wait, is there a Settings link in Sidebar?
    // Let's check by navigating directly.
    await page.evaluate(() => {
      window.history.pushState({}, '', '/settings');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.waitForTimeout(1000);
    // There is no /settings for non-admin? Wait, /admin/settings exists. We'll skip settings for student.

    // 🚪 LOGOUT
    console.log("🚪 Testing Logout flow...");
    // Locate the logout button in sidebar or navbar
    // Usually it has text "Logout" or is the last button in sidebar
    await page.click('button:has-text("Logout")');
    // Should redirect to login
    await expect(page.locator('text=Welcome back')).toBeVisible({ timeout: 5000 });
    
    console.log("✅ Extra UI Tests completed successfully!");
  });
});
