const element = document.querySelector(".pagination ul");

element.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, page) {
  let liTag = "";
  let beforePage;
  let afterPage;
  let cantidadnumeros = 7;
  let cantidadnumerosmitad = (cantidadnumeros + 1) / 2;

  if (page > 1) {
    liTag += `<li class="btn prev" onclick="irAPagina(${page - 1})"><span><svg xmlns="http://www.w3.org/2000/svg" class="flechanumeracion normal" viewBox="0 0 24 24">
<path d="M4 12L20 12M4 12L10 6M4 12L10 18" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Ant</span></li>`;
  }

  liTag += `<li class="numb ${(page === 1) ? "active" : "first"} numero${(page === 1)}  tipo${(typeof page)}" onclick="irAPagina(1)"><span>1</span></li>`;
  if (page > cantidadnumerosmitad && totalPages > cantidadnumeros) {
    liTag += `<li class="dots"><span>...</span></li>`;
  }

  beforePage = page - 2;
  afterPage = page + 2;
  if (beforePage < 2) {
    afterPage += 2 - beforePage;
    beforePage = 2;
  }
  if (afterPage >= totalPages) {
    beforePage -= afterPage - totalPages + 1;
    afterPage = totalPages;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength < 2 || plength > totalPages - 1) continue;
    liTag += `<li class="numb ${
      page === plength ? "active" : ""
    }" onclick="irAPagina(${plength})"><span>${plength}</span></li>`;
  }

  if (
    page < totalPages - (cantidadnumerosmitad - 1) &&
    totalPages > cantidadnumeros
  )
    liTag += `<li class="dots"><span>...</span></li>`;

  if (totalPages > 1)
    liTag += `<li class="numb ${
      page === totalPages ? "active" : "last"
    }" onclick="irAPagina(${totalPages})"><span>${totalPages}</span></li>`;

  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="irAPagina(${
      page + 1
    })"><span>Sig<svg xmlns="http://www.w3.org/2000/svg" class="flechanumeracion rotado" viewBox="0 0 24 24">
<path d="M4 12L20 12M4 12L10 6M4 12L10 18" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span></li>`;
  }
  element.innerHTML = liTag;
  return liTag;
}

function irAPagina(pag) {
  window.location = `${document.URL.replace(/pag=[0-9]+/,`pag=${pag}`)}`;
}
