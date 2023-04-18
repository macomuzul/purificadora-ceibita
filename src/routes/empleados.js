const router = require('express').Router();
const mUsuario = require('../models/usuario');

router.get('/', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('empleados', { usuarios });
});

router.get('/usuarios', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('usuarios', { usuarios });
});

router.route('/usuarios/crear')
  .get(async (req, res) => {
    res.render('crearusuarios');
  })
  .post(async (req, res) => {
    try {
      let { usuario, contraseña, rol } = req.body;
      let existeUsuario = await mUsuario.findOne({ usuario });
      if (existeUsuario) {
        res.status(400).send("Error, usuario ya existe")
        return;
      }
      let nuevoUsuario = new mUsuario({ usuario, contraseña, rol });
      await nuevoUsuario.save();
      res.send("Se guardo el usuario exitosamente");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  })

router.get('/camioneros', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('camioneros', { usuarios });
});


module.exports = router;