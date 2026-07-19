import { expect, test } from '@playwright/test';

test('builds a two-service estimate and hands off to WhatsApp', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('tab', { name: 'Coloring' }).click();
  // The option card's accessible name includes its price
  // ("Single Tone Color from RM 170"), so a substring match still finds it.
  await page.getByRole('button', { name: 'Single Tone Color' }).click();

  const lengths = page.getByRole('radiogroup', { name: 'Hair length' });
  await expect(lengths).toBeVisible();
  await lengths.getByRole('radio', { name: /Medium/ }).click();

  await page.getByRole('button', { name: 'Add to estimate' }).click();

  // The summary region ("Estimated total" label + amount) is the
  // authoritative place to assert the running total. A bare
  // page.getByText('from RM 250') also matches the OptionPicker's live
  // preview line and the EstimateCart line item, which both render the
  // same "from RM {price} · {duration}" text and trigger a Playwright
  // strict-mode violation. Scoping to the summary avoids that.
  // "Estimated total" (price) and "Estimated time in salon" (duration) sit
  // in sibling <div> columns, so climb two levels to their shared parent —
  // one level only reaches the price column, missing the duration column.
  const summary = page.getByText('Estimated total').locator('../..');
  await expect(summary.getByText('from RM 250')).toBeVisible();

  await page.getByRole('tab', { name: 'Treatment' }).click();
  await page.getByRole('button', { name: 'Intensive Scalp Treatment' }).click();
  await page.getByRole('button', { name: 'Add to estimate' }).click();

  await expect(summary.getByText('from RM 410')).toBeVisible();
  await expect(summary.getByText('3 hr')).toBeVisible();

  const whatsapp = page.getByRole('link', { name: 'Send via WhatsApp' });
  const href = await whatsapp.getAttribute('href');
  expect(href).toContain('wa.me/601172267229');

  const text = decodeURIComponent(href!.split('?text=')[1]);
  expect(text).toContain('Single Tone Color (Medium)');
  expect(text).toContain('Intensive Scalp Treatment');
  expect(text).toContain('RM 410');
});

test('disables booking on an empty estimate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Add at least one service to book.')).toBeVisible();

  // With an empty cart the CTAs render as <a> with no href attribute at
  // all (not href=""), which also means they carry no implicit "link" role
  // and are not in the tab order. getByRole('link', ...) would find zero
  // matches here, so locate by visible text instead.
  const bookLink = page.getByText('Book on Tunai', { exact: true });
  const waLink = page.getByText('Send via WhatsApp', { exact: true });

  await expect(bookLink).not.toHaveAttribute('href');
  await expect(waLink).not.toHaveAttribute('href');
  await expect(page.getByRole('link', { name: 'Book on Tunai' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Send via WhatsApp' })).toHaveCount(0);

  // The `tabIndex` IDL property on an <a> without href misleadingly reads 0
  // (a quirk of how the getter is specified for anchors), so it is not a
  // reliable signal here. What actually matters is that calling .focus()
  // does not move focus onto the element — verified directly.
  const bookFocusable = await bookLink.evaluate((el) => {
    (el as HTMLElement).focus();
    return document.activeElement === el;
  });
  const waFocusable = await waLink.evaluate((el) => {
    (el as HTMLElement).focus();
    return document.activeElement === el;
  });
  expect(bookFocusable).toBe(false);
  expect(waFocusable).toBe(false);
});

test('has no horizontal overflow at 375px width (iPhone SE)', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  await context.close();
});

test('reveals section content immediately when prefers-reduced-motion is set', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');

  // Reveal wrapper divs carry `transition-all duration-700`; check every one
  // rendered on the page is at full opacity rather than stranded at 0.
  // The Reveal effect that flips visibility on reduced-motion fires on
  // mount, just after hydration, so poll briefly rather than reading
  // computed styles the instant `goto` resolves.
  await page.waitForFunction(
    () => {
      const els = document.querySelectorAll('.duration-700');
      return (
        els.length > 0 &&
        Array.from(els).every((el) => getComputedStyle(el).opacity === '1')
      );
    },
    undefined,
    { timeout: 5_000 },
  );

  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.duration-700')).map(
      (el) => getComputedStyle(el).opacity,
    ),
  );

  expect(opacities.length).toBeGreaterThan(0);
  expect(opacities.every((o) => o === '1')).toBe(true);
  await context.close();
});

test('keyboard: arrow keys move focus between category tabs', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tab');

  await tabs.nth(0).focus();
  await expect(tabs.nth(0)).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(0)).toBeFocused();
});

test('keyboard: Tab from the top of the page reaches the booking CTAs once the cart has an item', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('tab', { name: 'Coloring' }).click();
  await page.getByRole('button', { name: 'Single Tone Color' }).click();
  await page
    .getByRole('radiogroup', { name: 'Hair length' })
    .getByRole('radio', { name: /Medium/ })
    .click();
  await page.getByRole('button', { name: 'Add to estimate' }).click();

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

  const bookLink = page.getByRole('link', { name: 'Book on Tunai' });
  let reached = false;
  for (let i = 0; i < 100; i++) {
    await page.keyboard.press('Tab');
    reached = await bookLink.evaluate((el) => el === document.activeElement);
    if (reached) break;
  }

  expect(reached).toBe(true);
  await expect(bookLink).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Send via WhatsApp' })).toBeFocused();
});
