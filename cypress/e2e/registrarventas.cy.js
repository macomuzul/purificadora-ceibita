/// <reference types="cypress" />

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/registrarventas/1-3-2023')
    cy.get("#añadirProducto").click()
  })
})