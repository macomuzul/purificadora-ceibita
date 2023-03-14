const express = require('express')
const router = express.Router();
const path = require('path')
const plantilla = require('../models/plantillas');
const estaAutenticado = require("../passport/autenticado");

router.use(express.static(path.join(__dirname, "../public")));
router.use(estaAutenticado);

router.get('/', async (req, res) => {
  const plantillas = await plantilla.find().sort("orden");
  res.render('verplantillas', { plantillas });
});

router.get('/crear', async (req, res) => {
  const plantillas = await plantilla.find().sort("orden");
  res.render('crearplantillas', { plantillas });
});

router.delete('/borrar', async (req, res) => {
  var peticion = JSON.stringify(req.body).replace(/\s/g, '');
  if (peticion === "{}") {
    res.status(400).send("Denegado");
    return;
  }
  else {
    try {
      var existe = await plantilla.findOne(req.body);
      if (existe) {
        if (existe.esdefault) {
          res.status(400).send("Es Default");
          return;
        }
      }

      await plantilla.deleteOne(req.body);
      const plantillas = await plantilla.find().sort("orden");
      for (let i = 0; i < plantillas.length; i++) {
        var nombreobj = { nombreplantilla: plantillas[i].nombreplantilla }
        var idobj = { orden: `${i}` }
        await plantilla.updateOne(nombreobj, { $set: idobj });
      }
      res.status(200).send("Se ha borrado con exito");
    } catch (error) {
      res.status(400).send("No existe la plantilla que desea borrar");
    }
  }
});


router.delete('/borrar/:id', async (req, res) => {
  var peticion = JSON.stringify(req.body).replace(/\s/g, '');
  if (peticion === "{}") {
    res.status(400).send("Denegado");
    return;
  }
  else {
    try {
      var query = { nombreplantilla: req.params.id }
      await plantilla.updateOne(query, { $set: { esdefault: true } });

      await plantilla.deleteOne(req.body);
      const plantillas = await plantilla.find().sort("orden");
      for (let i = 0; i < plantillas.length; i++) {
        var nombreobj = { nombreplantilla: plantillas[i].nombreplantilla }
        var idobj = { orden: `${i}` }
        await plantilla.updateOne(nombreobj, { $set: idobj });
      }
      res.status(200).send("Se ha borrado con exito");
    } catch (error) {
      res.status(400).send("No existe la plantilla que desea borrar");
    }
  }
});



router.patch('/actualizarorden', async (req, res) => {
  try {
    console.log(req.body);
    var cuerpo = req.body;

    await plantilla.updateOne({ esdefault: true }, { $set: { esdefault: false } });
    const plantilladefault = {
      nombreplantilla: cuerpo.plantilladefault
    }
    await plantilla.updateOne(plantilladefault, { $set: { esdefault: true } });

    for (let i = 0; i < cuerpo.plantillasorden.length; i++) {
      var idobj = { orden: `${i}` }
      await plantilla.updateOne(cuerpo.plantillasorden[i], { $set: idobj });
    }
    res.status(200).send("Se ha actualizado con exito");
  }
  catch (error) {
    console.log(error);
    res.status(400).send("No se pudo guardarlos los cambios");
  }

});



router.post('/datostabla', async (req, res) => {
  try {
    console.log(req.body)
    const datosplantilla = await plantilla.findOne(req.body);
    if (datosplantilla) {
      console.log(datosplantilla)
      res.send(datosplantilla);
    }
    else
      res.status(400).send('Plantilla no existe');
  } catch (error) {
    res.status(400).send('Bad request');
  }
});

router.post('/previsualizacion', async (req, res) => {
  try {
    const datosplantilla = await plantilla.findOne(req.body);
    if (datosplantilla) {
      res.send(presvisualizarplantillas);
    }
    else {
      res.status(400).send('Plantilla no existe');
    }
  } catch (error) {
    res.status(400).send('Bad request');
  }
});

router.post('/guardarnuevo', async (req, res) => {
  var plantillanueva = new plantilla(req.body);
  const existe = await plantilla.findOne({ nombreplantilla: plantillanueva.nombreplantilla });
  if (!existe) {
    const count = await plantilla.count();
    plantillanueva.orden = count;
    if (req.user) {
      plantillanueva.ultimaedicion = req.user.usuario;
    }

    await plantillanueva.save(function (err) {
      if (err) return handleError(err);
      res.send('Se ha guardado con exito');
    });
  }
  else
    res.status(400).send('La plantilla ya existe');
});


router.patch('/:id', async (req, res) => {
  try {
    var query = { nombreplantilla: req.params.id };
    await plantilla.updateOne(query, { $set: req.body });
    if (req.user) {
      var usuario = {
        ultimaedicion: req.user.usuario
      }
      await plantilla.updateOne(query, { $set: usuario });
    }

    res.status(200).send("Se ha actualizado con exito");
  } catch (error) {
    res.status(400).send("No se pudo guardarlos los cambios");
  }

});



router.get('/:id', async (req, res) => {
  try {
    var query = { nombreplantilla: req.params.id }
    const datosplantilla = await plantilla.findOne(query);
    if (datosplantilla)
      res.render('editarplantillas', { datosplantilla });
    else
      res.status(400).send("Id invalido");
  } catch (error) {
    res.status(400).send("Id invalido");
  }
});

module.exports = router;