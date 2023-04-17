const router = require('express').Router();
const mPlantilla = require('../models/usuario');

router.get('/', async (req, res) => {
    const usuarios = await mPlantilla.find();
    res.render('empleados', {usuarios});
});


module.exports = router;