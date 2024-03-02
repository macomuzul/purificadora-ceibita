async function crearToast(){
  let t = await Promise.allSettled([fetch('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css').then(x => x.text()), fetch('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.css').then(x => x.text()), fetch(`https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.js`).then(x => x.text())])
  $("head").append(`<style>
  #toast-container{
    &>div:hover {
      -webkit-box-shadow: 0 0 12px #999;
      box-shadow: 0 0 12px #999;
      opacity: 0.9;
    }

    .toast::before {
      position: absolute;
      font-family: FontAwesome;
      font-size: 24px;
      top: calc(50% - 12px);
      float: left;
      color: #FFF;
      padding-right: 0.5em;
      margin: auto 0.5em auto -1.5em;
      animation: fa-bounce 1s cubic-bezier(.28, .84, .42, 1) 500ms normal 1;
    }

    .toast-error, .toast-info {background-image: none !important;}
    .toast-error::before {content: "\\f06a";}
    .toast-info::before {content: "\\f0e0";}
  }
</style>`)
if (t[1].status === "fulfilled") $("head").append(`<style>${t[1].value}</style>`)
if (t[0].status === "fulfilled") $("head").append(`<style>${t[0].value}</style>`)
  if (t[2].status === "fulfilled") $("body").append(`<script>${t[2].value}</script>`)
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-full-width",
    preventDuplicates: true,
    timeOut: "100000",
    extendedTimeOut: "100000",
  }
  funcionToastr?.()
}
crearToast()