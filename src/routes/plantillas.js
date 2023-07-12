const router = require('express').Router();
const mPlantilla = require('../models/plantillas');

router.route('/').get(async (req, res) => {
  const plantillas = await mPlantilla.find().sort("orden");
  res.render('verplantillas', { plantillas });
}).patch(async (req, res) => {
  try {
    let { plantilladefault, plantillasorden } = req.body;
    await mPlantilla.updateOne({ esdefault: true }, { $unset: { esdefault: true } });
    await mPlantilla.updateOne({ nombre: plantilladefault }, { esdefault: true });
    plantillasorden.forEach(async (el, i) => await mPlantilla.updateOne(el, { orden: i }));
    res.send("Se ha actualizado con exito");
  }
  catch (error) {
    res.status(400).send("No se pudieron guardar los cambios");
  }
});

router.route('/crear').get(async (req, res) => {
  const plantillas = await mPlantilla.find({}, {nombre: 1, _id: 0}).sort("orden");
  console.log(plantillas)
  res.render('crearplantillas', { plantillas });
}).post(async (req, res) => {
  try {
    var plantillanueva = new mPlantilla(req.body);
    if (await mPlantilla.findOne({ nombre: plantillanueva.nombre }))
      return res.status(400).send('La plantilla ya existe');
    plantillanueva.orden = await mPlantilla.count()
    plantillanueva.ultimaedicion = req.user?.usuario ?? "usuariodesconocido";
    await plantillanueva.save();
    res.send("plantilla guardada")
  } catch {
    res.status(400).send('Error al guardar la plantilla');
  }
});

router.get('/editar/:id', async (req, res) => {
  try {
    let datosplantilla = await mPlantilla.findOne({ nombre: req.params.id });
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
    const datosplantilla = await mPlantilla.findOne(req.body, {productos: 1, _id: 0});
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
    await mPlantilla.updateOne({ nombre: req.params.id }, req.body);
    res.send("Se ha actualizado con exito");
  } catch (error) {
    res.status(400).send("Error al actualizar la plantilla");
  }
}).delete(async (req, res) => {
  try {
    var plantilla = await mPlantilla.findOne({ nombre: req.params.id });
    if (!plantilla)
      return res.status(400).send("La plantilla no existe");
    if (plantilla.esdefault)
      return res.status(400).send("No puedes borrar la plantilla de default");
    await plantilla.deleteOne();
    const plantillas = await mPlantilla.find().sort("orden");
    plantillas.forEach(async (el, i) => el.updateOne({orden: i}))

    res.send("Se ha borrado con exito");
  } catch (error) {
    res.status(400).send("No existe la plantilla que deseas borrar");
  }
});

module.exports = router;