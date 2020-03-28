describe('Login to Anna', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed').its('code').should('eq', 0);
    cy.login();
  });

  it('calls the right URL', () => {
    cy.visit('/routines');

    cy.findByText('Routines').should('be.visible');
    cy.findByText('test at 5am').click();
    cy.findByText('Routine Form').should('be.visible');
    cy.findByText('enabled').click();
    cy.findByText('Save').click();

    cy.findByText('Next: Disabled').should('be.visible');
  });
});
