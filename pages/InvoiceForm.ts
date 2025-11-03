import { Page, Locator } from '@playwright/test';
import { InvoiceData } from '../tests/data/InvoiceData';

export enum InvoiceFields {
  number,
  total,
  date,
  status,
}

export enum SubmitType {
  newInvoice,
  editInvoice,
}

export class InvoiceForm {
  private readonly newInvoiceHeader;
  private readonly editInvoiceHeader;
  // Form fields
  private readonly invoiceNumberInput;
  private readonly totalInput;
  private readonly invoiceDateInput;
  private readonly statusSelect;
  // Buttons
  private readonly cancelButton;
  private readonly createInvoiceButton;
  private readonly updateInvoiceButton;
  // Error messages
  private readonly invoiceNumberError;
  private readonly totalError;
  private readonly statusError;

  constructor(public readonly page: Page) {
    this.newInvoiceHeader = this.page.getByText('Crear Nueva Factura');
    this.editInvoiceHeader = this.page.getByText('Editar Factura');

    // New / Edit invoice form fields
    this.invoiceNumberInput = this.page.locator('#invoiceNumber');
    this.totalInput = this.page.locator('#total');
    this.invoiceDateInput = this.page.locator('#invoiceDate');
    this.statusSelect = this.page.locator('#status').filter({
      has: this.page.locator('option', { hasText: 'Seleccionar estado' }),
    });
    this.cancelButton = this.page.getByRole('button', { name: 'Cancelar' });
    this.createInvoiceButton = this.page.getByRole('button', {
      name: 'Crear Factura',
    });
    this.updateInvoiceButton = this.page.getByRole('button', {
      name: 'Actualizar Factura',
    });

    // Error messages
    this.invoiceNumberError = this.page.getByText(
      'El número de factura es requerido'
    );
    this.totalError = this.page.getByText('El total debe ser mayor a cero');
    this.statusError = this.page.getByText('El estado es requerido');
  }

  getNewInvoiceHeader(): Locator {
    return this.newInvoiceHeader;
  }

  getEditInvoiceHeader(): Locator {
    return this.editInvoiceHeader;
  }

  // Get input field
  getFormField(field: InvoiceFields): Locator {
    switch (field) {
      case InvoiceFields.number:
        return this.invoiceNumberInput;
        break;
      case InvoiceFields.total:
        return this.totalInput;
        break;
      case InvoiceFields.status:
        return this.statusSelect;
        break;
      case InvoiceFields.date:
        return this.invoiceDateInput;
    }
  }

  // Get error message corresponding to the missing field
  getErrorMessageOfField(field: InvoiceFields): Locator {
    switch (field) {
      case InvoiceFields.number:
        return this.invoiceNumberError;
        break;
      case InvoiceFields.total:
        return this.totalError;
        break;
      case InvoiceFields.status:
        return this.statusError;
        break;
      case InvoiceFields.date:
        throw new Error(
          'User is able to create an invoice without entering a date'
        );
    }
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickCreateInvoiceButton() {
    await this.createInvoiceButton.click();
  }

  async clickUpdateInvoiceButton() {
    this.updateInvoiceButton.click();
  }

  async enterInvoiceData(invoiceData: InvoiceData) {
    await this.invoiceNumberInput.fill(invoiceData.getInvoiceNumber());
    await this.totalInput.fill(invoiceData.getTotal());
    await this.invoiceDateInput.fill(invoiceData.getDateForInput());
    await this.statusSelect.selectOption(invoiceData.getStatus());
  }

  async clearField(field: InvoiceFields) {
    switch (field) {
      case InvoiceFields.number:
        this.invoiceNumberInput.fill('');
        break;
      case InvoiceFields.total:
        this.totalInput.fill('0');
        break;
      case InvoiceFields.date:
        this.invoiceDateInput.fill('');
        break;
      case InvoiceFields.status:
        this.statusSelect.selectOption('Seleccionar estado');
        break;
    }
  }

  async fillAndSubmitFormWith(
    invoiceDataToSubmit: InvoiceData,
    submitType: SubmitType,
    invoiceIdToEdit: string = '-1'
  ): Promise<InvoiceData> {
    // Fill the form
    await this.enterInvoiceData(invoiceDataToSubmit);

    let response;

    switch (submitType) {
      case SubmitType.newInvoice:
        // Catch the response of the POST request made after clicking on "Crear Nueva Factura"
        [response] = await Promise.all([
          this.page.waitForResponse(
            resp => resp.url().includes('/V1/invoices') && resp.status() === 201
          ),
          this.clickCreateInvoiceButton(),
        ]);
        break;
      case SubmitType.editInvoice:
        // Catch the response of the PUT request made after clicking on "Actualizar Factura"
        [response] = await Promise.all([
          this.page.waitForResponse(
            resp =>
              resp.url().includes(`/V1/invoices/${invoiceIdToEdit}`) &&
              resp.status() === 200
          ),
          this.clickUpdateInvoiceButton(),
        ]);
    }

    // Get the invoice data
    const body = await response.json();

    // Format date (server returns DD/MM/YYYY)
    const [datePart, timePart] = body.invoiceDate.split(' ');
    // Extract day, month, year
    const [day, month, year] = datePart.split('/').map(Number);
    // Create a Date object
    const correctDate = new Date(`${year}-${month}-${day} ${timePart}`);

    return new InvoiceData(
      body.invoiceNumber,
      body.total,
      correctDate,
      body.status,
      body.id
    );
  }

  async tryCreatingInvoiceWithMissingField(
    invoiceData: InvoiceData,
    missingField: InvoiceFields
  ) {
    await this.enterInvoiceData(invoiceData);
    await this.clearField(missingField);
    await this.clickCreateInvoiceButton();
  }
}
