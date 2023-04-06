let sortable = false;
const switchbtn = document.querySelector("#switchOrdenarFilas");

function switchprendidometodo() {
  $("tbody").sortable({ axis: "y", disabled: sortable });
  sortable = !sortable;
};
