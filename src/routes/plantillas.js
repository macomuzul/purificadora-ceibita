const router = require('express').Router()
const Plantilla = require('../models/plantillas')

let mandarError = (res, mensaje) => res.status(400).send(mensaje)
let objUpdate = (_id, update) => ({ updateOne: { filter: { _id }, update } })

router.route('/').get(async (req, res) => {
  let plantillas = await Plantilla.ordenado().select("-productos -_id -orden")
  res.render('verplantillas', { plantillas })
}).patch(async (req, res) => {
  try {
    let { nombreDefault, nombrePlantillas } = req.body
    let plantillas = await Plantilla.ordenado().select("orden nombre esdefault")
    if (nombrePlantillas.length !== plantillas.length) mandarError(res, "La cantidad de plantillas que enviaste no coincide con la cantidad actual, por favor recarga la página e inténtalo de nuevo")
    //verifica si tienen los mismos nombres las plantilla en la base de datos y las enviadas
    if (!nombrePlantillas.every(x => plantillas.map(x => x.nombre).includes(x))) mandarError(res, "Hay nombres de plantilla que no coinciden, por favor recarga la página e inténtalo de nuevo")

    let plantillasAActualizar = []
    let plantillaDefault = plantillas.find(x => x.esdefault)
    if (plantillaDefault.nombre !== nombreDefault) plantillasAActualizar.push(objUpdate(plantillaDefault._id, { $unset: { esdefault: true } }), objUpdate(plantillas.find(x => x.nombre === nombreDefault)._id, { esdefault: true }))

    nombrePlantillas.forEach((x, i) => x !== plantillas[i].nombre && plantillasAActualizar.push(objUpdate(plantillas[i]._id, { orden: i })))
    await Plantilla.bulkWrite(plantillasAActualizar)
    res.send("Se ha actualizado con exito")
  }
  catch (error) {
    mandarError(res, "No se pudieron guardar los cambios")
  }
})

router.route('/crear').get(async (req, res) => {
  let plantillas = await Plantilla.nombres()
  res.render('crearplantillas', { plantillas })
}).post(async (req, res) => {
  try {
    if (await Plantilla.exists({ nombre: req.body.nombre })) return mandarError(res, 'La plantilla ya existe');
    await Plantilla.create({ ...req.body, orden: await Plantilla.countDocuments({}), ultimaedicion: req.user?.usuario ?? "usuariodesconocido" })
    res.send("plantilla guardada")
  } catch {
    mandarError(res, 'Error al guardar la plantilla')
  }
})

router.get('/editar/:nombre', async (req, res) => {
  try {
    let datosplantilla = await Plantilla.encontrar({ nombre: req.params.nombre })
    datosplantilla ? res.render('editarplantillas', { datosplantilla }) : mandarError(res, "Error, la plantilla que deseas acceder no existe")
  } catch (error) {
    mandarError(res, "Error, la plantilla que deseas acceder no existe")
  }
})

router.post('/devuelveplantilla/:nombre', async (req, res) => {
  try {
    const plantilla = await Plantilla.encontrar({ nombre: req.params.nombre }).select("productos -_id")
    plantilla ? res.send(plantilla.productos) : mandarError(res, 'Plantilla no existe')
  } catch (error) {
    mandarError(res, 'Error al procesar la petición');
  }
})


router.route('/:id').patch(async (req, res) => {
  try {
    req.body.usuario = req.user?.usuario ?? "usuariodesconocido";
    await Plantilla.findOneAndUpdate({ nombre: req.params.id }, req.body, { runValidators: true })
    res.send("Se ha actualizado con exito")
  } catch (error) {
    mandarError(res, "Error al actualizar la plantilla")
  }
}).delete(async (req, res) => {
  try {
    let plantilla = await Plantilla.encontrar({ nombre: req.params.id }).select("orden esdefault")
    if (!plantilla) return mandarError(res, "La plantilla no existe")
    let { esdefault, orden, _id } = plantilla
    if (esdefault) return mandarError(res, "No puedes borrar la plantilla de default")

    await Plantilla.findByIdAndDelete(_id)
    await Plantilla.updateMany({ orden: { $gte: orden } }, { $inc: { orden: -1 } })
    res.send("Se ha borrado con exito")
  } catch (error) {
    mandarError(res, "No existe la plantilla que deseas borrar")
  }
})

module.exports = router