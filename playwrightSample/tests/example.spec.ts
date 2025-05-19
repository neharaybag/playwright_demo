import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.cloudbees.com/');
  await expect(page).toHaveTitle(/CloudBees/); // Optional: checks page title contains 'CloudBees'
});

test('verify links and elements', async ({ page }) => {
  await page.goto('https://www.cloudbees.com/');

  // Click the 'Products' menu
  await page.getByText('Products').first().click();

  // Click the 'CloudBees CD/RO' product link
  await page.getByText('CloudBees CD/RO').click();

  // Wait for the stats to appear
  const statCards = page.locator('[data-test="stat"]');
  await expect(statCards.first()).toBeVisible();

  let count = await statCards.count();

  for (let num = 0; num < count; num++) {
    const card = statCards.nth(num);
    const title = await card.locator('[data-test="stat.preTitle"]').innerText();

    if (title.trim() === 'Cost Savings') {
      const value = await card.locator('[data-test="stat.primary"] span').innerText();
      console.log('Cost Savings Value:', value);
      expect(value).toBe('$2m'); // Assert expected value
      break;
    }
  }
  await page.getByText('Auditors / Security').click();

  const contentSections = await page.locator('[data-test="headerContent"]')
  count = await contentSections.count();
  for (let num = 0; num < count; num++) {
    console.log('num:', num);
    console.log('count:', count);
    const content = contentSections.nth(num);
    let title = await content.locator('[data-test="headerContent.preTitle"]').innerText();
    console.log('title:', title);
    if (title.trim() === 'Release Governance') {
      let description = await content.locator('[data-test="headerContent.title"]').innerText();
      expect(description).toContain('Generate single-click audit reports');
      break;
    }
  }

  // Click the 'Products' menu
  await page.getByText('Resources').first().click();
  await page.getByText('Documentation').nth(1).click();
  const newPagePromise = page.waitForEvent('popup');
  const newPage = await newPagePromise;
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('https://docs.cloudbees.com/');
  await newPage.locator('[Placeholder*="Search"]').click();
  await newPage.locator('[Placeholder="Search"]').fill('Installation')
  await newPage.locator('[class="page-item active"]').isVisible();

});
