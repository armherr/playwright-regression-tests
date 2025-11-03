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
  new Date('2025-12-12'),
  'Cancelado'
);

export const deleteInvoiceTestData = new InvoiceData(
  'DEL001',
  1989,
  new Date('2026-01-01'),
  'Cancelado'
);
