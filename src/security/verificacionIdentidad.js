function verificacionIdentidad(req, res, next) {
  if(!req.user){
    res.status(400).send("Por favor iniciar sesión de nuevo ha habido un error")
    return;
  }

  if (req.user.contraseña !== req.body.contraseñaVerificacion) {
    res.status(400).send("Contraseña de verificación del usuario incorrecta")
    return;
  }
  return next();
}

module.exports = verificacionIdentidad;