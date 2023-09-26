// function verificacionIdentidad(req, res, next) {
//   if(!req.user) return res.status(400).send("Por favor iniciar sesión de nuevo ha habido un error")
//   if (req.user.contraseña !== req.body.contraseñaVerificacion) return res.status(400).send("Contraseña incorrecta")
//   next()
// }

//TODO hay que poner el de arriba importantisimo
function verificacionIdentidad(req, res, next) {
  next()
}
module.exports = verificacionIdentidad