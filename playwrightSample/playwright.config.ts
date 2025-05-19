import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'], // default console reporter
    ['allure-playwright']
  ],
  // other configs like projects, timeout etc.
});
