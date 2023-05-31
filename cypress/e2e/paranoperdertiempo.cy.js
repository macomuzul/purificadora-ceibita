/* ==== Test Created with Cypress Studio ==== */
it('Pruebas analisis semanas', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:3000/analisis/semanas&uno&23-05-2023');
  cy.get('#chartVendidos > :nth-child(1) > :nth-child(1) > :nth-child(1) > .accordion-button').click();
  cy.get('#acordeonsegundonivel0 > :nth-child(3) > .accordion-header > .accordion-button').click();
  cy.get('#acordeonopciones0 > .accordion-body > .contenedorotrasopciones > :nth-child(6) > :nth-child(2) > .form-check-label').click();
  cy.get('#ordenar20').check();
  cy.get('#acordeonopciones0 > .accordion-body > .contenedorotrasopciones > :nth-child(3) > :nth-child(2) > .form-check-label').click();
  cy.get('#color20').check();
  cy.get('#acordeonsegundonivel0 > :nth-child(4) > .btn').click();
  /* ==== End Cypress Studio ==== */
  /* ==== Generated with Cypress Studio ==== */
  cy.get('#acordeonopciones0 > .accordion-body > .contenedorotrasopciones > :nth-child(6) > :nth-child(1) > .form-check-label').click();
  cy.get('#ordenar10').check();
  cy.get('#acordeonopciones0 > .accordion-body > .contenedorotrasopciones > :nth-child(3) > :nth-child(1) > .form-check-label').click();
  cy.get('#color10').check();
  cy.get('#acordeonsegundonivel0 > :nth-child(4) > .btn').click();
  /* ==== End Cypress Studio ==== */
});