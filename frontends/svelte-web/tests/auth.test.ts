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

        // Since "Enable Email Confirmations" is explicitly OFF in our Dev Supabase settings,
        // we are instantly logged in and redirected back to the home page!
        await expect(page).toHaveURL('/');

        // 1) Verify the Polyglot Header is visible
        await expect(page.getByRole('heading', { name: /Polyglot/i })).toBeVisible();

        // 2) The "Log In" link should be gone, replaced by "Log Out" explicitly indicating we are securely logged in
        await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Log In' })).not.toBeVisible();
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
