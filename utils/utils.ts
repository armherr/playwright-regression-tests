// Format total amout from invoices table
export function formatTotalFromTable(totalTable: string) {
  // Remove $ sign and ,
  const totalFormatted = totalTable.slice(1).replace(',', '');
  return Number(totalFormatted);
}
