const router = require('express').Router();
const mPlantilla = require('../models/plantillas');

router.get('/', async (req, res) => {
  const plantillas = await mPlantilla.find().sort("orden");
  res.render('verplantillas', { plantillas });
});

router.get('/crear', async (req, res) => {
  const plantillas = await mPlantilla.find().sort("orden");
  res.render('crearplantillas', { plantillas });
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


router.patch('/actualizarverplantillas', async (req, res) => {
  try {
    var { plantilladefault, plantillasorden } = req.body;
    await mPlantilla.updateOne({ esdefault: true }, { esdefault: false });
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

router.post('/guardar', async (req, res) => {
  try {
    var plantillanueva = new mPlantilla(req.body);
    const existe = await mPlantilla.findOne({ nombreplantilla: plantillanueva.nombreplantilla });
    if (existe) {
      res.status(400).send('La plantilla ya existe');
      return;
    }
    const count = await mPlantilla.count();
    plantillanueva.orden = count;
    plantillanueva.ultimaedicion = req.user?.usuario ?? "";
    await plantillanueva.save();
    res.send("plantilla guardada")
  } catch {
    res.status(400).send('Error al guardar la plantilla');
  }
});


router.patch('/:id', async (req, res) => {
  try {
    req.body.usuario = req.user?.usuario ?? "";
    await mPlantilla.updateOne({ nombreplantilla: req.params.id }, req.body);
    res.send("Se ha actualizado con exito");
  } catch (error) {
    res.status(400).send("Error al actualizar la plantilla");
  }
});


router.delete('/:id', async (req, res) => {
  try {
    var plantilla = await mPlantilla.findOne({ nombreplantilla: req.params.id });
    if (!plantilla) {
      res.status(400).send("La plantilla no existe");
      return;
    }
    if (plantilla.esdefault) {
      res.status(400).send("No puedes borrar la plantilla de default");
      return;
    }
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