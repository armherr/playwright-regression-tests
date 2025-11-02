import { Page, Locator } from '@playwright/test';

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

  getInvoiceWithId(invoiceId: string): Locator {
    return this.page.locator(`th >> text=${invoiceId}`);
  }

  async clickNewInvoiceButton() {
    await this.newInvoiceButton.click();
  }
}
