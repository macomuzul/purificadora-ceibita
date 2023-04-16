function estaAutenticado(req, res, next) {
  // console.log("jfjfj")
  //   if(req.isAuthenticated()) {
  //     return next();
  //   }
  
  //   res.redirect('/')
    console.log("buenas noches")
    return next();
  }
  module.exports = estaAutenticado;
  