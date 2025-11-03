import { test, expect } from '../fixtures/pages';

test('User can navigate to the next page in the invoices table', async ({
  dashboardPage,
}) => {
  const { first: firstP1, last: lastP1 } =
    await dashboardPage.getFirstAndLastInvoicesInPage();
  console.log(`Page 1 - First: ${firstP1} & Last: ${lastP1}`);
  await dashboardPage.goToNextPage();
  const { first: firstP2, last: lastP2 } =
    await dashboardPage.getFirstAndLastInvoicesInPage();
  console.log(`Page 2 - First: ${firstP2} & Last: ${lastP2}`);
  expect(firstP1 !== firstP2).toBeTruthy();
  expect(lastP1 !== lastP2).toBeTruthy();
});

test('User can navigate to the previous page in the invoices table', async ({
  dashboardPage,
}) => {
  await dashboardPage.goToNextPage();
  const { first: firstP2, last: lastP2 } =
    await dashboardPage.getFirstAndLastInvoicesInPage();
  console.log(`Page 2 - First: ${firstP2} & Last: ${lastP2}`);
  await dashboardPage.goToPreviousPage();
  const { first: firstP1, last: lastP1 } =
    await dashboardPage.getFirstAndLastInvoicesInPage();
  console.log(`Page 1 - First: ${firstP1} & Last: ${lastP1}`);
  expect(firstP1 !== firstP2).toBeTruthy();
  expect(lastP1 !== lastP2).toBeTruthy();
});
