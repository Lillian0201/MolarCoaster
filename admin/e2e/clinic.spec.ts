import { expect, test } from '@playwright/test';

async function logIn(page: import('@playwright/test').Page) {
  await page.getByLabel(/Password/).fill(`qa-${crypto.randomUUID()}`);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/\/overview$/);
}

test.describe('admin clinic routes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (location.pathname === '/login') {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
    await page.goto('/login');
  });

  test('requires login fields and toggles password visibility', async ({ page }) => {
    const username = page.getByLabel(/Username/);
    const password = page.getByLabel(/Password/);
    await username.fill('');
    await password.fill('');
    expect(await page.locator('form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(/login$/);

    await password.fill(`qa-${crypto.randomUUID()}`);
    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(password).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(password).toHaveAttribute('type', 'password');
  });

  test('Remember me persists auth across reload and logout clears it', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Remember me').check();
    await logIn(page);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('molarcoaster-auth'))).toBe('true');
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('molarcoaster-auth'))).toBeNull();

    await page.reload();
    await expect(page).toHaveURL(/\/overview$/);
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('molarcoaster-auth'))).toBeNull();
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('molarcoaster-auth'))).toBeNull();
  });

  test('guards protected pages and redirects legacy appointments after login', async ({ page }) => {
    for (const path of ['/overview', '/patients', '/settings']) {
      await page.goto(path, { waitUntil: 'commit' }).catch(() => undefined);
      await expect(page).toHaveURL(/\/login$/);
    }

    await logIn(page);
    await page.goto('/appointments');
    await expect(page).toHaveURL(/\/overview$/);
  });

  test('shows the three navigation tabs and loads patient and settings screens', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    for (const label of ['Overview', 'Patient Directory', 'Clinic Settings']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(3);

    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Patient Directory' })).toBeVisible();
    await page.getByRole('button', { name: 'Clinic Settings', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Practice profile' })).toBeVisible();
  });

  test('loads key admin screens without console or HTTP errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });

    await page.goto('/login');
    await logIn(page);
    for (const [label, heading] of [['Patient Directory', 'Patient Directory'], ['Clinic Settings', 'Practice profile']] as const) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('shows Manila clinic status and advances appointment lifecycle actions', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    await expect(page.getByLabel(/Clinic (Open|Closed)/)).toBeVisible();
    const appointmentCard = page.locator('div.rounded-2xl.border.bg-slate-50.p-4').filter({ hasText: 'Gabriel Romero' });
    await expect(appointmentCard.getByText('Checked-in')).toBeVisible();
    await appointmentCard.getByRole('button', { name: 'Start' }).click();
    await expect(appointmentCard.getByText('In Chair')).toBeVisible();
    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();
      await page.getByLabel('Search patients by name, ID, phone, or email').fill('Gabriel Romero');
      const gabrielRow = page.getByRole('row').filter({ hasText: 'Gabriel Romero' });
    await expect(gabrielRow).toContainText('In Chair');
    await page.getByRole('button', { name: 'Overview', exact: true }).click();
    const updatedAppointment = page.locator('div.rounded-2xl.border.bg-slate-50.p-4').filter({ hasText: 'Gabriel Romero' });
    await updatedAppointment.getByRole('button', { name: 'Complete' }).click();
    await expect(updatedAppointment.getByText('Completed')).toBeVisible();
    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();
    await page.getByLabel('Search patients by name, ID, phone, or email').fill('Gabriel Romero');
    await expect(page.getByRole('row').filter({ hasText: 'Gabriel Romero' })).toContainText('Active');
  });

  test('keeps navigation usable at mobile, tablet, and desktop widths', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    const navigation = page.getByRole('navigation', { name: 'Dashboard navigation' });

    await page.setViewportSize({ width: 375, height: 812 });
    await expect(navigation).toBeHidden();
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await expect(navigation.getByRole('button', { name: 'Patient Directory' })).toBeVisible();
    await navigation.getByRole('button', { name: 'Patient Directory' }).click();
    await expect(page).toHaveURL(/\/patients$/);

    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(navigation).toBeHidden();
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await expect(navigation.getByRole('button', { name: 'Clinic Settings' })).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('button')).toHaveCount(3);
    await expect(navigation.getByRole('button', { name: 'Patient Directory' })).toHaveAttribute('aria-current', 'page');
  });

  test('searches patients by ID and formatted phone and validates new patient input', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();

    const search = page.getByPlaceholder('Search patient, phone, or email');
    await page.getByLabel('Filter by patient status').selectOption('In Chair');
    await page.getByLabel('Filter by treatment area').selectOption('Periodontal');
    await page.getByLabel('Filter by practitioner').selectOption('Dr. Sarah Jenkins');
    await page.getByLabel('Filter by balance').selectOption('overdue');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.getByRole('table').getByText('Mikaela Chen')).toBeVisible();
    await page.getByLabel('Filter by patient status').selectOption('all');
    await page.getByLabel('Filter by treatment area').selectOption('all');
    await page.getByLabel('Filter by practitioner').selectOption('all');
    await page.getByLabel('Filter by balance').selectOption('all');

    await search.fill('P-1001');
    await expect(page.getByRole('table').getByText('Mikaela Chen')).toBeVisible();
    await search.fill('+63-917-555-0123');
    await expect(page.getByRole('table').getByText('Mikaela Chen')).toBeVisible();

    await search.fill('');
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(10);
    await page.getByLabel('Rows').selectOption('25');
    await expect(rows).toHaveCount(25);
    await page.getByLabel('Rows').selectOption('50');
    await expect(rows).toHaveCount(30);

    await page.getByRole('button', { name: 'New patient' }).click();
    const dialog = page.getByRole('dialog', { name: 'New patient record' });
    const form = dialog.locator('form');
    expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(false);
    await dialog.getByRole('button', { name: 'Create patient' }).click();
    await expect(dialog).toBeVisible();

    await dialog.getByLabel('First name').fill('<img src=x onerror=alert(1)>');
    await dialog.getByLabel('Last name').fill('QA');
    await dialog.getByLabel('Phone number').fill('+1234567890');
    await dialog.getByLabel('Email address').fill('qa.patient@example.test');
    await dialog.getByRole('button', { name: 'Create patient' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('table').getByText('<img src=x onerror=alert(1)> QA')).toBeVisible();
    await expect(page.locator('img[src="x"]')).toHaveCount(0);

    await page.getByRole('button', { name: 'Edit patient record' }).click();
    const editDialog = page.getByRole('dialog', { name: 'Edit patient record' });
    await editDialog.getByLabel('Last name').fill('Edited');
    await editDialog.getByRole('button', { name: 'Save patient' }).click();
    await expect(editDialog).toHaveCount(0);
    await expect(page.getByRole('table').getByText('<img src=x onerror=alert(1)> Edited')).toBeVisible();

    const longName = 'LongPatientName'.repeat(80);
    await page.getByRole('button', { name: 'New patient' }).click();
    const longNameDialog = page.getByRole('dialog', { name: 'New patient record' });
    const dob = longNameDialog.getByLabel('Date of birth');
    await dob.fill('2030-01-01');
    expect(await dob.evaluate((input: HTMLInputElement) => input.validity.rangeOverflow)).toBe(true);
    await dob.fill('2000-01-01');
    await longNameDialog.getByLabel('First name').fill(longName);
    await longNameDialog.getByLabel('Last name').fill('Mobile');
    await longNameDialog.getByLabel('Phone number').fill('+1234567890');
    await longNameDialog.getByLabel('Email address').fill('long.name@example.test');
    await longNameDialog.getByRole('button', { name: 'Create patient' }).click();
    await page.setViewportSize({ width: 375, height: 812 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('table').getByText(`${longName} Mobile`)).toBeVisible();
  });

  test('validates and saves Clinic Settings through the unsaved-changes bar', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    await page.getByRole('button', { name: 'Clinic Settings', exact: true }).click();

    const email = page.getByLabel('Email');
    const phone = page.getByLabel('Phone');
    const mondayStart = page.locator('#settings-monday-start');
    const mondayEnd = page.locator('#settings-monday-end');
    await mondayStart.fill('18:30');
    await mondayEnd.fill('18:00');
    await expect(page.getByRole('alert')).toHaveText('Opening time must be earlier than closing time.');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Unsaved changes')).toBeVisible();
    await mondayStart.fill('08:30');
    await page.getByLabel('Sunday', { exact: false }).check();

    await email.fill('not-an-email');
    await phone.fill('1234');
    await expect(page.getByText('Unsaved changes')).toBeVisible();
    expect(await email.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
    expect(await phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('status')).toHaveCount(0);

    await email.fill('qa.clinic@example.test');
    await phone.fill('+639123456789');
    expect(await email.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true);
    expect(await phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true);
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('status')).toHaveText('Practice settings saved.');
    await expect(page.getByText('Unsaved changes')).toHaveCount(0);

    await page.reload();
    await expect(page.getByLabel('Email')).toHaveValue('qa.clinic@example.test');
    await expect(page.locator('#settings-monday-start')).toHaveValue('08:30');
    await expect(page.getByLabel('Sunday', { exact: false })).toBeChecked();
  });

  test('bulk removal requires confirmation and logout clears persisted auth', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();
    await expect(page.getByText('30 patients')).toBeVisible();

    await page.getByRole('checkbox', { name: 'Select all patients on this page' }).check();
    await expect(page.getByText('10 selected')).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('20 patients')).toBeVisible();

    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('molarcoaster-auth'))).toBe('true');
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('molarcoaster-auth'))).toBeNull();
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('molarcoaster-auth'))).toBeNull();
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('payment updates balance and status while rejecting overpayment', async ({ page }) => {
    await page.goto('/login');
    await logIn(page);
    await page.getByRole('button', { name: 'Patient Directory', exact: true }).click();
    const mikaelaRow = page.getByRole('row').filter({ hasText: 'Mikaela Chen' });
    await expect(mikaelaRow).toContainText('2,590');
    await expect(mikaelaRow).toContainText('Overdue');

    page.once('dialog', (dialog) => dialog.accept('500'));
    await page.getByRole('button', { name: 'Record payment' }).click();
    await expect(mikaelaRow).toContainText('2,090');

    page.on('dialog', (dialog) => dialog.accept(dialog.type() === 'prompt' ? '99999' : undefined));
    await page.getByRole('button', { name: 'Record payment' }).click();
    await expect(mikaelaRow).toContainText('2,090');
    await expect(mikaelaRow).toContainText('Overdue');
  });
});

test.fixme('rejects credentials that are not verified by an auth service', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/Username/).fill(`unauthorized-${crypto.randomUUID()}`);
  await page.getByLabel(/Password/).fill(`invalid-${crypto.randomUUID()}`);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('customer booking validates natively and reaches static confirmation', async ({ page }) => {
  await page.goto('http://localhost:8080/Appointment%20Booking/appointment.html');
  const form = page.locator('#appt-form');
  const date = page.locator('#appt-date');
  const phone = page.locator('#phone');
  const email = page.locator('#email');

  await expect(form).toHaveAttribute('method', 'get');
  await expect(form).toHaveAttribute('action', 'booking-success.html');
  await expect(date).toHaveAttribute('type', 'date');
  await expect(date).toHaveAttribute('required', '');
  await expect(page.locator('script')).toHaveCount(0);
  await expect(form).not.toContainText('book_appointment.php');

  await page.getByRole('button', { name: 'Submit Request' }).click();
  expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(false);

  await page.locator('#full-name').fill('Test Patient');
  await phone.fill('1234');
  expect(await phone.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(false);
  await phone.fill('+15550102233');
  await email.fill('not-an-email');
  expect(await email.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(false);
  await email.fill('patient@example.com');
  await date.fill('2000-01-01');
  expect(await date.evaluate((element: HTMLInputElement) => element.validity.rangeUnderflow)).toBe(true);

  await date.fill(await page.evaluate(() => new Date().toISOString().slice(0, 10)));
  await page.locator('#reason').selectOption({ label: 'Oral Surgery' });
  await page.locator('#time').selectOption({ label: '10:00 AM' });
  expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(true);
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await expect(page).toHaveURL(/\/Appointment%20Booking\/booking-success/);
  expect(new URL(page.url()).search).toBe('');
  await expect(page.getByRole('heading', { name: 'Your request is ready' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/Home%20Page\/home/);
});

test('About section navigation highlights targets with CSS only', async ({ page }) => {
  await page.goto('http://localhost:8080/About/about.html');
  const missionLink = page.getByRole('link', { name: 'Mission & Vision' });
  await missionLink.click();
  await expect(page).toHaveURL(/#mission-vision$/);
  const highlight = await missionLink.evaluate((link) => getComputedStyle(link).backgroundImage);
  expect(highlight).not.toBe('none');
  await expect(page.locator('script')).toHaveCount(0);
});

test('all customer pages are static and load local links, stylesheets, and images', async ({ page }) => {
  const paths = [
    '/',
    '/Home%20Page/home.html',
    '/About/about.html',
    '/Services/services.html',
    '/Contact/contact.html',
    '/Appointment%20Booking/appointment.html',
    '/Appointment%20Booking/booking-success.html',
    '/Services/GeneralDentistry.html',
    '/Services/OralSurgery.html',
    '/Services/Orthodontics.html',
    '/Services/CosmeticDentistry.html',
    '/Services/RestorativeDentistry.html',
  ];
  const runtimeErrors: string[] = [];
  const httpFailures: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
  page.on('pageerror', (error) => runtimeErrors.push(String(error)));
  page.on('requestfailed', (request) => {
    const error = request.failure()?.errorText ?? '';
    if (error !== 'net::ERR_ABORTED') runtimeErrors.push(`${error} ${request.url()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) httpFailures.push(`${response.status()} ${response.url()}`);
  });

  for (const path of paths) {
    const response = await page.goto(`http://localhost:8080${path}`, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), path).toBe(200);
    if (path === '/') await page.waitForURL(/Home%20Page\/home(?:\.html)?$/);
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((image) => { image.loading = 'eager'; });
    });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15000 });

    const audit = await page.evaluate(async () => {
      const internalLinks = [...new Set([...document.querySelectorAll('a[href]')]
        .map((anchor) => anchor.href)
        .filter((href) => new URL(href).origin === location.origin && !new URL(href).hash))];
      const internalLinkStatuses = await Promise.all(internalLinks.map(async (href) => {
        const result = await fetch(href, { method: 'HEAD' });
        return result.status;
      }));
      return {
        scripts: document.scripts.length,
        inlineHandlers: [...document.querySelectorAll('*')].some((element) => [...element.attributes].some((attribute) => /^on/i.test(attribute.name))),
        localStylesLoaded: [...document.querySelectorAll('link[rel="stylesheet"]')]
          .filter((link) => link.href.startsWith(location.origin)).every((link) => Boolean(link.sheet)),
        imagesLoaded: [...document.images].every((image) => image.naturalWidth > 0),
        internalLinkStatuses,
        phpReferences: /\.php/i.test(document.documentElement.outerHTML),
      };
    });
    expect(audit.scripts, path).toBe(0);
    expect(audit.inlineHandlers, path).toBe(false);
    expect(audit.localStylesLoaded, path).toBe(true);
    expect(audit.imagesLoaded, path).toBe(true);
    expect(audit.internalLinkStatuses.every((status) => status === 200), path).toBe(true);
    expect(audit.phpReferences, path).toBe(false);
  }
  expect(runtimeErrors).toEqual([]);
  expect(httpFailures).toEqual([]);
});

test('admin and customer layouts do not overflow at target viewport widths', async ({ page }) => {
  const viewports = [375, 768, 1440];
  const adminPaths = ['/overview', '/patients', '/settings'];
  await page.goto('/login');
  await logIn(page);
  for (const path of adminPaths) {
    await page.goto(path);
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `admin ${path} at ${width}px`).toBe(false);
    }
  }

  for (const path of ['/Home%20Page/home.html', '/About/about.html', '/Services/services.html', '/Contact/contact.html', '/Appointment%20Booking/appointment.html']) {
    await page.goto(`http://localhost:8080${path}`);
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `customer ${path} at ${width}px`).toBe(false);
    }
  }
});
