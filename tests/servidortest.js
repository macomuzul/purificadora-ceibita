const express = require('express')
const app = express()
const engine = require('ejs-mate')
const path = require('path')
app.engine('ejs', engine)
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('views', path.join(__dirname, "../src/views"))
app.use(express.static(path.join(__dirname, "../src/public/css")))
app.use(express.static(path.join(__dirname, "../src/public/images")))
app.use(express.static(path.join(__dirname, "../src/public/js")))
app.use(express.static(path.join(__dirname, "../src/public/html")))
app.use(express.static(path.join(__dirname, "../src/public/js/partials")))
app.use(express.static(path.join(__dirname, "../src/public/js/utilities")))
app.use(express.static(path.join(__dirname, "../src/public/components")))
app.use(express.static(path.join(__dirname, "../src/../plugins")))

app.get('/registrarventas/:id', (req, res) => {
  let registro = {
    "_id": {
      "$date": "2023-12-06T00:00:00.000Z"
    },
    "__v": 0,
    "tablas": [
      {
        "trabajador": "",
        "productos": [
          {
            "nombre": "garrafón2",
            "precio": 10,
            "viajes": [
              99,
              3
            ],
            "vendidos": 96,
            "ingresos": 960
          },
          {
            "nombre": "bolsa2",
            "precio": 5.6,
            "viajes": [
              14,
              1
            ],
            "vendidos": 13,
            "ingresos": 72.8
          },
          {
            "nombre": "boopi",
            "precio": 25,
            "viajes": [
              3,
              2
            ],
            "vendidos": 1,
            "ingresos": 25
          },
          {
            "nombre": "dispensador",
            "precio": 50,
            "viajes": [
              4134,
              2
            ],
            "vendidos": 4132,
            "ingresos": 206600
          },
          {
            "nombre": "prueba",
            "precio": 13.43,
            "viajes": [
              134,
              1
            ],
            "vendidos": 133,
            "ingresos": 1786.19
          }
        ],
        "totalvendidos": 4375,
        "totalingresos": 209443.99
      }
    ],
    "ultimocambio": new Date("2023-12-06T06:47:03.770Z"),
    "usuario": "usuariodesconocido"
  }

  let plantillaDefault = {
    "_id": {
      "$oid": "653691d64a8bdd9d1b16bc0a"
    },
    "nombre": "Default",
    "ultimaedicion": "adm",
    "orden": 0,
    "esdefault": true,
    "productos": [
      {
        "producto": "Garrafón",
        "precio": 10
      },
      {
        "producto": "Bolsa",
        "precio": 5.6
      },
      {
        "producto": "Isomax",
        "precio": 35
      },
      {
        "producto": "Cuco 50",
        "precio": 15
      },
      {
        "producto": "Cuco 25",
        "precio": 15
      },
      {
        "producto": "Sopas vaso",
        "precio": 43
      },
      {
        "producto": "Boopy",
        "precio": 15
      },
      {
        "producto": "Sopa bolsa",
        "precio": 49
      }
    ],
    "fechaultimaedicion": {
      "$date": "2023-10-23T15:31:34.233Z"
    },
    "__v": 0
  }

  let plantillas = [{
    nombre: "Default"
  }, {
    nombre: "Otraplantilla"
  }]
  res.render("registrarventas", { fecha: "3/3/2023", registro, plantillas, plantillaDefault, fechastr: "HOY", camioneros: [], esAdmin: true })
})

app.get('/plantillas/devuelveplantilla/:id', (req, res) => {
  if (req.params.id === 'Default') {
    res.send([
      {
        "producto": "garrafón",
        "precio": 10
      },
      {
        "producto": "bolsa",
        "precio": 5.6
      },
      {
        "producto": "isomax",
        "precio": 32
      },
      {
        "producto": "cuco 50",
        "precio": 15
      },
      {
        "producto": "cuco 25",
        "precio": 15
      },
      {
        "producto": "boopi",
        "precio": 25
      },
      {
        "producto": "dispensador",
        "precio": 50
      }
    ])
  } else {
    res.send([
      {
        "producto": "garrafón",
        "precio": 10
      },
      {
        "producto": "bolsa",
        "precio": 5.6
      },
      {
        "producto": "isomax",
        "precio": 32
      },
      {
        "producto": "cuco 50",
        "precio": 15
      },
      {
        "producto": "cuco 25",
        "precio": 15
      },
      {
        "producto": "boopi",
        "precio": 25
      },
      {
        "producto": "obj1",
        "precio": 12
      },
      {
        "producto": "dispensador",
        "precio": 50
      },
      {
        "producto": "obj2",
        "precio": 14.23
      },
      {
        "producto": "obj3",
        "precio": 31.12
      },
      {
        "producto": "obj4",
        "precio": 12
      },
      {
        "producto": "obj5",
        "precio": 14
      }
    ])
  }
})

app.post('/registrarventas/guardar', (req, res) => {
  res.send('')
})

app.listen(3000, s => console.log("esta corriendo el servidor en el puerto 3000"))