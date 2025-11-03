import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InvoiceForm, SubmitType } from '../pages/InvoiceForm';
import { ACCESS_CODE, invoiceTestData } from '../tests/data/AppData';
import { InvoiceData } from '../tests/data/InvoiceData';

type PagesFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  newInvoiceForm: InvoiceForm;
  editInvoiceForm: { editForm: InvoiceForm; invoiceData: InvoiceData };
};

export const test = baseTest.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  dashboardPage: async ({ loginPage }, use) => {
    await loginPage.enterWithCode(ACCESS_CODE);
    const dashboardPage = new DashboardPage(loginPage.page);
    await use(dashboardPage);
  },
  newInvoiceForm: async ({ dashboardPage }, use) => {
    await dashboardPage.clickNewInvoiceButton();
    const newInvoiceForm = new InvoiceForm(dashboardPage.page);
    await use(newInvoiceForm);
  },
  editInvoiceForm: async ({ dashboardPage, newInvoiceForm }, use) => {
    const newInvoice: InvoiceData = await newInvoiceForm.fillAndSubmitFormWith(
      invoiceTestData,
      SubmitType.newInvoice
    );
    await dashboardPage.clickEditButtonOfInvoice(newInvoice.getId());
    const editInvoiceForm = newInvoiceForm;
    await use({ editForm: editInvoiceForm, invoiceData: newInvoice });
  },
});

export { expect } from '@playwright/test';
