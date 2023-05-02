const router = require('express').Router();
const mUsuario = require('../models/usuario');
const verificacionIdentidad = require("../security/verificacionIdentidad");

router.get('/', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('empleados', { usuarios });
});

router.route('/usuarios').get(async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('usuarios', { usuarios });
}).post(verificacionIdentidad, async (req, res) => {
  try {
    let { usuario } = req.body;
    let encontrado = await mUsuario.findOne({ usuario });
    res.send(encontrado.contraseña);
  } catch {
    res.status(400).send("Error al realizar la petición")
  }
}).delete(async (req, res) => {
  try {
    let { usuario } = req.body;
    if (!mUsuario.exists({ usuario }))
      return res.send("Error, usuario no existe");
    await mUsuario.deleteOne({ usuario });
    res.send("Borrado con éxito");
  } catch {
    res.status(400).send("Error al realizar la petición")
  }
});

router.route('/usuarios/crear')
  .get(async (req, res) => {
    res.render('crearusuarios');
  })
  .post(verificacionIdentidad, async (req, res) => {
    try {
      let { usuario, contraseña, rol, correo } = req.body;
      let existeUsuario = await mUsuario.findOne({ usuario });
      if (existeUsuario)
        return res.status(400).send("Error, usuario ya existe");
      let nuevoUsuario = new mUsuario({ usuario, contraseña, rol, correo });
      await nuevoUsuario.save();
      res.send("Se guardo el usuario exitosamente");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  });

router.route('/usuarios/editar/:id')
  .get(async (req, res) => {
    res.render('editarusuarios', { nombreUsuario: req.params.id });
  })
  .post(verificacionIdentidad, async (req, res) => {
    try {
      let { usuario } = req.body;
      if (usuario) {
        let existeUsuario = await mUsuario.findOne({ usuario });
        if (existeUsuario)
          return res.status(400).send("Error, usuario ya existe");
      }

      const camposPermitidos = ["usuario", "contraseña", "rol", "correo"];
      const camposQuery = Object.keys(req.body);
      if(camposQuery.length > 1)
        return res.status(400).send("Error al realizar la petición");
      const peticionValida = camposPermitidos.includes(camposQuery[0]);
      if (!peticionValida)
        return res.status(400).send("Error al realizar la petición");

      let guardado = await mUsuario.updateOne({ usuario: req.params.id }, req.body);
      if(guardado.modifiedCount === 1)
        res.send("Se guardo exitosamente");
      else
        res.send("No se pudo guardar");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  });

router.get('/camioneros', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('camioneros', { usuarios });
});

module.exports = router;