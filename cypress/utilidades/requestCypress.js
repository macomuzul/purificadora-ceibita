export let tablaNormal = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":209443.99}]`

export let tablaValidarProductos = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"aguitas","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":209443.99}]`

export let tablaValidarVariosProductos = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"producto1","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"producto2","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":209443.99}]`

export let tablaValidarPrecios = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":12.23,"viajes":[99,3],"vendidos":96,"ingresos":1174.08},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":209658.07}]`

export let tablaValidarVariosPrecios = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":15,"viajes":[99,3],"vendidos":96,"ingresos":1440},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":20,"viajes":[4134,2],"vendidos":4132,"ingresos":82640},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":85963.99}]`

export let tablaValidarPreciosYProductosUnaVez = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"prod1","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":34,"viajes":[14,1],"vendidos":13,"ingresos":442},{"nombre":"prod2","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":40.23,"viajes":[134,1],"vendidos":133,"ingresos":5350.59}],"totalvendidos":4375,"totalingresos":213377.59}]`

export let tablaAñadeCeros = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":5.6,"viajes":[14,0],"vendidos":14,"ingresos":78.4},{"nombre":"boopi","precio":25,"viajes":[3,0],"vendidos":3,"ingresos":75},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,0],"vendidos":134,"ingresos":1799.62}],"totalvendidos":4379,"totalingresos":209513.02}]`

export let tablaEntraMasDeLoQueSale = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":10,"viajes":[20,3],"vendidos":17,"ingresos":170},{"nombre":"bolsa2","precio":5.6,"viajes":[14,10],"vendidos":4,"ingresos":22.4},{"nombre":"boopi","precio":25,"viajes":[5,2],"vendidos":3,"ingresos":75},{"nombre":"dispensador","precio":50,"viajes":[12,2],"vendidos":10,"ingresos":500},{"nombre":"prueba","precio":13.43,"viajes":[134,30],"vendidos":104,"ingresos":1396.72}],"totalvendidos":138,"totalingresos":2164.12}]`

export let tablaBorrarFilasVacias1 = `"tablas":[{"trabajador":"fdf","productos":[{"nombre":"garrafón2","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25}],"totalvendidos":97,"totalingresos":985}]`

export let tablaBorrarFilasVacias2 = `<table class="tablacompleta"><thead></thead><colgroup><col><col></colgroup><colgroupclass="pintarcolumnas"><colspan="2"></colgroup><colgroup><col><col></colgroup><tbody><tr><throwspan="2"class="prod">Productos</th><throwspan="2"class="tr">Precio</th><thcolspan="2"class="borrarcolumnas">ViajeNo.1</th><throwspan="2"class="trcolumnaVendidos">Vendidos</th><throwspan="2"class="tr">Ingresos</th></tr><trclass="saleYEntra"><th>Sale</th><th>Entra</th></tr></tbody><tbodyclass="cuerpo"><tr><tdcontenteditable="true">garrafón2</td><tdcontenteditable="true">10</td><tdcontenteditable="true">99</td><tdcontenteditable="true">3</td><td>96</td><tdclass="borrarfilas">960</td></tr><tr><tdcontenteditable="true">boopi</td><tdcontenteditable="true">25</td><tdcontenteditable="true">3</td><tdcontenteditable="true">2</td><td>1</td><tdclass="borrarfilas">25</td></tr></tbody><tfoot><tr><tdcolspan="4">Total:</td><td>97</td><td>985</td></tr></tfoot></table>`


export let tablaBorrarFilasTotalmenteVacias = `<table>
<thead></thead>
<colgroup><col><col></colgroup>
  <colgroup class="pintarcolumnas">
    <col span="2">
  </colgroup>
<colgroup><col><col></colgroup>
<tbody>
  <tr>
    <th rowspan="2" class="prod">Productos</th>
    <th rowspan="2" class="tr">Precio</th>
    <th colspan="2" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th>Sale</th>
    <th>Entra</th>
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr>
    <td contenteditable="true">garrafón2</td>
    <td contenteditable="true">10</td>
    <td contenteditable="true">0</td>
    <td contenteditable="true">0</td>
    <td>0</td>
    <td class="borrarfilas">0</td>
  </tr>
  <tr>
    <td contenteditable="true">bolsa2</td>
    <td contenteditable="true">5.60</td>
    <td contenteditable="true">0</td>
    <td contenteditable="true">0</td>
    <td>0</td>
    <td class="borrarfilas">0</td>
  </tr>
  <tr>
    <td contenteditable="true">boopi</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">0</td>
    <td contenteditable="true">0</td>
    <td>0</td>
    <td class="borrarfilas">0</td>
  </tr>
  <tr>
    <td contenteditable="true">dispensador</td>
    <td contenteditable="true">50</td>
    <td contenteditable="true">0</td>
    <td contenteditable="true">0</td>
    <td>0</td>
    <td class="borrarfilas">0</td>
  </tr>
  <tr>
    <td contenteditable="true">prueba</td>
    <td contenteditable="true">13.43</td>
    <td contenteditable="true">0</td>
    <td contenteditable="true">0</td>
    <td>0</td>
    <td class="borrarfilas">0</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>0</td>
    <td>0</td>
  </tr>
</tfoot>
</table>`

export let tablaNormalAbajo = `<table>
<thead></thead>
<colgroup><col><col></colgroup>
  <colgroup class="pintarcolumnas">
    <col span="2">
  </colgroup>
<colgroup><col><col></colgroup>
<tbody>
  <tr>
    <th rowspan="2" class="prod">Productos</th>
    <th rowspan="2" class="tr">Precio</th>
    <th colspan="2" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th>Sale</th>
    <th>Entra</th>
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr>
    <td contenteditable="true">garrafón2</td>
    <td contenteditable="true">10</td>
    <td contenteditable="true">99</td>
    <td contenteditable="true">3</td>
    <td>96</td>
    <td class="borrarfilas">960</td>
  </tr>
  <tr>
    <td contenteditable="true">bolsa2</td>
    <td contenteditable="true">5.60</td>
    <td contenteditable="true">14</td>
    <td contenteditable="true">1</td>
    <td>13</td>
    <td class="borrarfilas">72.80</td>
  </tr>
  <tr>
    <td contenteditable="true">boopi</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">3</td>
    <td contenteditable="true">2</td>
    <td>1</td>
    <td class="borrarfilas">25</td>
  </tr>
  <tr>
    <td contenteditable="true">dispensador</td>
    <td contenteditable="true">50</td>
    <td contenteditable="true">4134</td>
    <td contenteditable="true">2</td>
    <td>4132</td>
    <td class="borrarfilas">206600</td>
  </tr>
  <tr>
    <td contenteditable="true">prueba</td>
    <td contenteditable="true">13.43</td>
    <td contenteditable="true">134</td>
    <td contenteditable="true">1</td>
    <td>133</td>
    <td class="borrarfilas">1786.19</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>4375</td>
    <td>209443.99</td>
  </tr>
</tfoot>
</table>`