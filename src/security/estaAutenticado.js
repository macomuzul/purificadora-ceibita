function estaAutenticado(req, res, next) {
  console.log("buenas noches")
  req.isAuthenticated() ? next() : res.redirect('/')
  // return next();
}
module.exports = estaAutenticado;
