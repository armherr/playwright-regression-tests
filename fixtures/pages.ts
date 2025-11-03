import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InvoiceForm, SubmitType } from '../pages/InvoiceForm';
import {
  ACCESS_CODE,
  invoiceTestData,
  deleteInvoiceTestData,
} from '../tests/data/AppData';
import { InvoiceData } from '../tests/data/InvoiceData';
import { FilterForm } from '../pages/FilterForm';

type PagesFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  newInvoiceForm: InvoiceForm;
  editInvoiceForm: { editForm: InvoiceForm; invoiceData: InvoiceData };
  deleteInvoice: { dashboardPage: DashboardPage; invoiceData: InvoiceData };
  filterForm: {
    filter: FilterForm;
    active: InvoiceData;
    deleted: InvoiceData;
  };
};

export const test = baseTest.extend<PagesFixtures>({
  // Navigate to "/"" where the login form is
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  // Enter the access code
  dashboardPage: async ({ loginPage }, use) => {
    await loginPage.enterWithCode(ACCESS_CODE);
    const dashboardPage = new DashboardPage(loginPage.page);
    await use(dashboardPage);
  },
  // Click on "Nueva Factura" so the form is already displayed
  newInvoiceForm: async ({ dashboardPage }, use) => {
    await dashboardPage.clickNewInvoiceButton();
    const newInvoiceForm = new InvoiceForm(dashboardPage.page);
    await use(newInvoiceForm);
  },
  // Create an invoice and click on "Editar Factura" so the form is displayed
  editInvoiceForm: async ({ dashboardPage, newInvoiceForm }, use) => {
    const newInvoice: InvoiceData = await newInvoiceForm.fillAndSubmitFormWith(
      invoiceTestData,
      SubmitType.newInvoice
    );
    await dashboardPage.clickEditButtonOfInvoice(newInvoice.getId());
    const editInvoiceForm = newInvoiceForm;
    await use({ editForm: editInvoiceForm, invoiceData: newInvoice });
    await dashboardPage.deleteInvoiceAndChooseAction(newInvoice.getId(), 'OK');
  },
  // Create an invoice
  deleteInvoice: async ({ dashboardPage, newInvoiceForm }, use) => {
    const newInvoice: InvoiceData = await newInvoiceForm.fillAndSubmitFormWith(
      invoiceTestData,
      SubmitType.newInvoice
    );
    await use({ dashboardPage, invoiceData: newInvoice });
  },
  // Create two invoices: keep one and delete the other
  filterForm: async ({ dashboardPage, newInvoiceForm }, use) => {
    const activeInvoice = await newInvoiceForm.fillAndSubmitFormWith(
      invoiceTestData,
      SubmitType.newInvoice
    );
    await dashboardPage.clickNewInvoiceButton();
    const deletedInvoice = await newInvoiceForm.fillAndSubmitFormWith(
      deleteInvoiceTestData,
      SubmitType.newInvoice
    );
    await dashboardPage.deleteInvoiceAndChooseAction(
      deletedInvoice.getId(),
      'OK'
    );
    const filterForm = new FilterForm(dashboardPage.page);
    await use({
      filter: filterForm,
      active: activeInvoice,
      deleted: deletedInvoice,
    });
    await filterForm.clearFilters();
    await dashboardPage.deleteInvoiceAndChooseAction(
      activeInvoice.getId(),
      'OK'
    );
  },
});

export { expect } from '@playwright/test';
