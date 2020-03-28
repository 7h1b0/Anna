Cypress.Commands.add('login', () => {
  cy.clearLocalStorage().then(() => {
    localStorage.setItem('username', 'cypress');
    localStorage.setItem('token', '8e6a76928f76d23665f78ff3688ca86422d5');
  });
});
