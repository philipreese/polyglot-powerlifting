import { expect, test } from '@playwright/test';

test('User can calculate Wilks without logging in', async ({ page }) => {
	// Let's go to the main page which houses the calculator
	await page.goto('/');

	// The app should be visible and contain the polyglot title
	await expect(page.getByRole('heading', { name: /Polyglot/i })).toBeVisible();

	// Make sure the "Log In" link is visible, proving we are not logged in
	await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();

	// Fill out the calculator form
	await page.locator('#bodyweight').fill('80');
	await page.locator('#squat').fill('100');
	await page.locator('#bench').fill('100');
	await page.locator('#deadlift').fill('100');

	// The calculate button logic should instantly compute the score and display it
	const calculateBtn = page.getByRole('button', { name: 'Calculate Scores' });
	await expect(calculateBtn).toBeVisible();
	await calculateBtn.click();

	// Now wait for the history to update, meaning a new history item should appear
	const historyTotal = page.locator('span:has-text("300")');
	await expect(historyTotal.first()).toBeVisible();

	// Wait for the calculation to finish by asserting the 'Awaiting Data' placeholder is gone
	await expect(page.getByText('Awaiting Data')).not.toBeVisible();

	// Assert that the results have rendered
	await expect(page.getByText('Wilks').first()).toBeVisible();
});
