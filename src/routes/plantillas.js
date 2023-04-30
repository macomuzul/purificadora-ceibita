const router = require('express').Router();
const mPlantilla = require('../models/plantillas');

router.route('/').get(async (req, res) => {
  const plantillas = await mPlantilla.find().sort("orden");
  res.render('verplantillas', { plantillas });
}).patch(async (req, res) => {
  try {
    let { plantilladefault, plantillasorden } = req.body;
    await mPlantilla.updateOne({ esdefault: true }, { $unset: { esdefault: true }});
    await mPlantilla.updateOne({ nombreplantilla: plantilladefault }, { esdefault: true });

    for (let i = 0; i < plantillasorden.length; i++) {
      await mPlantilla.updateOne(plantillasorden[i], { orden: i });
    }
    res.send("Se ha actualizado con exito");
  }
  catch (error) {
    res.status(400).send("No se pudieron guardar los cambios");
  }
});

router.route('/crear').get(async (req, res) => {
  const plantillas = await mPlantilla.find().sort("orden");
  res.render('crearplantillas', { plantillas });
}).post(async (req, res) => {
  try {
    var plantillanueva = new mPlantilla(req.body);
    const existe = await mPlantilla.findOne({ nombreplantilla: plantillanueva.nombreplantilla });
    if (existe)
      return res.status(400).send('La plantilla ya existe');
    const count = await mPlantilla.count();
    plantillanueva.orden = count;
    plantillanueva.ultimaedicion = req.user?.usuario ?? "";
    await plantillanueva.save();
    res.send("plantilla guardada")
  } catch {
    res.status(400).send('Error al guardar la plantilla');
  }
});

router.get('/editar/:id', async (req, res) => {
  try {
    var query = { nombreplantilla: req.params.id }
    const datosplantilla = await mPlantilla.findOne(query);
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
    const datosplantilla = await mPlantilla.findOne(req.body);
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
    req.body.usuario = req.user?.usuario ?? "";
    await mPlantilla.updateOne({ nombreplantilla: req.params.id }, req.body);
    res.send("Se ha actualizado con exito");
  } catch (error) {
    res.status(400).send("Error al actualizar la plantilla");
  }
}).delete(async (req, res) => {
  try {
    var plantilla = await mPlantilla.findOne({ nombreplantilla: req.params.id });
    if (!plantilla)
      return res.status(400).send("La plantilla no existe");
    if (plantilla.esdefault)
      return res.status(400).send("No puedes borrar la plantilla de default");
    await plantilla.deleteOne();
    const plantillas = await mPlantilla.find().sort("orden");
    plantillas.forEach(async (el, i) => {
      el.orden = i;
      await el.save();
    });

    res.send("Se ha borrado con exito");
  } catch (error) {
    res.status(400).send("No existe la plantilla que deseas borrar");
  }
});

module.exports = router;