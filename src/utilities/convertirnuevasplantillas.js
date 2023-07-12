const ViejasPlantillas = require("../models/viejasplantillas");
const Plantillas = require("../models/plantillas");

async function convertirPlantillas() {
  let viejasPlantillas = await ViejasPlantillas.find()
  viejasPlantillas.forEach(async viejaplantilla => {
    let { nombreplantilla: nombre, ultimaedicion, orden, esdefault, productos } = viejaplantilla
    let datos = { nombre, ultimaedicion, fechaultimaedicion: Date.now(), orden, productos }
    if(esdefault)
      datos.esdefault = esdefault
    let plantilla = new Plantillas(datos)
    await plantilla.save()
  });
}

module.exports = convertirPlantillas