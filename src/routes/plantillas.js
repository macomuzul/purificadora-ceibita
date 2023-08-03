const router = require('express').Router();
const Plantilla = require('../models/plantillas');

router.route('/').get(async (req, res) => {
  const plantillas = await Plantilla.find().sort("orden")
  res.render('verplantillas', { plantillas })
}).patch(async (req, res) => {
  try {
    let { plantilladefault, plantillasorden } = req.body;
    await Plantilla.updateOne({ esdefault: true }, { $unset: { esdefault: true } })
    await Plantilla.updateOne({ nombre: plantilladefault }, { esdefault: true })
    plantillasorden.forEach(async (el, i) => await Plantilla.updateOne(el, { orden: i }))
    res.send("Se ha actualizado con exito")
  }
  catch (error) {
    res.status(400).send("No se pudieron guardar los cambios");
  }
});

router.route('/crear').get(async (req, res) => {
  const plantillas = await Plantilla.find({}, { nombre: 1, _id: 0 }).sort("orden");
  res.render('crearplantillas', { plantillas });
}).post(async (req, res) => {
  try {
    if (await Plantilla.findOne({ nombre: req.body.nombre }))
      return res.status(400).send('La plantilla ya existe');
    await Plantilla.create({ ...req.body, orden: await Plantilla.count(), ultimaedicion: req.user?.usuario ?? "usuariodesconocido" })
    res.send("plantilla guardada")
  } catch {
    res.status(400).send('Error al guardar la plantilla');
  }
});

router.get('/editar/:id', async (req, res) => {
  try {
    let datosplantilla = await Plantilla.findOne({ nombre: req.params.id });
    if (datosplantilla)
      res.render('editarplantillas', { datosplantilla });
    else
      res.status(400).send("Error, la plantilla que deseas acceder no existe");
  } catch (error) {
    res.status(400).send("Error, la plantilla que deseas acceder no existe");
  }
});

router.post('/devuelveplantilla', async (req, res) => {
  try {
    const datosplantilla = await Plantilla.findOne(req.body, { productos: 1, _id: 0 });
    if (datosplantilla)
      res.send(datosplantilla);
    else
      res.status(400).send('Plantilla no existe');
  } catch (error) {
    res.status(400).send('Error al procesar la petición');
  }
});


router.route('/:id').patch(async (req, res) => {
  try {
    req.body.usuario = req.user?.usuario ?? "usuariodesconocido";
    await Plantilla.updateOne({ nombre: req.params.id }, req.body);
    res.send("Se ha actualizado con exito");
  } catch (error) {
    res.status(400).send("Error al actualizar la plantilla");
  }
}).delete(async (req, res) => {
  try {
    var plantilla = await Plantilla.findOne({ nombre: req.params.id });
    if (!plantilla)
      return res.status(400).send("La plantilla no existe")
    if (plantilla.esdefault)
      return res.status(400).send("No puedes borrar la plantilla de default")
    await plantilla.deleteOne()
    const plantillas = await Plantilla.find().sort("orden");
    plantillas.forEach(async (el, i) => await el.updateOne({ orden: i }))

    res.send("Se ha borrado con exito");
  } catch (error) {
    res.status(400).send("No existe la plantilla que deseas borrar");
  }
});

module.exports = router;