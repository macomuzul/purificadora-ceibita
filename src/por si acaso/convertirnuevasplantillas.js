const ViejasPlantillas = require("../models/viejasplantillas");
const Plantillas = require("../models/plantillas");

async function convertirPlantillas() {
  let plantillas = await Plantillas.find().lean()
  await ViejasPlantillas.insertMany(plantillas)
  await Plantillas.deleteMany()

  await Plantillas.insertMany(plantillas.map(p => {
    let { nombreplantilla: nombre, ultimaedicion, orden, esdefault, productos } = p
    productos.forEach(p => p.producto = primeraLetraMayuscula(p.producto))
    let datos = { nombre, ultimaedicion, orden, productos }
    if (esdefault) datos.esdefault = esdefault
    return datos
  }))
}

module.exports = convertirPlantillas