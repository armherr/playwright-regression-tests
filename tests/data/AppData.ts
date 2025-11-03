import { InvoiceData } from './InvoiceData';

export const ACCESS_CODE = 'UXTY789@!!1';

export const invoiceTestData = new InvoiceData(
  'NEW001',
  1000,
  new Date(),
  'Vigente'
);

export const editInvoiceTestData = new InvoiceData(
  'EDIT999',
  3456,
  new Date(),
  'Cancelado'
);
