import { test, expect } from '../fixtures/pages';
import { InvoiceFields, SubmitType } from '../pages/InvoiceForm';
import { invoiceTestData } from '../tests/data/AppData';

test('User is able to create a new invoice', async ({
  dashboardPage,
  newInvoiceForm,
}) => {
  const newInvoice = await newInvoiceForm.fillAndSubmitFormWith(
    invoiceTestData,
    SubmitType.newInvoice
  );
  await expect(newInvoiceForm.getNewInvoiceHeader()).toBeHidden();
  await expect(
    dashboardPage.getInvoiceRowWithId(newInvoice.getId())
  ).toBeVisible();
});

test('User cannot create an invoice without an invoice number', async ({
  newInvoiceForm,
}) => {
  await newInvoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceTestData,
    InvoiceFields.number
  );
  await expect(
    newInvoiceForm.getErrorMessageOfField(InvoiceFields.number)
  ).toBeVisible();
});

test('User cannot create an invoice without a total amount', async ({
  newInvoiceForm,
}) => {
  await newInvoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceTestData,
    InvoiceFields.total
  );
  await expect(
    newInvoiceForm.getErrorMessageOfField(InvoiceFields.total)
  ).toBeVisible();
});

test('User cannot create an invoice without selecting a status', async ({
  newInvoiceForm,
}) => {
  await newInvoiceForm.tryCreatingInvoiceWithMissingField(
    invoiceTestData,
    InvoiceFields.status
  );
  await expect(
    newInvoiceForm.getErrorMessageOfField(InvoiceFields.status)
  ).toBeVisible();
});

test('User can cancel the creation of a new invoice', async ({
  newInvoiceForm,
}) => {
  await newInvoiceForm.clickCancelButton();
  await expect(newInvoiceForm.getNewInvoiceHeader()).toBeHidden();
});
