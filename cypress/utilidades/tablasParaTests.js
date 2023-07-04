let tablaNormal = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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

export let tablaAñadirProductos = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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
  <tr>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td></td>
  <td class="borrarfilas"></td>
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

export let tablaAñadirViajes = `<table>
<thead></thead>
<colgroup><col><col></colgroup>
  <colgroup class="pintarcolumnas">
    <col span="2">
    <col span="2">
  </colgroup>
<colgroup><col><col></colgroup>
<tbody>
<tr>
  <th rowspan="2" class="prod">Productos</th>
  <th rowspan="2" class="tr">Precio</th>
  <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
  <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 2</th>
  <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
  <th rowspan="2" class="tr">Ingresos</th>
</tr>
<tr class="saleYEntra">
  <th scope="col">Sale</th>
  <th scope="col">Entra</th>
  <th scope="col">Sale</th>
  <th scope="col">Entra</th>
</tr>
</tbody>
<tbody class="cuerpo">
  <tr>
  <td contenteditable="true">garrafón2</td>
  <td contenteditable="true">10</td>
  <td contenteditable="true">99</td>
  <td contenteditable="true">3</td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td>96</td>
  <td class="borrarfilas">960</td></tr>
  <tr>
  <td contenteditable="true">bolsa2</td>
  <td contenteditable="true">5.60</td>
  <td contenteditable="true">14</td>
  <td contenteditable="true">1</td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td>13</td>
  <td class="borrarfilas">72.80</td></tr>
  <tr>
  <td contenteditable="true">boopi</td>
  <td contenteditable="true">25</td>
  <td contenteditable="true">3</td>
  <td contenteditable="true">2</td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td>1</td>
  <td class="borrarfilas">25</td></tr>
  <tr>
  <td contenteditable="true">dispensador</td>
  <td contenteditable="true">50</td>
  <td contenteditable="true">4134</td>
  <td contenteditable="true">2</td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td>4132</td>
  <td class="borrarfilas">206600</td></tr>
  <tr>
  <td contenteditable="true">prueba</td>
  <td contenteditable="true">13.43</td>
  <td contenteditable="true">134</td>
  <td contenteditable="true">1</td>
  <td contenteditable="true"></td>
  <td contenteditable="true"></td>
  <td>133</td>
  <td class="borrarfilas">1786.19</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="6">Total:</td>
    <td>4375</td>
    <td>209443.99</td>
  </tr>
</tfoot>
</table>`

export let tablaValidarProductos = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">aguitas</td>
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

export let tablaValidarVariosProductos = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">producto1</td>
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
    <td contenteditable="true">producto2</td>
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

export let tablaValidarPrecios = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">garrafón2</td>
    <td contenteditable="true">12.23</td>
    <td contenteditable="true">99</td>
    <td contenteditable="true">3</td>
    <td>96</td>
    <td class="borrarfilas">1174.08</td>
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
    <td>209658.07</td>
  </tr>
</tfoot>
</table>`

export let tablaValidarVariosPrecios = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">garrafón2</td>
    <td contenteditable="true">15</td>
    <td contenteditable="true">99</td>
    <td contenteditable="true">3</td>
    <td>96</td>
    <td class="borrarfilas">1440</td>
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
    <td contenteditable="true">20</td>
    <td contenteditable="true">4134</td>
    <td contenteditable="true">2</td>
    <td>4132</td>
    <td class="borrarfilas">82640</td>
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
    <td>85963.99</td>
  </tr>
</tfoot>
</table>`

export let tablaValidarPreciosYProductosUnaVez = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">prod1</td>
    <td contenteditable="true">10</td>
    <td contenteditable="true">99</td>
    <td contenteditable="true">3</td>
    <td>96</td>
    <td class="borrarfilas">960</td>
  </tr>
  <tr>
    <td contenteditable="true">bolsa2</td>
    <td contenteditable="true">34</td>
    <td contenteditable="true">14</td>
    <td contenteditable="true">1</td>
    <td>13</td>
    <td class="borrarfilas">442</td>
  </tr>
  <tr>
    <td contenteditable="true">prod2</td>
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
    <td contenteditable="true">40.23</td>
    <td contenteditable="true">134</td>
    <td contenteditable="true">1</td>
    <td>133</td>
    <td class="borrarfilas">5350.59</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>4375</td>
    <td>213377.59</td>
  </tr>
</tfoot>
</table>`

export let tablaAñadeCeros = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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
    <td contenteditable="true">0</td>
    <td>14</td>
    <td class="borrarfilas">78.40</td>
  </tr>
  <tr>
    <td contenteditable="true">boopi</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">3</td>
    <td contenteditable="true">0</td>
    <td>3</td>
    <td class="borrarfilas">75</td>
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
    <td contenteditable="true">0</td>
    <td>134</td>
    <td class="borrarfilas">1799.62</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>4379</td>
    <td>209513.02</td>
  </tr>
</tfoot>
</table>`

export let tablaEntraMasDeLoQueSale = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
  </tr>
  </tbody>
  <tbody class="cuerpo">
  <tr> 
    <td contenteditable="true">garrafón2</td>
    <td contenteditable="true">10</td>
    <td contenteditable="true">20</td>
    <td contenteditable="true">3</td>
    <td>17</td>
    <td class="borrarfilas">170</td>
  </tr>
  <tr>
    <td contenteditable="true">bolsa2</td>
    <td contenteditable="true">5.60</td>
    <td contenteditable="true">14</td>
    <td contenteditable="true">10</td>
    <td>4</td>
    <td class="borrarfilas">22.40</td>
  </tr>
  <tr>
    <td contenteditable="true">boopi</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">5</td>
    <td contenteditable="true">2</td>
    <td>3</td>
    <td class="borrarfilas">75</td>
  </tr>
  <tr>
    <td contenteditable="true">dispensador</td>
    <td contenteditable="true">50</td>
    <td contenteditable="true">12</td>
    <td contenteditable="true">2</td>
    <td>10</td>
    <td class="borrarfilas">500</td>
  </tr>
  <tr>
    <td contenteditable="true">prueba</td>
    <td contenteditable="true">13.43</td>
    <td contenteditable="true">134</td>
    <td contenteditable="true">30</td>
    <td>104</td>
    <td class="borrarfilas">1396.72</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>138</td>
    <td>2164.12</td>
  </tr>
</tfoot>
</table>`

export let tablaBorrarFilasVacias1 = `<table>
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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
    <td contenteditable="true">boopi</td>
    <td contenteditable="true">25</td>
    <td contenteditable="true">3</td>
    <td contenteditable="true">2</td>
    <td>1</td>
    <td class="borrarfilas">25</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td colspan="4">Total:</td>
    <td>97</td>
    <td>985</td>
  </tr>
</tfoot>
</table>`

export let tablaBorrarFilasVacias2 = `<table><thead></thead><colgroup><col><col></colgroup><colgroupclass="pintarcolumnas"><colspan="2"></colgroup><colgroup><col><col></colgroup><tbody><tr><throwspan="2"class="prod">Productos</th><throwspan="2"class="tr">Precio</th><thcolspan="2"scope="colgroup"class="borrarcolumnas">ViajeNo.1</th><throwspan="2"class="trcolumnaVendidos">Vendidos</th><throwspan="2"class="tr">Ingresos</th></tr><trclass="saleYEntra"><thscope="col">Sale</th><thscope="col">Entra</th></tr></tbody><tbodyclass="cuerpo"><tr><tdcontenteditable="true">garrafón2</td><tdcontenteditable="true">10</td><tdcontenteditable="true">99</td><tdcontenteditable="true">3</td><td>96</td><tdclass="borrarfilas">960</td></tr><tr><tdcontenteditable="true">boopi</td><tdcontenteditable="true">25</td><tdcontenteditable="true">3</td><tdcontenteditable="true">2</td><td>1</td><tdclass="borrarfilas">25</td></tr></tbody><tfoot><tr><tdcolspan="4">Total:</td><td>97</td><td>985</td></tr></tfoot></table>`


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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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
    <th colspan="2" scope="colgroup" class="borrarcolumnas">Viaje No. 1</th>
    <th rowspan="2" class="tr columnaVendidos">Vendidos</th>
    <th rowspan="2" class="tr">Ingresos</th>
  </tr>
  <tr class="saleYEntra">
    <th scope="col">Sale</th>
    <th scope="col">Entra</th>  
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