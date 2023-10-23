const router = require("express").Router()
router.use('/camioneros', require('./empleados/camioneros'))
router.use('/usuarios', require('./empleados/usuarios'))
module.exports = router