import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    // A dev server for this project is commonly already running locally
    // (ports 3000/3001), so always reuse it instead of only doing so when
    // CI is unset — starting a second `next dev` on the same port fails.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
