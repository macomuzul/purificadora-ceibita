function estaAutenticado(req, res, next) {
  console.log("buenas noches")
  //TODO este hay que ponerlo
  // req.isAuthenticated() ? next() : res.redirect('/')
  next()
}
module.exports = estaAutenticado;
