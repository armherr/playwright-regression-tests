import { Page, Locator } from '@playwright/test';
import { formatTotalFromTable } from '../utils/utils';
import { InvoiceData } from '../tests/data/InvoiceData';

export class DashboardPage {
  private readonly headerText;
  private readonly newInvoiceButton;

  constructor(public readonly page: Page) {
    this.headerText = this.page.getByText('Sistema de Facturas');
    this.newInvoiceButton = this.page.getByRole('button', {
      name: 'Nueva Factura',
    });
  }

  getHeaderText(): Locator {
    return this.headerText;
  }

  getInvoiceRowWithId(invoiceId: string): Locator {
    return this.page.locator(`tr:has(th:has-text("${invoiceId}"))`);
  }

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
      formatTotalFromTable(total),
      new Date(invoiceDate),
      status,
      Number(invoiceId)
    );
  }

  async clickNewInvoiceButton() {
    await this.newInvoiceButton.click();
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

  async deleteInvoiceAndChooseAction(
    invoiceId: string,
    action: 'OK' | 'Cancel'
  ) {
    this.page.once('dialog', async dialog => {
      if (action === 'OK') await dialog.accept();
      else await dialog.dismiss();
    });

    await this.clickDeleteButtonOfInvoice(invoiceId);
  }
}
