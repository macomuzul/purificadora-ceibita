/// <reference types="cypress" />

// import * as tablas from "../utilidades/tablasParaTests.js"
import * as tablas from "../utilidades/tablasParaTests.js"
import * as json from "../utilidades/jsonParaTests.js"

beforeEach(() => {
  cy.visit('http://localhost:3000/registrarventas/1-3-2024')
  // cy.viewport(1366, 570)
})

try {
  describe('validaciones antes de guardar', () => {
    // it("Verifica tablas vacías", async () => {
    //   abrirConfig(e => cy.get('#filasycolumnasdesactivar').check())
    //   cy.get(".grupotabs tab-label label").click('topRight')
    //   cy.get(".swal2-confirm").click()
    //   cy.contains("No se puede borrar, debe haber al menos un camión")
    //   cy.get(".swal2-confirm").click()
    //   compararPeticion(tablas.tablaNormal)
    // })


    // it("Verifica tablas totalmente vacías", async () => {
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
    //   cy.get('#guardar').click()
    //   cy.get('.swal2-confirm').click()
    //   cy.contains("No se puede borrar, debe haber al menos un camión")
    //   cy.get('.swal2-confirm').click()
    // })

    // describe(("Valida que los productos esten llenos"), () => {
    //   it("Valida un solo producto una vez", testear(validarUnSoloProducto, 0))
    //   it("Valida un solo producto varias veces", testear(validarUnSoloProducto, 4))
    //   it("Valida varios productos una vez", testear(validarVariosProductos, 0))
    //   it("Valida varios productos varias veces", testear(validarVariosProductos, 4))
    // })

    // describe(("Valida que los precios esten llenos"), () => {
    //   it("Valida un solo precio una vez", testear(validarUnSoloPrecio, 0))
    //   it("Valida varios precios una vez", testear(validarVariosPrecios, 0))
    //   it("Valida un solo precio varias veces", testear(validarUnSoloPrecio, 4))
    //   it("Valida varios precios varias veces", testear(validarVariosPrecios, 4))
    // })




    // describe("Mezcla validar productos y validar precios", () => {
    //   it("Valida productos y precios una vez", testear(validarPreciosYProductosUnaVez))
    //   it("Valida productos y precios varias veces", testear(validarPreciosYProductosVariasVeces))
    // })

    // it("Añade ceros", testear(añadeCeros))
    // it("Entra mas de lo que sale", testear(entraMasDeLoQueSale))

    // describe("Borra filas vacias", () => {
    //   it("Borra algunas filas", testear(borrarFilasVacias))
    // })
  })

  // describe("configuraciones", () => {
  //   it("muestra x en filas y columnas", testear(filasycolumnaspresionarx))
  //   it("esconde x en filas y columnas1", testear(filasycolumnasdesactivar))
  //   it("esconde x en filas y columnas2", testear(filasycolumnaspresionar1segundo))
  // })

  describe('añadir producto y viajes', () => {
    it("añade producto", testear(añadirProducto))
    it("añade viajes", testear(añadirViaje))
  })

} catch (error) {
  console.log('cagaste wacho')
  console.log(error)
}

function comparar(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "").replaceAll(/ui-sortableui-sortable-disabled/g, "").replaceAll(/class="ui-sortable-handle"/g, "").replaceAll(/class=""/g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  expect(t1).eq(t2)
  return (t1 === t2)
}

async function filasycolumnasdesactivar(resolve) {
  abrirConfig(e => cy.get('#filasycolumnasdesactivar').check())
  seVeSimbolo(resolve, 'none')
}

async function filasycolumnaspresionar1segundo(resolve) {
  abrirConfig(e => cy.get('#filasycolumnaspresionar1segundo').check())
  await seVeSimbolo(resolve, 'none')
}

async function filasycolumnaspresionarx(resolve) {
  abrirConfig(e => cy.get('#filasycolumnaspresionarx').check())
  cy.get('.contenidotabs').should("have.class", "cerrarconboton")
  await seVeSimbolo(resolve, '"❌"')
}

function borrarFilasVacias(resolve) {
  compararPeticion(resolve, json.tablaBorrarFilasVacias1)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}")
  cy.get('#guardar').click()
  cy.contains("Se han detectado filas vacias en la tabla")
  cy.get('#swal2-html-container tab-label:nth-child(2)').click()
  cy.get('#swal2-html-container tab-content:nth-child(2) table').then(tabla => {
    let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaBorrarFilasVacias2)
    expect(resultado).to.be.true
  })
  cy.contains("Borrar las filas vacías").click()
}

function entraMasDeLoQueSale(resolve) {
  compararPeticion(resolve, json.tablaEntraMasDeLoQueSale)
  //fila 1 3 y 4
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(3)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').clear()
  //fila 2 y 5
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("40")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("200")
  cy.get('#guardar').click()
  cy.contains("donde lo que sale es mayor que lo que entra")
  cy.get('.swal2-confirm').click()
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(1) > :nth-child(3)').type("20")
  cy.get('.swal2-confirm').click()
  cy.get('.swal2-confirm').click()
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(2) > :nth-child(4)').type("{backspace}{backspace}{backspace}")
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(2) > :nth-child(4)').type("10")
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(3) > :nth-child(3)').type("5")
  cy.get('.swal2-confirm').click()
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(4) > :nth-child(3)').type("12")
  cy.get('.swal2-confirm').click()
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(5) > :nth-child(4)').type("{backspace}{backspace}{backspace}")
  cy.get('#swal2-html-container > table > .cuerpo > :nth-child(5) > :nth-child(4)').type("30")
  cy.get('.swal2-confirm').click()
}

function añadeCeros(resolve) {
  compararPeticion(resolve, json.tablaAñadeCeros)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').type("{backspace}{backspace}")
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}")
  cy.get('#guardar').click()
}

function validarPreciosYProductosUnaVez(resolve) {
  compararPeticion(resolve, json.tablaValidarPreciosYProductosUnaVez)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(2)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(1)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(2)').clear()
  cy.get('#guardar').click()
  cy.get('tr:nth-child(1) > .enfocar').type("prod1")
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(2) > .enfocar').type("34")
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(3) > .enfocar').type("prod2")
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(5) > .enfocar').type("40.23")
  cy.get('.swal2-confirm').click()
}


function validarPreciosYProductosVariasVeces(resolve) {
  compararPeticion(resolve, json.tablaValidarPreciosYProductosUnaVez)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(2) > td:nth-child(2)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(3) > td:nth-child(1)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(5) > td:nth-child(2)').clear()
  cy.get('#guardar').click()
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(1) > .enfocar').type("prod1")
  cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(1)').clear()
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(2) > .enfocar').type("34")
  cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(2)').clear()
  cy.get('.swal2-confirm').click()
  cy.get('.swal2-confirm').click()
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(3) > .enfocar').type("prod2")
  cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(1)').type("dispensador")
  cy.get('.swal2-confirm').click()
  cy.get('tr:nth-child(5) > .enfocar').type("40.23")
  cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(2)').type("50")
  cy.get('.swal2-confirm').click()
}


function añadirProducto(resolve) {
  cy.get("#añadirProducto").click()
  cy.get('tab-content:nth-child(1) > table').then(tabla => {
    let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaAñadirProductos)
    resolve(resultado)
  })
}

function añadirViaje(resolve) {
  cy.get("#añadirViaje").click()
  cy.get('tab-content:nth-child(1) > table').then(tabla => {
    let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaAñadirViajes)
    resolve(resultado)
  })
}

// async function validarUnSoloProducto(numIteraciones) {
//   return new Promise(resolve => {
//     compararPeticion(resolve, json.tablaValidarProductos)
//     cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear()
//     cy.get('#guardar').click()
//     cy.contains("Se ha detectado valores vacíos en la columna productos")
//     for (let i = 0; i < numIteraciones; i++) {
//       cy.get('.swal2-confirm').click()
//       cy.contains("Se ha detectado valores vacíos en la columna productos")
//     }
//     cy.get('.enfocar').type("aguitas")
//     cy.get('.swal2-confirm').click()
//   })
// }

async function validarUnSoloProducto(resolve, numIteraciones) {
  compararPeticion(resolve, json.tablaValidarProductos)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear()
  cy.get('#guardar').click()
  cy.contains("Se ha detectado valores vacíos en la columna productos")
  for (let i = 0; i < numIteraciones; i++) {
    cy.get('.swal2-confirm').click()
    cy.contains("Se ha detectado valores vacíos en la columna productos")
  }
  cy.get('.enfocar').type("aguitas")
  cy.get('.swal2-confirm').click()
}

async function validarVariosProductos(resolve, numIteraciones) {
  compararPeticion(resolve, json.tablaValidarVariosProductos)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(1)').clear()
  cy.get('#guardar').click()
  cy.contains("Se ha detectado valores vacíos en la columna productos")
  for (let i = 0; i < numIteraciones; i++) {
    cy.get('.swal2-confirm').click()
    cy.contains("Se ha detectado valores vacíos en la columna productos")
  }
  cy.get('tr:nth-child(1) > .enfocar').type("producto1")
  cy.get('tr:nth-child(4) > .enfocar').type("producto2")
  cy.get('.swal2-confirm').click()
}

function validarUnSoloPrecio(resolve, numIteraciones) {
  compararPeticion(resolve, json.tablaValidarPrecios)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(2)').clear()
  cy.get('#guardar').click()
  cy.contains("Se ha detectado valores vacíos en la columna precios")
  for (let i = 0; i < numIteraciones; i++) {
    cy.get('.swal2-confirm').click()
    cy.contains("Se ha detectado valores vacíos en la columna precios")
  }
  cy.get('.enfocar').type("12.23")
  cy.get('.swal2-confirm').click()
}

function validarVariosPrecios(resolve, numIteraciones) {
  compararPeticion(resolve, json.tablaValidarVariosPrecios)
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(1) > td:nth-child(2)').clear()
  cy.get('tab-content:nth-child(1) > table > .cuerpo > tr:nth-child(4) > td:nth-child(2)').clear()
  cy.get('#guardar').click()
  cy.contains("Se ha detectado valores vacíos en la columna precios")
  for (let i = 0; i < numIteraciones; i++) {
    cy.get('.swal2-confirm').click()
    cy.contains("Se ha detectado valores vacíos en la columna precios")
  }
  cy.get('tr:nth-child(1) > .enfocar').type("15")
  cy.get('tr:nth-child(4) > .enfocar').type("20")
  cy.get('.swal2-confirm').click()
}

function abrirConfig(m) {
  cy.get('.configuraciones').click()
  cy.wait(500)
  cy.contains("Ordenar columnas").should("be.visible")
  m()
  cy.get('.modal-footer .guardarconfig').click()
  cy.wait(500)
  cy.contains("Ordenar columnas").should("not.be.visible")
}

function seVeSimbolo(resolve, x) {
  cy.get('tab-content:nth-child(1) > table > :nth-child(5) > :nth-child(1) > .borrarcolumnas').then(el => {
    const win = el[0].ownerDocument.defaultView
    const after = win.getComputedStyle(el[0], 'after')
    resolve(after.getPropertyValue('content') === x)
  })
}

function compararPeticion(resolve, JSONtabla) {
  cy.intercept('/registrarventas/guardar', req => resolve(JSON.stringify(req.body).includes(JSONtabla)))
}

function testear(m, ...params) {
  return async function () {
    let { promise, resolve } = Promise.withResolvers()
    m(resolve, params)
    let s = await promise
    expect(s).to.be.true
  }
}