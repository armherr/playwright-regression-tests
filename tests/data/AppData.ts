import { InvoiceData } from './InvoiceData';

export const ACCESS_CODE = 'UXTY789@!!1';

// Data to pass when creating a new invoice
export const invoiceTestData = new InvoiceData(
  'NEW001',
  1000,
  new Date(),
  'Vigente'
);

// Data to pass when editing an invoice
export const editInvoiceTestData = new InvoiceData(
  'EDIT999',
  3456,
  new Date('2025-12-12'),
  'Cancelado'
);

// Data to pass when creating and then deleting an invoice
export const deleteInvoiceTestData = new InvoiceData(
  'DEL001',
  1989,
  new Date('2026-01-01'),
  'Cancelado'
);
