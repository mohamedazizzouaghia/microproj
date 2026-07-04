import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['monocart-reporter', {
        name: "EspritConnect Test Report",
        outputFile: './test-results/report.html'
    }]
  ],
  use: {
    baseURL: 'http://localhost:8080',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    // Capture screenshot after each test failure or step
    screenshot: 'on',
    // Record video for the entire test
    video: 'on',
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
  },
});
