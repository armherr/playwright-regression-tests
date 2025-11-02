import { Page, Locator } from '@playwright/test';

export type InvoiceData = {
  invoiceNumber: string;
  total: string;
  invoiceDate: string;
  status: string;
};

export enum InvoiceFields {
  number,
  total,
  date,
  status,
}

export class InvoiceForm {
  // Form fields
  private readonly newInvoiceHeader;
  private readonly invoiceNumberInput;
  private readonly totalInput;
  private readonly invoiceDateInput;
  private readonly statusSelect;
  // Buttons
  private readonly cancelButton;
  private readonly createInvoiceButton;
  // Error messages
  private readonly invoiceNumberError;
  private readonly totalError;
  private readonly statusError;

  constructor(public readonly page: Page) {
    // New invoice form fields
    this.newInvoiceHeader = this.page.getByText('Crear Nueva Factura');
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

  async enterInvoiceData({
    invoiceNumber,
    total,
    invoiceDate,
    status,
  }: InvoiceData) {
    await this.invoiceNumberInput.fill(invoiceNumber);
    await this.totalInput.fill(total);
    await this.invoiceDateInput.fill(invoiceDate);
    await this.statusSelect.selectOption(status);
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

  async createInvoiceAndGetId(invoiceData: InvoiceData): Promise<string> {
    // Fill the form
    await this.enterInvoiceData(invoiceData);

    // Catch the response of the POST request made after clicking on "Crear Nueva Factura"
    const [response] = await Promise.all([
      this.page.waitForResponse(
        resp => resp.url().includes('/V1/invoices') && resp.status() === 201
      ),
      this.clickCreateInvoiceButton(),
    ]);

    // Get the invoice ID
    const body = await response.json();
    return body.id;
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
