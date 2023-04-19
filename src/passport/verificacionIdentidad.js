function verificacionIdentidad(req, res, next) {
  let contraseñaVerificacion = req.body.contraseñaVerificacion;
  if (req.user?.contraseña !== contraseñaVerificacion) {
    res.status(400).send("Contraseña de verificación del usuario incorrecta")
    return;
  }
  return next();
}

module.exports = verificacionIdentidad;