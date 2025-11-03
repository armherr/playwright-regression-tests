import { test, expect } from '../fixtures/pages';

test('User is able to delete an invoice', async ({ deleteInvoice }) => {
  const { dashboardPage, invoiceData } = deleteInvoice;
  console.log('Invoice created: ' + invoiceData.getId());
  await dashboardPage.deleteInvoiceAndChooseAction(invoiceData.getId(), 'OK');
  await expect(
    dashboardPage.getInvoiceRowWithId(invoiceData.getId())
  ).toHaveCount(0);
});

test('User is able to cancel the deletion of an invoice', async ({
  deleteInvoice,
}) => {
  const { dashboardPage, invoiceData } = deleteInvoice;
  console.log('Invoice created: ' + invoiceData.getId());
  await dashboardPage.deleteInvoiceAndChooseAction(
    invoiceData.getId(),
    'Cancel'
  );
  await expect(
    dashboardPage.getInvoiceRowWithId(invoiceData.getId())
  ).toBeVisible();
});
