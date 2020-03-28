describe('Login to Anna', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed').its('code').should('eq', 0);
    cy.login();
  });

  it('calls the right URL', () => {
    cy.server();
    cy.route('**/action').as('action');

    cy.visit('/');

    cy.findByText('Welcome Home').should('be.visible');
    cy.findByText('scene_1').click();

    cy.wait('@action').its('url').should('eql', 'toto');
  });
});
