let sortable = true;
const switchbtn = document.querySelector("#flexSwitchOrdenarFilas");

function switchprendidometodo() {
  if (switchbtn.checked) {
    sortable = !sortable;
    $("tbody").sortable({axis: "y", disabled: false});
  }
};
