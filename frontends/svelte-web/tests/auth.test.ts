import { expect, test } from '@playwright/test';

test.describe('Authentication flows', () => {
    // We use a unique test email combining a timestamp to avoid "User already exists" errors between test runs
    const testEmail = `testuser_${Date.now()}@polyglotpowerlifting.local`;
    const testPassword = 'Password123!';

    test('User can register for a new account', async ({ page }) => {
        // Go directly to the login page
        await page.goto('/login');

        // We should start on the Log In dialog by default
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

        // Click the prompt at the bottom to switch to "Sign Up" mode
        await page.getByRole('button', { name: "Don't have an account? Sign up" }).click();
        
        // Assert we are now in the sign-up mode
        await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();

        // Fill out the registration form
        await page.locator('#email').fill(testEmail);
        await page.locator('#password').fill(testPassword);

        // Click the Create Account button
        await page.getByRole('button', { name: 'Create Account' }).click();

        // RESILIENCE: We wait for either the "Check your email" message OR a redirect to home.
        // This handles cases where Email Confirmations might be ON or OFF in different environments.
        await expect(async () => {
             const successMsg = page.getByText(/Check your email/i);
             const isHome = page.url() === 'http://localhost:4173/';
             if (isHome || await successMsg.isVisible()) return;
             throw new Error('Waiting for registration outcome...');
        }).toPass({ timeout: 10000 });

        if (page.url() === 'http://localhost:4173/') {
            await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
        } else {
            await expect(page.getByText(/Check your email/i)).toBeVisible();
        }
    });

    test('User can switch between login and signup modes', async ({ page }) => {
        await page.goto('/login');
        
        // Starts on Login
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

        // Switches to Signup
        await page.getByRole('button', { name: "Don't have an account? Sign up" }).click();
        await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();

        // Switches back to Login
        await page.getByRole('button', { name: 'Already have an account? Log in' }).click();
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    });
});
