body.on('click', '.dropdown-item', function () {
  anterior(this.closest(".dropdown-menu")).innerText = this.innerText
})