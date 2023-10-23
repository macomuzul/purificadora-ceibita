const router = require('express').Router()
const Plantilla = require('../models/plantillas')

let objUpdate = (nombre, update) => ({ updateOne: { filter: { nombre }, update } })

router.route('/').get(async (req, res) => {
  let plantillas = await Plantilla.ordenado().select("-productos -_id -orden")
  res.render('verplantillas', { plantillas, esAdmin: esAdmin(req) })
}).patch(tcaccion(async (req, res) => {
  let { nombreDefault, nombrePlantillas } = req.body
  let plantillas = await Plantilla.ordenado().select("orden nombre esdefault")
  if (nombrePlantillas.length !== plantillas.length) throw new errorDB("La cantidad de plantillas que enviaste no coincide con la cantidad actual, por favor recarga la página e inténtalo de nuevo")
  if (!nombrePlantillas.every(x => plantillas.map(x => x.nombre).includes(x))) throw new errorDB("Hay nombres de plantilla que no coinciden, por favor recarga la página e inténtalo de nuevo")

  let plantillasAActualizar = []
  let plantillaDefault = plantillas.find(x => x.esdefault)
  if (plantillaDefault.nombre !== nombreDefault) plantillasAActualizar.push(objUpdate(plantillaDefault.nombre, { $unset: { esdefault: true } }), objUpdate(nombreDefault, { esdefault: true }))

  nombrePlantillas.forEach((x, i) => x !== plantillas[i].nombre && plantillasAActualizar.push(objUpdate(x, { orden: i })))
  await Plantilla.bulkWrite(plantillasAActualizar)
  res.send()
}, "No se pudieron guardar los cambios"))

router.route('/crear').get(async (req, res) => {
  let plantillas = await Plantilla.nombres()
  res.render('crearplantillas', { plantillas, esAdmin: esAdmin(req) })
}).post(tcaccion(async (req, res) => {
  if (await Plantilla.exists({ nombre: req.body.nombre })) throw new errorDB('Ya existe una plantilla con ese nombre')
  await Plantilla.create({ ...req.body, orden: await Plantilla.countDocuments({}), ultimaedicion: devuelveUsuario(req) })
  res.send()
}, "Ocurrió un error al guardar la plantilla"))

router.route('/editar/:nombre').get(tcaccion(async (req, res) => {
  let datosplantilla = await Plantilla.encontrar({ nombre: req.params.nombre })
  datosplantilla ? res.render('editarplantillas', { datosplantilla, esAdmin: esAdmin(req) }) : res.send("Error, la plantilla que deseas acceder no existe")
}, "La plantilla que deseas editar ya no existe")).patch(tcaccion(async (req, res) => {
  req.body.ultimaedicion = devuelveUsuario(req)
  req.body.fechaultimaedicion = Date.now()
  await Plantilla.editarCustom({ nombre: req.params.nombre }, req.body)
  res.send()
}, "Ocurrió un error al actualizar la plantilla"))

router.get('/devuelveplantilla/:nombre', tcaccion(async (req, res) => {
  let plantilla = await Plantilla.encontrar({ nombre: req.params.nombre }).select("productos -_id")
  if (!plantilla) throw new errorDB('Plantilla no existe')
  res.send(plantilla.productos)
}, "Hubo un error al recuperar la plantilla"))

router.get('/devuelvenombres', tcaccion(async (req, res) => {
  let plantillas = await Plantilla.find().select("nombre -_id")
  res.send(plantillas?.map(x => x.nombre) || [])
}, "Hubo un error al recuperar la plantilla"))


router.route('/:nombre').delete(tcaccion(async (req, res) => {
  let plantilla = await Plantilla.encontrar({ nombre: req.params.nombre }).select("orden esdefault")
  if (!plantilla) throw new errorDB("La plantilla que deseas borrar ya no existe")
  let { esdefault, orden, _id } = plantilla
  if (esdefault) throw new errorDB("No puedes borrar la plantilla de default")

  await Plantilla.borrar(_id)
  await Plantilla.updateMany({ orden: { $gte: orden } }, { $inc: { orden: -1 } })
  res.send()
}, "Ocurrió un error al tratar de borrar la plantilla"))

module.exports = router