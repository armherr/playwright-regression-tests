import { test, expect } from '../fixtures/pages';
import { InvoiceFields, SubmitType } from '../pages/InvoiceForm';
import { editInvoiceTestData } from './data/AppData';

test('Edit form fields are correctly populated when form is displayed', async ({
  editInvoiceForm,
}) => {
  const { editForm, invoiceData } = editInvoiceForm;

  await expect(editForm.getFormField(InvoiceFields.number)).toHaveValue(
    invoiceData.getInvoiceNumber()
  );

  await expect(editForm.getFormField(InvoiceFields.total)).toHaveValue(
    invoiceData.getTotal()
  );

  // Failing due to incorrect time in field Fecha de Factura
  await expect(editForm.getFormField(InvoiceFields.date)).toHaveValue(
    invoiceData.getDateForInput()
  );

  await expect(editForm.getFormField(InvoiceFields.status)).toHaveValue(
    invoiceData.getStatus()
  );
});

test('User is able to edit an invoice using valid values', async ({
  dashboardPage,
  editInvoiceForm,
}) => {
  const { editForm, invoiceData } = editInvoiceForm;
  editInvoiceTestData.setDatePlusOneDay();

  await editForm.fillAndSubmitFormWith(
    editInvoiceTestData,
    SubmitType.editInvoice,
    invoiceData.getId()
  );
  const invoiceFromTable = await dashboardPage.getInvoiceDataFromTable(
    invoiceData.getId()
  );

  expect(
    editInvoiceTestData.getInvoiceNumber() ===
      invoiceFromTable.getInvoiceNumber()
  ).toBeTruthy();
  expect(
    editInvoiceTestData.getTotal() === invoiceFromTable.getTotal()
  ).toBeTruthy();
  expect(
    editInvoiceTestData.getDateToCompare() ===
      invoiceFromTable.getDateToCompare()
  );
  expect(editInvoiceTestData.getStatus() === invoiceFromTable.getStatus());
  await expect(editForm.getEditInvoiceHeader()).toBeHidden();
});

// TODO: Add tests trying to submit the form with missing values
