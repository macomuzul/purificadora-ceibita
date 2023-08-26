require('dotenv').config()
const router = require("express").Router();
const RegistrosEliminados = require("../../models/registroseliminados");
const RegistroVentas = require("../../models/registroventas");
const { DateTime } = require("luxon");
let vencerEn = 600 //diez minutos
const redis = require("../../redis")

let devuelveRegRedis = async url => await redis.get(formatoURL(url))
let guardarRegRedis = async (url, resultado) => await redis.setEx(formatoURL(url), vencerEn, JSON.stringify(resultado))

let validarPagina = (req, res, next) => (/^pag=[0-9]+$/.test(req.params.pag)) ? next() : res.send("página inválida")
let formatoURL = url => `registroseliminados:${url.split("pag")[0]}`
let mandarError = (res, mensaje) => res.status(400).send(mensaje)
let { devuelveUsuario, devuelveFuncionMover } = require("../registrarventas")

router.get("/", (_, res) => res.render("registroseliminados"))
router.post("/restaurarregistro", devuelveFuncionMover(RegistrosEliminados, "No se pudo restaurar el registro"))

router.delete("/borrarregistros", async (req, res) => {
  try {
    let { registros } = req.body;
    let eliminados = await RegistrosEliminados.deleteMany({ _id: { $in: registros } })
    if (eliminados.deletedCount < registros.length) return mandarError(res, registros.length === 1 ? "No se pudo borrar porque el registro no existe" : "No se pudo borrar ningún elemento")
    if (eliminados.deletedCount === registros.length) return res.send("Se ha borrado con éxito")
    res.status(401).send("Hubieron algunos registros que no se pudieron borrar porque ya no existen o fueron borrados antes")
  } catch (e) {
    console.log(e)
    mandarError(res, "No se pudo eliminar uno o más de los registros")
  }
})

router.get("/masrecientes&:pag", validarPagina, async (req, res) => masRecientesYMasAntiguos(req, res, 1))
router.get("/masantiguos&:pag", validarPagina, async (req, res) => masRecientesYMasAntiguos(req, res, 0))

async function masRecientesYMasAntiguos(req, res, rev) {
  try {
    let resultado = await devuelveRegRedis(req.url)
    if (!resultado) {
      resultado = await RegistrosEliminados.find().lean()
      if (rev) resultado.reverse()
      await guardarRegRedis(req.url, resultado)
    }
    else resultado = JSON.parse(resultado)
    mostrarPagina(resultado, req, res)
  } catch (error) {
    res.send("búsqueda inválida")
    console.log(error)
  }
}

router.get("/:buscarpor(fecha|fechaeliminacion)&:rango(igual|mayor|menor|entre)&:fechaP&:pag", validarPagina, async (req, res) => {
  try {
    let resultado = await devuelveRegRedis(req.url)
    if (!resultado) {
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
      resultado = await funcs[rango]()
      await guardarRegRedis(req.url, resultado)
    }
    else resultado = JSON.parse(resultado)
    mostrarPagina(resultado, req, res);
  } catch (error) {
    res.send("búsqueda inválida")
  }
})

function mostrarPagina(resultado, req, res) {
  let limite = 10
  let [url, pagina] = req.originalUrl.split('pag=')
  pagina = parseInt(pagina)
  let totalPaginas = Math.ceil(resultado.length / limite);
  if (totalPaginas === 0) return res.send("no hay ningún registro")
  else if (pagina < 1) return res.send("numero de búsqueda inválido")
  else if (pagina > totalPaginas) return res.redirect(url + "pag=" + totalPaginas)
  let datostablas = resultado.slice(limite * (pagina - 1), limite * pagina)
  res.render("mostrarregistroseliminados", { datostablas, pagina, totalPaginas, DateTime })
}

String.prototype.aFechaUTC = function () { return DateTime.fromFormat(this, "d-M-y") }
String.prototype.aFechaGuatemala = function () { return DateTime.fromFormat(this, "d-M-y", { zone: "America/Guatemala" }) }

module.exports = router