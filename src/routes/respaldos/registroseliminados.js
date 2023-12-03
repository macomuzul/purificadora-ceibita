const router = require("express").Router()
const RegistrosEliminados = require("../../models/registroseliminados")
const { DateTime } = require("luxon")

let validarPagina = (req, res, next) => (/^pag=[0-9]+$/.test(req.params.pag)) ? next() : res.send("página inválida")
let { devuelveFuncionMover } = require("../registrarventas")

router.get("/", (req, res) => res.render("registroseliminados", { esAdmin: esAdmin(req) }))
router.post("/restaurarregistro", devuelveFuncionMover(RegistrosEliminados, "No se pudo restaurar el registro"))

router.delete("/borrarregistros", tcaccion(async (req, res) => {
  let { registros } = req.body
  let eliminados = await RegistrosEliminados.deleteMany({ _id: { $in: registros } })
  if (eliminados.deletedCount === registros.length) return res.send()
  if (!eliminados.acknowledged) throw new Error()
  if (eliminados.deletedCount === 0) throw new errorDB(registros.length === 1 ? "El registro a borrar ya no existe" : "No se pudo borrar ninguno de los registros porque ya no existen")
  res.status(401).send("Se lograron borrar los registros excepto unos que ya los habías eliminado antes")
}, "Ocurrió un error al intentar eliminar los registros"))


let mostrarPagina = tcrutas(async (req, res, Reg) => {
  let limite = 10
  let [url, pagina] = req.originalUrl.split('pag=')
  pagina = parseInt(pagina)
  let datostablas = await Reg.clone().limit(limite).skip(limite * (pagina - 1))
  let totalPaginas = Math.ceil(await Reg.clone().countDocuments() / limite)
  if (totalPaginas === 0) return res.send("no hay ningún registro")
  else if (pagina < 1) return res.send("numero de búsqueda inválido")
  else if (pagina > totalPaginas) return res.redirect(url + "pag=" + totalPaginas)
  res.render("mostrarregistroseliminados", { datostablas, pagina, totalPaginas, DateTime, esAdmin: esAdmin(req) })
}, "hubo un error al procesar la solicitud")

router.get("/masrecientes&:pag", validarPagina, async (req, res) => masRecientesYMasAntiguos(req, res, 1))
router.get("/masantiguos&:pag", validarPagina, async (req, res) => masRecientesYMasAntiguos(req, res, 0))

async function masRecientesYMasAntiguos(req, res, rev) {
  let Reg = RegistrosEliminados.find().sort(`${rev ? "-" : ""}borradoEl`).lean()
  mostrarPagina(req, res, Reg)
}

router.get("/:buscarpor(fecha|fechaeliminacion)&:rango(igual|mayor|menor|entre)&:fechaP&:pag", validarPagina, tcrutas(async (req, res) => {
  let { buscarpor, rango, fechaP } = req.params
  let [fecha, fecha2] = fechaP.split("y")
  let funcs
  if (buscarpor === "fecha") {
    let fechaiso = fecha.aFechaUTC()
    buscarpor = "registro._id"
    funcs = {
      igual: q => regs.equals(fechaiso),
      menor: q => regs.lte(fechaiso),
      mayor: q => regs.gte(fechaiso),
      entre: q => regs.gte(fechaiso).lte(fecha2.aFechaUTC())
    }
  } else {
    let fechaiso = fecha.aFechaGuatemala()
    buscarpor = "borradoEl"
    funcs = {
      igual: q => regs.gte(fechaiso).lte(fechaiso.endOf("day")),
      menor: q => regs.lte(fechaiso.endOf("day")),
      mayor: q => regs.gte(fechaiso),
      entre: q => regs.gte(fechaiso).lte(fecha2.aFechaGuatemala().endOf("day"))
    }
  }
  let regs = RegistrosEliminados.where(buscarpor).sort(`${rango === "menor" ? "-" : ""}${buscarpor}`).lean()
  let Reg = funcs[rango]()
  mostrarPagina(req, res, Reg)
}, "búsqueda inválida"))

String.prototype.aFechaUTC = function () { return DateTime.fromFormat(this, "d-M-y") }
String.prototype.aFechaGuatemala = function () { return DateTime.fromFormat(this, "d-M-y", { zone: "America/Guatemala" }) }

module.exports = router