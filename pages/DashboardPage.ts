import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private readonly headerText;

  constructor(public readonly page: Page) {
    this.headerText = this.page.getByText('Sistema de Facturas');
  }

  getHeaderText(): Locator {
    return this.headerText;
  }
}
