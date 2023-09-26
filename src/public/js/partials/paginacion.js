let irAPagina = pag => location = `${document.URL.replace(/pag=[0-9]+/,`pag=${pag}`)}`;
let svgPaginacion = clase => `<svg xmlns="http://www.w3.org/2000/svg" class="flechanumeracion ${clase}" viewBox="0 0 24 24"><path d="M4 12L20 12M4 12L10 6M4 12L10 18" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

$(q => {
  let cantNums = 7
  let cantNumsMitad = (cantNums + 1) / 2
  let beforePage = pag - 2
  let afterPage = pag + 2
  if (beforePage < 2) {
    afterPage += 2 - beforePage
    beforePage = 2
  }
  if (afterPage >= totalPags) {
    beforePage -= afterPage - totalPags + 1
    afterPage = totalPags
  }

  let liTag = `${pag > 1 ? `<li class="btn prev" onclick="irAPagina(${pag - 1})"><span>${svgPaginacion("normal")}Ant</span></li>` : ""}
  <li class="numb ${pag === 1 ? "active" : "first"}" onclick="irAPagina(1)"><span>1</span></li>
  ${pag > cantNumsMitad && totalPags > cantNums ? `<li class="dots"><span>...</span></li>` : ""}
  ${Array.from({ length: (afterPage-beforePage+1) }, (_, i) => i + beforePage).map(i => `${i < 2 || i > totalPags - 1 ? "" : `<li class="numb ${pag === i ? "active" : ""}" onclick="irAPagina(${i})"><span>${i}</span></li>`}`).join("")}
  ${pag < totalPags - (cantNumsMitad - 1) && totalPags > cantNums ? `<li class="dots"><span>...</span></li>` : ""}
  ${totalPags > 1 ? `<li class="numb ${pag === totalPags ? "active" : "last"}" onclick="irAPagina(${totalPags})"><span>${totalPags}</span></li>` : ""}
  ${pag < totalPags ? `<li class="btn next" onclick="irAPagina(${pag + 1})"><span>Sig${svgPaginacion("rotado")}</span></li>` : ""}`

  $(".pagination ul").html(liTag)
})