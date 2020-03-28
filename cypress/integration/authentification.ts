describe('Login to Anna', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed').its('code').should('eq', 0);
  });

  it('warns user when credential are wrong', () => {
    cy.visit('/');

    cy.findByLabelText('Username').type('cypress');
    cy.findByLabelText('Password').type('wrong_password');
    cy.findByText('Submit').click();
    cy.findByText('Invalid credential').should('be.visible');

    cy.findByLabelText('Password').clear().type('anna');
    cy.findByText('Submit').click();
    cy.findByText('Welcome Home').should('be.visible');
  });
});
