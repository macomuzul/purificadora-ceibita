const router = require("express").Router();
router.use('/registroseliminados', require('./respaldos/registroseliminados'));
router.use('/respaldogoogledrive', require('./respaldos/respaldogoogledrive'));

module.exports = router;
