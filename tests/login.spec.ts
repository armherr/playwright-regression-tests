import { test, expect } from '../fixtures/pages';

test('User is able to access the dashboard using a valid code', async ({
  dashboardPage,
}) => {
  await expect(dashboardPage.getHeaderText()).toBeVisible();
});

test('User is not able to access the dashboard using an invalid code', async ({
  loginPage,
}) => {
  await loginPage.enterWithCode('Armando');
  await expect(loginPage.getInvalidCodeMessage()).toBeVisible();
});
