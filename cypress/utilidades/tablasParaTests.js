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