import { test, expect } from '../fixtures/pages';
import { InvoiceFields } from '../pages/InvoiceForm';
import { getCurrentDateFormatted } from '../utils/dateUtils';

const invoiceData = {
  invoiceNumber: 'INV001',
  total: '1000',
  invoiceDate: getCurrentDateFormatted(),
  status: 'Vigente',
};

test('User is able to create a new invoice', async ({
  dashboardPage,
  invoiceForm,
}) => {
  const newInvoiceId = await invoiceForm.createInvoiceAndGetId(invoiceData);
  await expect(invoiceForm.getNewInvoiceHeader()).toBeHidden();
  await expect(dashboardPage.getInvoiceWithId(newInvoiceId)).toBeVisible();
});

test('User cannot create an invoice without an invoice number', async ({
  invoiceForm,
}) => {
  await invoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceData,
    InvoiceFields.number
  );
  await expect(
    invoiceForm.getErrorMessageOfField(InvoiceFields.number)
  ).toBeVisible();
});

test('User cannot create an invoice without a total amount', async ({
  invoiceForm,
}) => {
  await invoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceData,
    InvoiceFields.total
  );
  await expect(
    invoiceForm.getErrorMessageOfField(InvoiceFields.total)
  ).toBeVisible();
});

test('User cannot create an invoice without selecting a status', async ({
  invoiceForm,
}) => {
  await invoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceData,
    InvoiceFields.status
  );
  await expect(
    invoiceForm.getErrorMessageOfField(InvoiceFields.status)
  ).toBeVisible();
});

test('User can cancel the creation of a new invoice', async ({
  invoiceForm,
}) => {
  await invoiceForm.clickCancelButton();
  await expect(invoiceForm.getNewInvoiceHeader()).toBeHidden();
});
