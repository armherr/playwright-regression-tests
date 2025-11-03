import { Page, Locator } from '@playwright/test';
import { formatTotalFromTable } from '../utils/utils';
import { InvoiceData } from '../tests/data/InvoiceData';

export type FilterOptions = {
  invoiceNumber?: string;
  status?: string;
  initialDate?: Date;
  finalDate?: Date;
  showDeleted: boolean;
};

export class FilterForm {
  private readonly filterFormHeader: Locator;
  private readonly invoiceNumberInput: Locator;
  private readonly statusSelect: Locator;
  private readonly initialDateInput: Locator;
  private readonly finalDateInput: Locator;
  private readonly showDeletedCheckBox: Locator;
  private readonly searchButton: Locator;
  private readonly clearFilterButton: Locator;

  constructor(public readonly page: Page) {
    this.filterFormHeader = this.page.getByText('Filtros de Búsqueda');
    this.invoiceNumberInput = this.page.locator('#invoiceName');
    this.statusSelect = this.page.locator('#status');
    this.initialDateInput = this.page.locator('#startDate');
    this.finalDateInput = this.page.locator('#endDate');
    this.showDeletedCheckBox = this.page.locator('#showDeleted');
    this.searchButton = this.page.getByRole('button', { name: 'Buscar' });
    this.clearFilterButton = this.page.getByRole('button', {
      name: 'Limpiar Filtros',
    });
  }

  async enterValuesAndFilter(filters: FilterOptions) {
    if (filters.invoiceNumber)
      await this.invoiceNumberInput.fill(filters.invoiceNumber);
    if (filters.status) await this.statusSelect.selectOption(filters.status);
    if (filters.initialDate) {
      const formattedInitialDate = this.formatDateToFilter(filters.initialDate);
      await this.initialDateInput.fill(formattedInitialDate);
    }
    if (filters.finalDate) {
      const formattedFinalDate = this.formatDateToFilter(filters.finalDate);
      await this.finalDateInput.fill(formattedFinalDate);
    }
    if (filters.showDeleted) await this.showDeletedCheckBox.check();

    await this.searchButton.click();
  }

  formatDateToFilter(date: Date): string {
    const pad = (n: Number) => n.toString().padStart(2, '0');
    const formatted =
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate());

    return formatted;
  }
}
