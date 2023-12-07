// @ts-check
const { test, expect } = require('@playwright/test')
import * as json from "./utilidades/jsonParaTests"

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/registrarventas/1-3-2024')

})

test.describe("prueba console", () => {
  test("prueba repitiendo ingresar camionero", async ({ page }) => {
    page.on('console', log(json.jsonSimple))
    await page.locator("#guardar").click()
    await expect(page.locator(".swal2-popup")).toBeVisible()
    await page.locator("#trabajadorrevisar").fill("nanard")
    await page.locator(".swal2-confirm").click()
    await expect(page.locator(".swal2-success-ring")).toBeVisible()
  })

  test("prueba ingresando camionero", async ({ page }) => {
    page.on('console', log(json.jsonUnCamionero))
    await page.locator(".trabajador").fill("xeresano")
    await page.locator("#guardar").click()
  })

  test('moviendo de lugar los camiones', async ({ page }) => {
    await page.goto('http://localhost:3000/registrarventas/1-3-2024')
    page.on('console', log(json.jsonUnCamionero))
    await page.getByRole('button', { name: 'Configuraciones' }).click()
    await page.getByLabel('Cambiar el orden de los camiones').check()
    await page.getByRole('button', { name: 'Guardar cambios' }).click()
    await page.getByText('+').click()
    await page.getByText('+').click()
    await cambiarOrdenCamiones(page, "[for=tab0]", "[for=tab2]")
    await borrarCamion(page, "Camión 2")
    await borrarCamion(page, "Camión 1")
    await page.locator(".trabajador").fill("xeresano")
    await page.getByRole('button', { name: 'Guardar' }).click()
  })

  test("prueba ingresando productos y viajes", async ({ page }) => {
    page.on('console', log(json.jsonAgregandoProductosYViajes))
    await page.locator(".trabajador").fill("xeresano")
    await page.getByRole('button', { name: 'Añadir producto' }).click()
    await page.getByRole('button', { name: 'Añadir viaje' }).click()
    await page.locator('tr:nth-child(6) > td').first().click()
    await page.locator('tr:nth-child(6) > td').first().fill('yami')
    await page.locator('tr:nth-child(6) > td:nth-child(2)').click()
    await page.locator('tr:nth-child(6) > td:nth-child(2)').type('12.4')
    await page.locator('tr:nth-child(6) > td:nth-child(3)').click()
    await page.locator('tr:nth-child(6) > td:nth-child(3)').type('125')
    await page.locator('tr:nth-child(6) > td:nth-child(4)').click()
    await page.locator('tr:nth-child(6) > td:nth-child(4)').type('32')
    await page.locator('td:nth-child(5)').first().click()
    await page.locator('td:nth-child(5)').first().type('124')
    await page.locator('td:nth-child(5)').first().press('ArrowDown')
    await page.locator('tr:nth-child(2) > td:nth-child(5)').type('125')
    await page.locator('tr:nth-child(2) > td:nth-child(5)').press('ArrowDown')
    await page.locator('tr:nth-child(3) > td:nth-child(5)').type('124')
    await page.locator('tr:nth-child(3) > td:nth-child(5)').press('ArrowDown')
    await page.locator('tr:nth-child(4) > td:nth-child(5)').type('2154')
    await page.locator('tr:nth-child(4) > td:nth-child(5)').press('ArrowDown')
    await page.locator('tr:nth-child(5) > td:nth-child(5)').type('54')
    await page.locator('tr:nth-child(5) > td:nth-child(5)').press('ArrowDown')
    await page.locator('tr:nth-child(6) > td:nth-child(5)').type('12')
    await page.locator('tr:nth-child(6) > td:nth-child(5)').press('ArrowRight')
    await page.locator('tr:nth-child(6) > td:nth-child(6)').type('2')
    await page.locator('tr:nth-child(6) > td:nth-child(6)').press('ArrowUp')
    await page.locator('tr:nth-child(5) > td:nth-child(6)').type('5')
    await page.locator('tr:nth-child(5) > td:nth-child(6)').press('ArrowUp')
    await page.locator('tr:nth-child(4) > td:nth-child(6)').type('2')
    await page.locator('tr:nth-child(4) > td:nth-child(6)').press('ArrowUp')
    await page.locator('tr:nth-child(3) > td:nth-child(6)').type('4')
    await page.locator('tr:nth-child(3) > td:nth-child(6)').press('ArrowUp')
    await page.locator('tr:nth-child(2) > td:nth-child(6)').type('21')
    await page.locator('tr:nth-child(2) > td:nth-child(6)').press('ArrowUp')
    await page.locator('td:nth-child(6)').first().type('42')
    await page.locator("#guardar").click()
  })

  test("prueba cambiando orden de los productos", async ({ page }) => {
    page.on('console', log(json.jsonCambiandoOrdenProductos))
    await page.locator(".trabajador").fill("xeresano")
    await page.getByRole('button', { name: 'Configuraciones' }).click()
    await page.getByLabel('Cambiar el orden de los productos de las tablas').check()
    await page.getByRole('button', { name: 'Guardar cambios' }).click()
    await page.getByRole('cell', { name: 'garrafón2' }).dragTo(await page.getByRole('cell', { name: 'prueba' }), {
      sourcePosition: { x: 70, y: 10},
      targetPosition: { x: 100, y: 30}
    })
    await page.locator("#guardar").click()
  })

  test("prueba cambiando orden de los productos 2", async ({ page }) => {
    page.on('console', log(json.jsonDosTablas))
    await page.locator(".trabajador").fill("xeresano")
    await agregarCamion(page)
    await page.getByRole('textbox').fill("mostro")
    await page.locator("#guardar").click()
  })

  test("prueba dos tablas cambiando orden", async ({ page }) => {
    page.on('console', log(json.jsonDosTablasAlReves))
    await page.locator(".trabajador").fill("xeresano")
    await agregarCamion(page)
    await page.getByRole('textbox').fill("mostro")
    await page.getByRole('button', { name: 'Configuraciones' }).click()
    await page.getByLabel('Cambiar el orden de los camiones').check()
    await page.getByRole('button', { name: 'Guardar cambios' }).click()
    await cambiarOrdenCamiones(page, "[for=tab0]", "[for=tab1]")
    await page.locator("#guardar").click()
  })


  test("prueba poniendo otra plantilla", async ({ page }) => {
    page.on('console', log(json.jsonCambiandoPlantilla))
    await page.locator(".trabajador").fill("xeresano")
    await page.locator('custom-dropdown').click()
    await page.getByText('Otraplantilla').click()
    await page.getByRole('button', { name: 'Sí' }).click()
    await page.getByRole('button', { name: 'Crear plantilla vacía' }).click()
    await page.getByRole('button', { name: 'Sí' }).click()
    await page.locator('td:nth-child(3)').first().click()
    await page.locator('td:nth-child(3)').first().type('123')
    await page.locator('td:nth-child(3)').first().press('ArrowDown')
    await page.locator('tr:nth-child(2) > td:nth-child(3)').type('43')
    await page.locator('tr:nth-child(2) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(3) > td:nth-child(3)').type('1')
    await page.locator('tr:nth-child(3) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(4) > td:nth-child(3)').type('3')
    await page.locator('tr:nth-child(4) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(5) > td:nth-child(3)').type('4')
    await page.locator('tr:nth-child(5) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(6) > td:nth-child(3)').type('1')
    await page.locator('tr:nth-child(6) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(7) > td:nth-child(3)').type('4')
    await page.locator('tr:nth-child(7) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(8) > td:nth-child(3)').type('12')
    await page.locator('tr:nth-child(8) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(9) > td:nth-child(3)').type('4')
    await page.locator('tr:nth-child(9) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(10) > td:nth-child(3)').type('124')
    await page.locator('tr:nth-child(10) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(11) > td:nth-child(3)').type('54')
    await page.locator('tr:nth-child(11) > td:nth-child(3)').press('ArrowDown')
    await page.locator('tr:nth-child(12) > td:nth-child(3)').type('43')
    await page.locator('td:nth-child(4)').first().click()
    await page.locator('td:nth-child(4)').first().type('12')
    await page.locator('tr:nth-child(2) > td:nth-child(4)').type('5')
    await page.locator('tr:nth-child(3) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(4) > td:nth-child(4)').type('3')
    await page.locator('tr:nth-child(4) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(5) > td:nth-child(4)').type('1')
    await page.locator('tr:nth-child(5) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(6) > td:nth-child(4)').type('1')
    await page.locator('tr:nth-child(6) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(7) > td:nth-child(4)').type('2')
    await page.locator('tr:nth-child(7) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(8) > td:nth-child(4)').type('5')
    await page.locator('tr:nth-child(8) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(9) > td:nth-child(4)').type('2')
    await page.locator('tr:nth-child(9) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(10) > td:nth-child(4)').type('12')
    await page.locator('tr:nth-child(10) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(11) > td:nth-child(4)').type('4')
    await page.locator('tr:nth-child(11) > td:nth-child(4)').press('ArrowDown')
    await page.locator('tr:nth-child(12) > td:nth-child(4)').type('12')
    await page.pause()
    await page.locator("#guardar").click()
  })


})

function log(objJSON) {
  return msg => {
    if (msg.type() === 'log') {
      let result = contiene(msg.text(), objJSON)
      console.log("1",objJSON)
      console.log("2",msg.text())
      expect(result).toBeTruthy()
    }
  }
}

async function borrarCamion(page, NoCamion) {
  await page.getByText(NoCamion).click({ position: { x: 85, y: 8 } })
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByRole('button', { name: 'OK' }).click()
}

function contiene(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  return (t1.includes(t2))
}

async function agregarCamion(page) {
  await page.getByText('+').click()
  await page.getByText('Camión 2').click()
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(3)').first().click()
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(3)').first().type('123')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(3)').first().press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').type('54')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(2) > td:nth-child(3)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').type('123')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(3) > td:nth-child(3)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').type('54')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(4) > td:nth-child(3)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').type('2')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(5) > td:nth-child(3)').press('ArrowDown')
  await page.locator('tr:nth-child(6) > td:nth-child(3)').type('123')
  await page.locator('tr:nth-child(7) > td:nth-child(3)').click()
  await page.locator('tr:nth-child(7) > td:nth-child(3)').type('25')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(4)').first().click()
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(4)').first().type('23')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr > td:nth-child(4)').first().press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').type('21')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(2) > td:nth-child(4)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').press('ArrowUp')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').type('4')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(3) > td:nth-child(4)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').type('5')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(4) > td:nth-child(4)').press('ArrowDown')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').type('1')
  await page.locator('div:nth-child(2) > table > .cuerpo > tr:nth-child(5) > td:nth-child(4)').press('ArrowDown')
  await page.locator('tr:nth-child(6) > td:nth-child(4)').type('3')
  await page.locator('tr:nth-child(6) > td:nth-child(4)').press('ArrowDown')
  await page.locator('tr:nth-child(7) > td:nth-child(4)').type('2')
}

async function cambiarOrdenCamiones(page, camion1, camion2) {
  await page.dragAndDrop(camion1, camion2, {
    sourcePosition: { x: 34, y: 20 },
    targetPosition: { x: 70, y: 40 },
  })
  expect(await page.locator(".swal2-container")).toBeVisible()
  await page.getByText('Ok').click()
}