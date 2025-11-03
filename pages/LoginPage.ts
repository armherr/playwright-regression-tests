import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Properties
  private readonly accessCodeInput: Locator;
  private readonly validateCodeButton: Locator;
  private readonly invalidCodeMessage: Locator;
  private readonly accessCodeRequiredMessage: Locator;

  constructor(public readonly page: Page) {
    this.accessCodeInput = this.page.locator('#access-code');
    this.validateCodeButton = this.page.getByRole('button', {
      name: 'Validar Código',
    });
    this.invalidCodeMessage = this.page.getByText(
      'El código de acceso no es válido'
    );
    this.accessCodeRequiredMessage = this.page.getByText(
      'Código de Acceso Requerido'
    );
  }

  // Methods
  async goto() {
    await this.page.goto('/');
  }

  async enterWithCode(code: string) {
    await this.accessCodeInput.fill(code);
    await this.validateCodeButton.click();
  }

  getInvalidCodeMessage(): Locator {
    return this.invalidCodeMessage;
  }

  getAccessCodeRequiredMessage(): Locator {
    return this.accessCodeRequiredMessage;
  }
}
