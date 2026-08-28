import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 6_000 },
  use: {
    headless: true,
    actionTimeout: 8_000,
    navigationTimeout: 15_000
  }
});
