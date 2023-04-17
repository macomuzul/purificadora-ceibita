$(document).on('click', '.dropdown-item', function () {
    $(this).closest(".dropdown-menu").prev()[0].innerText = this.innerText;
});