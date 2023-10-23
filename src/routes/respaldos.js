const router = require("express").Router()
router.use('/registroseliminados', require('./respaldos/registroseliminados'))
router.use('/googledrive', require('./respaldos/googledrive'))

module.exports = router