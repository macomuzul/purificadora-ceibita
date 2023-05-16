const router = require('express').Router();
const Usuario = require('../models/usuario');
const Camioneros = require('../models/camioneros');
const verificacionIdentidad = require("../security/verificacionIdentidad");

router.get('/', async (req, res) => {
  const usuarios = await Usuario.find();
  res.render('empleados', { usuarios });
});

router.route('/usuarios').get(async (req, res) => {
  const usuarios = await Usuario.find();
  res.render('verusuarios', { usuarios });
}).post(verificacionIdentidad, async (req, res) => {
  try {
    let { usuario } = req.body;
    let encontrado = await Usuario.findOne({ usuario });
    res.send(encontrado.contraseña);
  } catch {
    res.status(400).send("Error al realizar la petición")
  }
}).delete(async (req, res) => {
  try {
    let { usuario } = req.body;
    if (!Usuario.exists({ usuario }))
      return res.send("Error, usuario no existe");
    await Usuario.deleteOne({ usuario });
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
      let existeUsuario = await Usuario.findOne({ usuario });
      if (existeUsuario)
        return res.status(400).send("Error, usuario ya existe");
      let nuevoUsuario = new Usuario({ usuario, contraseña, rol, correo });
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
        let existeUsuario = await Usuario.findOne({ usuario });
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

      let guardado = await Usuario.updateOne({ usuario: req.params.id }, req.body);
      if(guardado.modifiedCount === 1)
        res.send("Se guardo exitosamente");
      else
        res.send("No se pudo guardar");
    } catch {
      res.status(400).send("Error al guardar el usuario")
    }
  });

router.route('/camioneros').get(async (req, res) => {
  const camioneros = await Camioneros.findOne();
  res.render('camioneros', { camioneros });
}).post(async (req, res) => {
  try {
    let peticion = req.body;
    if(!Object.keys(peticion).includes("camioneros"))
      return res.send("Petición inválida")
    
    let camioneros = new Camioneros(peticion);
    let camionerosAnterior = await Camioneros.find();
    console.log(camionerosAnterior.length)
    if(camionerosAnterior.length === 1)
      await Camioneros.updateOne({}, peticion);
    else
      await camioneros.save();
    res.send("Se ha guardado correctamente")
  } catch (error) {
    console.log(error)
    res.status(400).send("Ha habido un error al momento de guardar")
  }
});

module.exports = router;