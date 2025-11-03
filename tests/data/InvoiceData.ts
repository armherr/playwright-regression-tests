export class InvoiceData {
  private readonly invoiceNumber: string;
  private readonly total: number;
  private readonly invoiceDate: Date;
  private readonly status: string;
  private readonly id: number;

  constructor(
    invoiceNumber: string,
    total: number,
    invoiceDate: Date,
    status: string,
    id: number = -1
  ) {
    this.invoiceNumber = invoiceNumber;
    this.total = total;
    this.invoiceDate = invoiceDate;
    this.status = status;
    this.id = id;
  }

  getId() {
    return this.id.toString();
  }

  getInvoiceNumber() {
    return this.invoiceNumber;
  }

  getTotal() {
    return this.total.toString();
  }

  getInvoiceDate() {
    return this.invoiceDate;
  }

  getStatus() {
    return this.status;
  }

  // Return date in format YYYY-MM-DDTHH:MM
  getDateForInput(): string {
    const pad = (n: Number) => n.toString().padStart(2, '0');
    const formatted =
      this.invoiceDate.getFullYear() +
      '-' +
      pad(this.invoiceDate.getMonth() + 1) +
      '-' +
      pad(this.invoiceDate.getDate()) +
      'T' +
      pad(this.invoiceDate.getHours()) +
      ':' +
      pad(this.invoiceDate.getMinutes());

    return formatted;
  }

  // Return the invoice date +/- a number of days
  getDatePlusMinusDays(days: number, action: 'plus' | 'minus') {
    const currDate = new Date(this.invoiceDate);
    if (action === 'plus') currDate.setDate(this.invoiceDate.getDate() + days);
    else currDate.setDate(this.invoiceDate.getDate() - days);
    return currDate;
  }

  // Format date to compare it with what is displayed in the table
  getDateToCompare(): string {
    return this.invoiceDate.toString().slice(0, 21);
  }
}
