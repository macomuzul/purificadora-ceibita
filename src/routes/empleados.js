const router = require('express').Router();
const mUsuario = require('../models/usuario');
const verificacionIdentidad = require("../security/verificacionIdentidad");

router.get('/', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('empleados', { usuarios });
});

router.get('/usuarios', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('usuarios', { usuarios });
});

router.post('/usuarios/pedirContrase%C3%B1a', verificacionIdentidad, async (req, res) => {
  try {
    let  { usuario } = req.body;
    let encontrado = await mUsuario.findOne({ usuario });
    res.send(encontrado.contraseña);
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
      let existeUsuario = await mUsuario.findOne({ usuario });
      if (existeUsuario) {
        res.status(400).send("Error, usuario ya existe")
        return;
      }
      let { usuario, contraseña, rol } = req.body;
      let nuevoUsuario = new mUsuario({ usuario, contraseña, rol });
      await nuevoUsuario.save();
      res.send("Se guardo el usuario exitosamente");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  });

router.route('/usuarios/editar/:id')
  .get(async (req, res) => {
    res.render('editarusuarios', {nombreUsuario: req.params.id});
  })
  .post(verificacionIdentidad, async (req, res) => {
    try {
      let { usuario } = req.body;
      if(usuario){
        let existeUsuario = await mUsuario.findOne({ usuario });
        if (existeUsuario) {
          res.status(400).send("Error, usuario ya existe")
          return;
        }
      }
      
      await mUsuario.updateOne({ usuario: req.params.id }, req.body);
      res.send("Se guardo exitosamente");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  });

router.get('/camioneros', async (req, res) => {
  const usuarios = await mUsuario.find();
  res.render('camioneros', { usuarios });
});

module.exports = router;