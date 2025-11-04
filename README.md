# Playwright Regression Tests

Framework dedicated to execute the regression E2E tests for the project Candidates-QA
### Tools:
- Playwright
- TypeScript
- GitHub Actions
### Flows covered:
**Log In**
- Log in with correct access code
- Error validation with incorrect access code

**New Invoice**
- Create a new invoice (happy path)
- Error validation (missing fields)
	- Invoice Number
	- Total
	- Status
- Cancel invoice creation

**Delete Invoice**
- Delete an invoice
- Cancel invoice deletion

**Edit Invoice**
- Edit an invoice (happy path)
- Validate form fields population

**Filter Invoices**
- Filter by invoice number (active and deleted)
- Filter by status (active and deleted)
- Filter by date range (active and deleted)

**Navigation**
- Navigate to previous page
- Navigate to next page

**Log out**
- Log out
- Stay logged in
### Issues found:
- The "Editar Factura" date form field is not being populated with the correct value
- Some error messages are displayed in Spanish and others in English
- In the "Filtros de Búsqueda" form, the "Número de Factura" field has the id: "invoiceName"
