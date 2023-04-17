const router = require('express').Router();
const mPlantilla = require('../models/plantillas');

router.get('/', async (req, res) => {
    // const plantillas = await mPlantilla.find().sort("orden");
    res.render('configuraciones');
});


module.exports = router;