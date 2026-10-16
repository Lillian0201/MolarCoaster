import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const adminRoot = process.cwd();
const customerRoot = resolve(adminRoot, '../customer');
const reuseExisting = !process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8081',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: adminRoot,
      url: 'http://localhost:8081/login',
      reuseExistingServer: reuseExisting,
      timeout: 30000,
    },
    {
      command: 'npx --yes serve -l 8080',
      cwd: customerRoot,
      url: 'http://localhost:8080/',
      reuseExistingServer: reuseExisting,
      timeout: 30000,
    },
  ],
});
