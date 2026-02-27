import { expect, test } from '@playwright/test';

test.describe('Sync Flow', () => {
    // Generate a unique user email for each test run to avoid state collision
    const testEmail = `syncuser_${Date.now()}@polyglotpowerlifting.local`;
    const testPassword = 'Password123!';

    test('User can calculate anonymously, log in, and sync data', async ({ page }) => {
        // 1. Go to home page
        await page.goto('/');

        // 2. Perform a calculation anonymously
        await page.locator('#bodyweight').fill('80');
        await page.locator('#squat').fill('200');
        await page.locator('#bench').fill('100');
        await page.locator('#deadlift').fill('250');
        await page.getByRole('button', { name: 'Calculate Scores' }).click();

        // 3. Verify it saved to local history
        await expect(page.getByRole('heading', { name: 'Recent Calculations' })).toBeVisible();
        await expect(page.getByText('550kg')).toBeVisible(); 
        
        // Ensure the "Sync to cloud" prompt is NOT visible since we aren't logged in yet
        await expect(page.getByText('Log in to sync')).not.toBeVisible();

        // 4. Navigate to Login Page
        await page.getByRole('link', { name: 'Log In' }).click();
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

        // 5. Sign up for a new account
        await page.getByRole('button', { name: "Don't have an account? Sign up" }).click();
        await page.locator('#email').fill(testEmail);
        await page.locator('#password').fill(testPassword);
        await page.getByRole('button', { name: 'Create Account' }).click();

        // 6. We should be redirected back to the homepage as an authenticated user
        // (Note: If email confirmation is ON, this might fail, but registration test handles that.
        // Sync test assumes a successful login/registration that redirects home).
        await expect(page).toHaveURL('/', { timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();

        // 7. Verify the sync prompt appears now that we have local data AND an active session
        const syncButton = page.getByRole('button', { name: 'Sync to Cloud' });
        await expect(page.getByText('Sync Offline History?')).toBeVisible();
        await expect(page.getByText(/We found \d+ un-synced calculations/)).toBeVisible();
        await expect(syncButton).toBeVisible();

        // 8. Click the sync button
        await syncButton.click();

        // 9. Verify the sync prompt disappears (indicating successful flush to cloud)
        await expect(page.getByText('Sync Offline History?')).not.toBeVisible();
        await expect(syncButton).not.toBeVisible();

        // 10. Wait for the cloud history to finish loading
        await expect(page.getByText(/Loading your history/i)).not.toBeVisible({ timeout: 10000 });

        // 11. The history should still contain our calculation
        await expect(page.getByText('550kg')).toBeVisible(); 
        
        // 12. Let's refresh the page to prove it persists from the server, not just local state
        await page.reload();
        await expect(page.getByText(/Loading your history/i)).not.toBeVisible({ timeout: 10000 });
        await expect(page.getByText('550kg')).toBeVisible(); 
    });
});
