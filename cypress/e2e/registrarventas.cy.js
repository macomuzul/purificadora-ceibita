/// <reference types="cypress" />

import * as tablas from "../utilidades/tablasParaTests.js"
import * as json from "../utilidades/jsonParaTests.js"

beforeEach(() => {
  cy.visit('http://localhost:3000/registrarventas/1-3-2024');
  cy.get("input.trabajador").type("aaa");
  cy.viewport(1366, 570);
})

describe('validaciones antes de guardar', () => {

  it("Verifica tablas vacías", async () => {
    let resultado = await borrarCamiones();
    expect(resultado).to.be.true;
  });

  it("Verifica tablas totalmente vacías", async () => {
    let resultado = await borrarFilasVaciasTotalmenteVacias();
    expect(resultado).to.be.true;
  });

    describe(("Valida que los productos esten llenos"), () => {
      it("validacion un solo producto una vez", async () => {
        let resultado = await validarUnSoloProducto(0);
        expect(resultado).to.be.true;
      })

      it("validacion varios productos una vez", async () => {
        let resultado = await validarVariosProductos(0);
        expect(resultado).to.be.true;
      })

      it("validacion un solo producto varias veces", async () => {
        let resultado = await validarUnSoloProducto(4);
        expect(resultado).to.be.true;
      })

      it("validacion varios productos varias veces", async () => {
        let resultado = await validarVariosProductos(4);
        expect(resultado).to.be.true;
      })
    })

    describe(("Valida que los precios esten llenos"), () => {
      it("validacion un solo precio una vez", async () => {
        let resultado = await validarUnSoloPrecio(0);
        expect(resultado).to.be.true;
      })

      it("validacion varios precios una vez", async () => {
        let resultado = await validarVariosPrecios(0);
        expect(resultado).to.be.true;
      })

      it("validacion un solo precio varias veces", async () => {
        let resultado = await validarUnSoloPrecio(4);
        expect(resultado).to.be.true;
      })

      it("validacion varios precios varias veces", async () => {
        let resultado = await validarVariosPrecios(4);
        expect(resultado).to.be.true;
      })
    })

  describe("Mezcla validar productos y validar precios", () => {
    it("Valida productos y precios una vez", async () => {
      let resultado = await validarPreciosYProductosUnaVez();
      expect(resultado).to.be.true;
    });
    it("Valida productos y precios varias veces", async () => {
      let resultado = await validarPreciosYProductosVariasVeces();
      expect(resultado).to.be.true;
    });
  });

  it("Añade ceros", async () => {
    let resultado = await añadeCeros();
    expect(resultado).to.be.true;
  });

  it("Entra mas de lo que sale", async () => {
    let resultado = await entraMasDeLoQueSale();
    expect(resultado).to.be.true;
  });

  describe("Borra filas vacias", () => {
    it("Borra algunas filas", async () => {
      let resultado = await borrarFilasVacias();
      expect(resultado).to.be.true;
    });
  });

})

describe("configuraciones", () => {
  it("muestra x en filas y columnas", async () => {
    let resultado = await filasycolumnaspresionarx();
    expect(resultado).to.be.true;
  });
  it("esconde x en filas y columnas1", async () => {
    let resultado = await filasycolumnasdesactivar();
    expect(resultado).to.be.true;
  });
  it("esconde x en filas y columnas2", async () => {
    let resultado = await filasycolumnaspresionar1segundo();
    expect(resultado).to.be.true;
  });
});

describe('añadir producto y viajes', () => {
  it('añade producto', async () => {
    let resultado = await añadirProducto();
    expect(resultado).to.be.true;
  })
  it('añade viajes', async () => {
    let resultado = await añadirViaje();
    expect(resultado).to.be.true;
  })
})


function contiene(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  expect(t1).to.contain(t2);
  return (t1.contains(t2));
}

function comparar(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  expect(t1).eq(t2);
  return (t1 === t2);
}

function filasycolumnasdesactivar() {
  return new Promise(resolve => {
    cy.get('.configuraciones').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("be.visible");
    cy.get('#filasycolumnasdesactivar').check();
    cy.get('.modal-footer .guardarconfig').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("not.be.visible");
    cy.get('[data-tabid="0"] > table > :nth-child(5) > :nth-child(1) > .borrarcolumnas').then(el => {
      const win = el[0].ownerDocument.defaultView;
      const after = win.getComputedStyle(el[0], 'after');
      const contenidoAfter = after.getPropertyValue('content');
      if (contenidoAfter === 'none')
        resolve(true);
      else
        resolve(false);
    })
  });
}

function filasycolumnaspresionar1segundo() {
  return new Promise(resolve => {
    cy.get('.configuraciones').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("be.visible");
    cy.get('#filasycolumnaspresionar1segundo').check();
    cy.get('.modal-footer .guardarconfig').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("not.be.visible");
    cy.get('[data-tabid="0"] > table > :nth-child(5) > :nth-child(1) > .borrarcolumnas').then(el => {
      const win = el[0].ownerDocument.defaultView;
      const after = win.getComputedStyle(el[0], 'after');
      const contenidoAfter = after.getPropertyValue('content');
      if (contenidoAfter === 'none')
        resolve(true);
      else
        resolve(false);
    })
  });
}

function filasycolumnaspresionarx() {
  return new Promise(resolve => {
    cy.get('.configuraciones').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("be.visible");
    cy.get('#filasycolumnaspresionarx').check();
    cy.get('.modal-footer .guardarconfig').click();
    cy.wait(500)
    cy.contains("Ordenar alfabéticamente").should("not.be.visible");
    cy.get('.contenidotabs').should("have.class", "cerrarconboton")
    cy.get('[data-tabid="0"] > table > :nth-child(5) > :nth-child(1) > .borrarcolumnas').then(el => {
      const win = el[0].ownerDocument.defaultView;
      const after = win.getComputedStyle(el[0], 'after');
      const contenidoAfter = after.getPropertyValue('content');
      if (contenidoAfter === '"❌"')
        resolve(true);
      else
        resolve(false);
    })
  });
}

function borrarFilasVacias() {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('#guardar').click();
    cy.contains("Se han detectado filas vacias en la tabla");
    cy.get('[for="tabswal1"]').click();
    cy.get('#tabswal1 + label + .tabs__content table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaBorrarFilasVacias2)
      expect(resultado).to.be.true;
    });
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaBorrarFilasVacias1)
      resolve(resultado);
    });
  });
}

function borrarCamiones() {
  return new Promise(resolve => {
    try {
      cy.get('.configuraciones').click();
      cy.wait(500)
      cy.contains("Ordenar alfabéticamente").should("be.visible");
      cy.get('#filasycolumnasdesactivar').check();
      cy.get('.modal-footer .guardarconfig').click();
      cy.wait(500)
      cy.contains("Ordenar alfabéticamente").should("not.be.visible");
      cy.get(".grupotabs .tabs__label").click('topRight');
      cy.get(".swal2-confirm").click();
      cy.contains("No se puede borrar, debe haber al menos un camión")
      cy.get(".swal2-confirm").click();
      cy.get('[data-tabid="0"] > table').then(tabla => {
        let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaNormalAbajo)
        resolve(resultado);
      })
    }
    catch
    {
      resolve(false);
    }

  });
}

function borrarFilasVaciasTotalmenteVacias() {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}{backspace}{backspace}");
    cy.get('#guardar').click();
    cy.get('.swal2-confirm').click();
    cy.contains("No se puede borrar, debe haber al menos un camión");
    cy.get('.swal2-confirm').click().then(() => {
      resolve(true);
    })

  });
}

function entraMasDeLoQueSale() {
  return new Promise(resolve => {
    //fila 1 3 y 4
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(3)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').clear();
    //fila 2 y 5
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("40");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("200");
    cy.get('#guardar').click();
    cy.contains("donde lo que sale es mayor que lo que entra");
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(1) > :nth-child(3)').type("20");
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(2) > :nth-child(4)').type("{backspace}{backspace}{backspace}");
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(2) > :nth-child(4)').type("10");
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(3) > :nth-child(3)').type("5");
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(4) > :nth-child(3)').type("12");
    cy.get('.swal2-confirm').click();
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(5) > :nth-child(4)').type("{backspace}{backspace}{backspace}");
    cy.get('#swal2-html-container > table > .cuerpo > :nth-child(5) > :nth-child(4)').type("30");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaEntraMasDeLoQueSale)
      resolve(resultado);
    })
  });
}

function añadeCeros() {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type("{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').type("{backspace}{backspace}");
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type("{backspace}{backspace}");
    cy.get('#guardar').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaAñadeCeros)
      resolve(resultado);
    })
  });
}

function validarPreciosYProductosVariasVeces() {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(2)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(1)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(2)').clear();
    cy.get('#guardar').click();
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(1) > .enfocar').type("prod1");
    cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(1)').clear();
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(2) > .enfocar').type("34");
    cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(2)').clear();
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(3) > .enfocar').type("prod2");
    cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(1)').type("dispensador");
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(5) > .enfocar').type("40.23");
    cy.get('.swal2-html-container tr:nth-child(4) > td:nth-child(2)').type("50");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarPreciosYProductosUnaVez)
      resolve(resultado);
    })
  });
}

function validarPreciosYProductosUnaVez() {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(2) > td:nth-child(2)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(3) > td:nth-child(1)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(5) > td:nth-child(2)').clear();
    cy.get('#guardar').click();
    cy.get('tr:nth-child(1) > .enfocar').type("prod1");
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(2) > .enfocar').type("34");
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(3) > .enfocar').type("prod2");
    cy.get('.swal2-confirm').click();
    cy.get('tr:nth-child(5) > .enfocar').type("40.23");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarPreciosYProductosUnaVez)
      resolve(resultado);
    })
  });
}

function añadirProducto() {
  return new Promise(resolve => {
    cy.get("#añadirProducto").click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaAñadirProductos);
      resolve(resultado);
    })
  })
}

function añadirViaje() {
  return new Promise(resolve => {
    cy.get("#añadirViaje").click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaAñadirViajes);
      resolve(resultado);
    })
  })
}

function validarUnSoloProducto(numIteraciones) {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear();
    cy.get('#guardar').click();
    cy.contains("Se ha detectado valores vacíos en la columna productos");
    for (let i = 0; i < numIteraciones; i++) {
      cy.get('.swal2-confirm').click();
      cy.contains("Se ha detectado valores vacíos en la columna productos");
    }
    cy.get('.enfocar').type("aguitas");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarProductos)
      resolve(resultado);
    })
  });
}

function validarVariosProductos(numIteraciones) {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(1)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(1)').clear();
    cy.get('#guardar').click();
    cy.contains("Se ha detectado valores vacíos en la columna productos");
    for (let i = 0; i < numIteraciones; i++) {
      cy.get('.swal2-confirm').click();
      cy.contains("Se ha detectado valores vacíos en la columna productos");
    }
    cy.get('tr:nth-child(1) > .enfocar').type("producto1");
    cy.get('tr:nth-child(4) > .enfocar').type("producto2");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then(tabla => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarVariosProductos)
      resolve(resultado);
    })
  })
}

function validarUnSoloPrecio(numIteraciones) {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(2)').clear();
    cy.get('#guardar').click();
    cy.contains("Se ha detectado valores vacíos en la columna precios");
    for (let i = 0; i < numIteraciones; i++) {
      cy.get('.swal2-confirm').click();
      cy.contains("Se ha detectado valores vacíos en la columna precios");
    }
    cy.get('.enfocar').type("12.23");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then((tabla) => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarPrecios);
      resolve(resultado);
    })
  });
}

function validarVariosPrecios(numIteraciones) {
  return new Promise(resolve => {
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(1) > td:nth-child(2)').clear();
    cy.get('[data-tabid="0"] > table > .cuerpo > tr:nth-child(4) > td:nth-child(2)').clear();
    cy.get('#guardar').click();
    cy.contains("Se ha detectado valores vacíos en la columna precios");
    for (let i = 0; i < numIteraciones; i++) {
      cy.get('.swal2-confirm').click();
      cy.contains("Se ha detectado valores vacíos en la columna precios");
    }
    cy.get('tr:nth-child(1) > .enfocar').type("15");
    cy.get('tr:nth-child(4) > .enfocar').type("20");
    cy.get('.swal2-confirm').click();
    cy.get('[data-tabid="0"] > table').then((tabla) => {
      let resultado = comparar(tabla.get(0).outerHTML, tablas.tablaValidarVariosPrecios);
      resolve(resultado);
    })
  });
}