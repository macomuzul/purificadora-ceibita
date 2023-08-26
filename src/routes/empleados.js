const router = require('express').Router();
const Usuario = require('../models/usuario');
const Camioneros = require('../models/camioneros');
let mandarError = (res, mensaje) => mandarError(res, mensaje)

// const verificacionIdentidad = require("../security/verificacionIdentidad");
//TODO hay que poner el de arriba importantisimo
let verificacionIdentidad = function verificacionIdentidad(req, res, next) {
  next()
}

router.route('/usuarios').get(async (req, res) => {
  const usuarios = await Usuario.find({}, { _id: 0, contraseña: 0 });
  res.render('verusuarios', { usuarios });
}).post(verificacionIdentidad, async (req, res) => {
  try {
    let { usuario } = req.body
    let u = await Usuario.findOne({ usuario })
    res.send(u.contraseña)
  } catch {
    mandarError(res, "Error al realizar la petición")
  }
}).delete(async (req, res) => {
  try {
    let { usuario } = req.body
    let res = await Usuario.deleteOne({ usuario })
    res.deletedCount ? res.send("Borrado con éxito") : res.send("Error, usuario no existe")
  } catch {
    mandarError(res, "Error al realizar la petición")
  }
})

router.route('/usuarios/crear').get(async (req, res) => res.render('crearusuarios'))
.post(verificacionIdentidad, async (req, res) => {
  try {
    let { usuario, contraseña, rol, correo } = req.body;
    if (await Usuario.findOne({ usuario }))
      return mandarError(res, "Error, usuario ya existe");
    await Usuario.create({ usuario, contraseña, rol, correo })
    res.send("Se guardo el usuario exitosamente");
  } catch(err) {
    // mandarError(res, "Error al guardar el usuario")
    mandarError(res, err.message)
  }
})

router.route('/usuarios/editar/:id').get(async (req, res) => res.render('editarusuarios', { nombreUsuario: req.params.id }))
.post(verificacionIdentidad, async (req, res) => {
  try {
    let { usuario } = req.body;
    if (usuario && await Usuario.exists({ usuario })) return mandarError(res, "Error, usuario ya existe")
    const camposQuery = Object.keys(req.body)
    if (camposQuery.length > 1) return mandarError(res, "Error al realizar la petición")
    if (!["usuario", "contraseña", "rol", "correo"].includes(camposQuery[0])) return mandarError(res, "Error al realizar la petición")
    let {modifiedCount} = await Usuario.updateOne({ usuario: req.params.id }, req.body)
    res.send(modifiedCount ? "Se guardo exitosamente" : "No se pudo guardar")
  } catch {
    mandarError(res, "Error al guardar el usuario")
  }
})

router.route('/camioneros').get(async (req, res) => {
  let camioneros = await Camioneros.encontrar()
  console.log(camioneros)
  res.render('camioneros', { camioneros })
}).post(async (req, res) => {
  try {
    await Camioneros.findOneAndUpdate({}, req.body, {runValidators: true, upsert: true})
    res.send("Se ha guardado correctamente")
  } catch (err) {
    console.log(err)
    mandarError(res, "Ha habido un error al momento de guardar")
  }
})

module.exports = router