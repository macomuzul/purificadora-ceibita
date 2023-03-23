/// <reference types="cypress" />

import * as tablas from "../utilidades/tablasParaTests.js"
beforeEach(() => {
  cy.visit('http://localhost:3000/registrarventas/1-3-2023');
})


describe('validaciones antes de guardar', () => {
  it('valida productos', async () => {
    devuelveCuerpo().then(async cuerpo => {
      cuerpo.querySelector("tr:first-child td:first-child").textContent = "";
      cy.get("#guardar").click();
      cy.contains("Se ha detectado valores vacíos")
      cy.get("#swal2-html-container .cuerpo tr:first-child td:first-child").then(async celda => {
        celda.get(0).textContent = "aguitas";
      })
      cy.get(".swal2-confirm").click()
      devuelveTablaActiva().then((tabla) => {
        comparar(tabla.outerHTML, tablas.tablaValidarProductos)
      })
    })
  })

  it('valida productos varias veces', async () => {
    devuelveCuerpo().then(async cuerpo => {
      cuerpo.querySelector("tr:first-child td:first-child").textContent = "";
      cy.get("#guardar").click();
      cy.contains("Se ha detectado valores vacíos")
      cy.get(".swal2-confirm").click()
      cy.contains("Se ha detectado valores vacíos")
      cy.get(".swal2-confirm").click()
      cy.contains("Se ha detectado valores vacíos")
      cy.get("#swal2-html-container .cuerpo tr:first-child td:first-child").type("aguitas")
      cy.get(".swal2-confirm").click()
      devuelveTablaActiva().then((tabla) => {
        comparar(tabla.outerHTML, tablas.tablaValidarProductos)
      })
    })
  })
  

  
  // it('valida precios', async () => {
  //   devuelveCuerpo().then(async cuerpo => {
  //     cuerpo.querySelector("tr:first-child td:first-child").textContent = "";
  //     cy.get("#guardar").click();
  //     cy.contains("Se ha detectado valores vacíos")
  //     cy.get("#swal2-html-container .cuerpo tr:first-child td:nth-child(2)").then(async celda => {
  //       celda.get(0).textContent = "10";
  //     })
  //     cy.get(".swal2-confirm").click()
  //     devuelveTablaActiva().then((tabla) => {
  //       comparar(tabla.outerHTML, tablas.tablaValidarProductos)
  //     })
  //   })
  // })
  // it('valida precios varias veces', async () => {
  //   devuelveCuerpo().then(async cuerpo => {
  //     cuerpo.querySelector("tr:first-child td:nth-child(2)").textContent = "";
  //     cy.get("#guardar").click();
  //     cy.contains("Se ha detectado valores vacíos")
  //     cy.get(".swal2-confirm").click()
  //     cy.contains("Se ha detectado valores vacíos")
  //     cy.get(".swal2-confirm").click()
  //     cy.contains("Se ha detectado valores vacíos")
  //     cy.get("#swal2-html-container .cuerpo tr:first-child td:first-child").then(async celda => {
  //       celda.get(0).textContent = "10";
  //     })
  //     cy.get(".swal2-confirm").click()
  //     devuelveTablaActiva().then((tabla) => {
  //       comparar(tabla.outerHTML, tablas.tablaValidarProductos)
  //     })
  //   })
  // })
})

// describe('añadir producto y viajes', () => {
//   it('añade producto', async () => {
//     cy.get("#añadirProducto").click();
//     let tabla = await devuelveTablaActiva()
//     comparar(tabla.outerHTML, tablas.tablaAñadirProductos)
//   })
//   it('añade viajes', async () => {
//     cy.get("#añadirViaje").click();
//     let tabla = await devuelveTablaActiva()
//     comparar(tabla.outerHTML, tablas.tablaAñadirViajes)
//   })
// })


function comparar(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  expect(t1).eq(t2)
}

function devuelveCuerpo() {
  return new Cypress.Promise(async (resolve, reject) => {
    devuelveTablaActiva().then((tabla) => {
      resolve(tabla.querySelector(".cuerpo"));
    })
  })
}

function devuelveTablaActiva() {
  return new Cypress.Promise(async (resolve, reject) => {
    devuelveTabID().then((idTab) => {
      cy.get(`.contenidotabs [data-tabid="${idTab}"] table`).then(tablaActiva => {
        resolve(tablaActiva.get(0));
      });
    })
  })
}

function devuelveTabID() {
  return new Cypress.Promise((resolve, reject) => {
    cy.get('.tabs__radio:checked').first().then(tabActiva => {
      resolve(tabActiva.get(0).dataset.tabid)
    });
  })
}