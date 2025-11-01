import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type PagesFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = baseTest.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  dashboardPage: async ({ loginPage }, use) => {
    const dashboardPage = new DashboardPage(loginPage.page);
    await loginPage.enterWithCode('UXTY789@!!1');
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
