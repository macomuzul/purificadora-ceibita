$("body").on("beforeinput", "input", function (e) {
  let letra = event.data === null ? '' : event.data
  if (letra === '"' || letra == "\\")
    e.preventDefault();
});