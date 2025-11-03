import { test, expect } from '../fixtures/pages';

test('User is able to log out of the app', async ({
  dashboardPage,
  loginPage,
}) => {
  await dashboardPage.clickLogoutAndChooseAction('OK');
  expect(dashboardPage.getHeaderText()).toHaveCount(0);
  expect(loginPage.getAccessCodeRequiredMessage()).toBeVisible();
});

test('User is able to remain logged in after clicking log out button', async ({
  dashboardPage,
  loginPage,
}) => {
  await dashboardPage.clickLogoutAndChooseAction('Cancel');
  expect(dashboardPage.getHeaderText()).toBeVisible();
  expect(loginPage.getAccessCodeRequiredMessage()).toHaveCount(0);
});
