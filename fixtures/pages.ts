import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InvoiceForm } from '../pages/InvoiceForm';

type PagesFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  invoiceForm: InvoiceForm;
};

export const test = baseTest.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  dashboardPage: async ({ loginPage }, use) => {
    await loginPage.enterWithCode('UXTY789@!!1');
    const dashboardPage = new DashboardPage(loginPage.page);
    await use(dashboardPage);
  },
  invoiceForm: async ({ dashboardPage }, use) => {
    await dashboardPage.clickNewInvoiceButton();
    const invoiceForm = new InvoiceForm(dashboardPage.page);
    await use(invoiceForm);
  },
});

export { expect } from '@playwright/test';
