import { test, expect } from '../fixtures/pages';

test('User is able to filter invoices by invoice number', async ({
  dashboardPage,
  filterForm,
}) => {
  const { filter, active, deleted } = filterForm;

  // Search for active invoice
  await filter.enterValuesAndFilter({
    invoiceNumber: active.getInvoiceNumber(),
    showDeleted: false,
  });
  await expect(dashboardPage.getInvoiceRowWithId(active.getId())).toBeVisible();

  // Search for deleted invoice
  await filter.enterValuesAndFilter({
    invoiceNumber: deleted.getInvoiceNumber(),
    showDeleted: true,
  });
  await expect(
    dashboardPage.getInvoiceRowWithId(deleted.getId())
  ).toBeVisible();
});

test('User is able to filter invoices by status', async ({
  dashboardPage,
  filterForm,
}) => {
  const { filter, active, deleted } = filterForm;

  // Search for active invoice
  await filter.enterValuesAndFilter({
    status: active.getStatus(),
    showDeleted: false,
  });
  await expect(dashboardPage.getInvoiceRowWithId(active.getId())).toBeVisible();

  // Search for deleted invoice
  await filter.enterValuesAndFilter({
    status: deleted.getStatus(),
    showDeleted: true,
  });
  await expect(
    dashboardPage.getInvoiceRowWithId(deleted.getId())
  ).toBeVisible();
});

test('User is able to filter invoices by date range', async ({
  dashboardPage,
  filterForm,
}) => {
  const { filter, active, deleted } = filterForm;

  // Search for active invoice
  // Create a date range based on the invoice date
  const activeInitialDate = active.getDatePlusMinusDays(3, 'minus');
  const activeFinalDate = active.getDatePlusMinusDays(3, 'plus');

  await filter.enterValuesAndFilter({
    initialDate: activeInitialDate,
    finalDate: activeFinalDate,
    showDeleted: false,
  });

  await expect(dashboardPage.getInvoiceRowWithId(active.getId())).toBeVisible();

  // Search for deleted invoice
  // Create a date range based on the invoice date
  const deletedInitialDate = deleted.getDatePlusMinusDays(3, 'minus');
  const deletedFinalDate = deleted.getDatePlusMinusDays(3, 'plus');

  await filter.enterValuesAndFilter({
    initialDate: deletedInitialDate,
    finalDate: deletedFinalDate,
    showDeleted: true,
  });

  await expect(
    dashboardPage.getInvoiceRowWithId(deleted.getId())
  ).toBeVisible();
});
