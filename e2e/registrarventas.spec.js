// @ts-check
const { test, expect } = require('@playwright/test');
import * as json from "./utilidades/jsonParaTests";

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/registrarventas/1-3-2024');
});

test.describe("prueba console", () => {
  test("pr", async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'log') {
        let result = contiene(msg.text(), json.jsonSimple);
        expect(result).toBeTruthy();
      }
    });
    await page.locator("#guardar").click();
    await expect(page.locator(".swal2-popup")).toBeVisible();
    await page.locator(".swal2-confirm").click();
    await expect(page.locator(".swal2-popup")).not.toBeVisible();
  });
})

function contiene(t1, t2) {
  t1 = t1.replaceAll(/\n| /g, "")
  t2 = t2.replaceAll(/\n| /g, "")
  return (t1.includes(t2));
}