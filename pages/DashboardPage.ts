import { Page, Locator } from '@playwright/test';
import { InvoiceData } from '../tests/data/InvoiceData';

export class DashboardPage {
  private readonly headerText;
  private readonly newInvoiceButton;
  private readonly previousPageButton;
  private readonly nextPageButton;
  private readonly logoutButton;

  constructor(public readonly page: Page) {
    this.headerText = this.page.getByText('Sistema de Facturas');
    this.newInvoiceButton = this.page.getByRole('button', {
      name: 'Nueva Factura',
    });
    this.previousPageButton = this.page.getByRole('button', {
      name: 'Previous',
    });
    this.nextPageButton = this.page.getByRole('button', { name: 'Next' });
    this.logoutButton = this.page.getByRole('button', {
      name: 'Cerrar Sesión',
    });
  }

  getHeaderText(): Locator {
    return this.headerText;
  }

  // Get <tr> element by invoice Id
  getInvoiceRowWithId(invoiceId: string): Locator {
    return this.page.locator(`tr:has(th:has-text("${invoiceId}"))`);
  }

  // Create an InvoiceData object with the info displayed in the table row
  async getInvoiceDataFromTable(invoiceId: string): Promise<InvoiceData> {
    const invoiceRow = this.getInvoiceRowWithId(invoiceId);
    const cells = invoiceRow.locator('td');

    const invoiceNumber = (await cells.nth(0).textContent()) ?? '';
    const total = (await cells.nth(1).textContent()) ?? '';
    const invoiceDate = (await cells.nth(2).textContent()) ?? '';
    const status =
      (await cells.nth(3).locator('span').textContent())?.trim() ?? '';

    return new InvoiceData(
      invoiceNumber,
      DashboardPage.formatTotalFromTable(total),
      new Date(invoiceDate),
      status,
      Number(invoiceId)
    );
  }

  async clickNewInvoiceButton() {
    await this.newInvoiceButton.click();
  }

  async goToPreviousPage() {
    await this.previousPageButton.click();
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  // Get the first and last ids displayed in the current page of the invoices table
  async getFirstAndLastInvoicesInPage() {
    const firstRow = this.page.locator('table tbody tr').first();
    const lastRow = this.page.locator('table tbody tr').last();

    const firstId = await firstRow.locator('th').textContent();
    const lastId = await lastRow.locator('th').textContent();

    return { first: firstId, last: lastId };
  }

  async clickEditButtonOfInvoice(invoiceId: string) {
    const invoiceRow = this.getInvoiceRowWithId(invoiceId);
    const editButton = invoiceRow.getByRole('button', {
      name: 'Editar factura',
    });
    await editButton.click();
  }

  async clickDeleteButtonOfInvoice(invoiceId: string) {
    const invoiceRow = this.getInvoiceRowWithId(invoiceId);
    const deleteButton = invoiceRow.getByRole('button', {
      name: 'Eliminar factura',
    });
    await deleteButton.click();
  }

  // Try to delete an invoice with the option to cancel the flow
  async deleteInvoiceAndChooseAction(
    invoiceId: string,
    action: 'OK' | 'Cancel'
  ) {
    this.page.once('dialog', async dialog => {
      action === 'OK' ? await dialog.accept() : await dialog.dismiss();
    });

    await this.clickDeleteButtonOfInvoice(invoiceId);
  }

  // Try to log out with the option to stay logged in
  async clickLogoutAndChooseAction(action: 'OK' | 'Cancel') {
    this.page.once('dialog', async dialog => {
      action === 'OK' ? await dialog.accept() : await dialog.dismiss();
    });

    await this.logoutButton.click();
  }

  // Format total amout from invoices table
  static formatTotalFromTable(totalTable: string) {
    // Remove $ sign and ,
    const totalFormatted = totalTable.slice(1).replace(',', '');
    return Number(totalFormatted);
  }
}
