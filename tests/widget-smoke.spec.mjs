import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync('artifacts', { recursive: true });

const demos = [
  { slug: 'praziarnicka', title: 'Pražiarnička – kávový poradca', resource: 'praziarnicka-v12.js' },
  { slug: 'diamonds', title: 'Diamonds Roastery – kávový poradca', resource: 'coffee-diamonds-final.js' },
  { slug: 'kaffa', title: 'Kaffa Roastery – nájdite svoju kávu', resource: 'kaffa-final.js' },
  { slug: 'vitazov', title: 'Káva Víťazov – kávový poradca', resource: 'coffee-vitazov-final.js' },
  { slug: 'concept', title: 'Concept Coffee Roasters – kávový poradca', resource: 'concept-seasonal-init.js' }
];

function watchConsole(page) {
  const failures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(message.text());
  });
  page.on('pageerror', (error) => failures.push(error.message));
  return failures;
}

async function waitForDemo(page) {
  await page.waitForFunction(() => {
    const pz = document.querySelector('#praziarnicka-root');
    const shared = document.querySelector('#coffee-demo-root');
    return Boolean((pz && pz.childElementCount) || (shared && shared.childElementCount));
  });
}

test('all five routed demos load their final runtime with no page scroll at 1366x768', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });

  for (const demo of demos) {
    const errors = watchConsole(page);
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil: 'networkidle' });
    await waitForDemo(page);
    await expect(page).toHaveTitle(demo.title);

    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
    expect(resources.some((url) => url.includes(demo.resource))).toBeTruthy();

    const metrics = await page.evaluate(() => ({
      scrollHeight: document.scrollingElement.scrollHeight,
      scrollWidth: document.scrollingElement.scrollWidth,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      text: document.body.innerText.trim()
    }));
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 1);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
    expect(metrics.text.length).toBeGreaterThan(20);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `artifacts/final-${demo.slug}-1366x768.png`, fullPage: true });
  }
});

test('all five routed demos remain horizontally contained at 571x813', async ({ page }) => {
  await page.setViewportSize({ width: 571, height: 813 });

  for (const demo of demos) {
    const errors = watchConsole(page);
    await page.goto(`${baseURL}/?demo=${demo.slug}`, { waitUntil: 'networkidle' });
    await waitForDemo(page);
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.scrollingElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasChat: document.body.innerText.includes('Chat'),
      hasAdvisor: document.body.innerText.includes('Výber') || document.body.innerText.includes('Nájsť')
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
    expect(metrics.hasChat).toBeTruthy();
    expect(metrics.hasAdvisor).toBeTruthy();
    expect(errors).toEqual([]);
  }
});

test('Jolka stays on its standalone entry point and remains no-scroll', async ({ page }) => {
  const errors = watchConsole(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/jolka.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.body.innerText.trim().length > 20);
  const metrics = await page.evaluate(() => ({
    scrollHeight: document.scrollingElement.scrollHeight,
    scrollWidth: document.scrollingElement.scrollWidth,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth
  }));
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight + 1);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'artifacts/final-jolka-1366x768.png', fullPage: true });
});
