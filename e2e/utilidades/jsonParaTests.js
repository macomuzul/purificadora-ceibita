export let jsonSimple = `"tablas": [{ "trabajador": "nanard", "productos": [{ "nombre": "garrafón2","precio": 10, "viajes": [99, 3],"vendidos": 96, "ingresos": 960 },{ "nombre": "bolsa2","precio": 5.6, "viajes": [14, 1],"vendidos": 13, "ingresos": 72.8 },{ "nombre": "boopi","precio": 25, "viajes": [3, 2],"vendidos": 1, "ingresos": 25 },{ "nombre": "dispensador","precio": 50, "viajes": [4134, 2],"vendidos": 4132, "ingresos": 206600 },{ "nombre": "prueba","precio": 13.43, "viajes": [134, 1],"vendidos": 133, "ingresos": 1786.19}],"totalvendidos": 4375, "totalingresos": 209443.99 }]`
export let jsonUnCamionero = `"tablas": [{ "trabajador": "xeresano", "productos": [{ "nombre": "garrafón2","precio": 10, "viajes": [99, 3],"vendidos": 96, "ingresos": 960 },{ "nombre": "bolsa2","precio": 5.6, "viajes": [14, 1],"vendidos": 13, "ingresos": 72.8 },{ "nombre": "boopi","precio": 25, "viajes": [3, 2],"vendidos": 1, "ingresos": 25 },{ "nombre": "dispensador","precio": 50, "viajes": [4134, 2],"vendidos": 4132, "ingresos": 206600 },{ "nombre": "prueba","precio": 13.43, "viajes": [134, 1],"vendidos": 133, "ingresos": 1786.19}],"totalvendidos": 4375, "totalingresos": 209443.99 }]`
export let jsonCambiandoOrdenProductos = `"tablas": [{ "trabajador": "xeresano", "productos": [{ "nombre": "bolsa2","precio": 5.6, "viajes": [14, 1],"vendidos": 13, "ingresos": 72.8 },{ "nombre": "boopi","precio": 25, "viajes": [3, 2],"vendidos": 1, "ingresos": 25 },{ "nombre": "dispensador","precio": 50, "viajes": [4134, 2],"vendidos": 4132, "ingresos": 206600 },{ "nombre": "prueba","precio": 13.43, "viajes": [134, 1],"vendidos": 133, "ingresos": 1786.19 }, { "nombre": "garrafón2","precio": 10, "viajes": [99, 3],"vendidos": 96, "ingresos": 960}],"totalvendidos": 4375, "totalingresos": 209443.99 }]`
export let jsonAgregandoProductosYViajes = `"tablas": [{
  "trabajador": "xeresano",
  "productos": [{
      "nombre": "garrafón2",
      "precio": 10,
      "viajes": [99, 3, 124, 42],
      "vendidos": 178,
      "ingresos": 1780
    },
    {
      "nombre": "bolsa2",
      "precio": 5.6,
      "viajes": [14, 1, 125, 21],
      "vendidos": 117,
      "ingresos": 655.2
    },
    {
      "nombre": "boopi",
      "precio": 25,
      "viajes": [3, 2, 124, 4],
      "vendidos": 121,
      "ingresos": 3025
    },
    {
      "nombre": "dispensador",
      "precio": 50,
      "viajes": [4134, 2, 2154, 2],
      "vendidos": 6284,
      "ingresos": 314200
    },
    {
      "nombre": "prueba",
      "precio": 13.43,
      "viajes": [134, 1, 54, 5],
      "vendidos": 182,
      "ingresos": 2444.26
    },
    {
      "nombre": "yami",
      "precio": 12.4,
      "viajes": [125, 32, 12, 2],
      "vendidos": 103,
      "ingresos": 1277.2
    }
  ],
  "totalvendidos": 6985,
  "totalingresos": 323381.66
}]`
export let jsonDosTablas = `"tablas": [{
  "trabajador": "xeresano",
  "productos": [{
      "nombre": "garrafón2",
      "precio": 10,
      "viajes": [99, 3],
      "vendidos": 96,
      "ingresos": 960
    },
    {
      "nombre": "bolsa2",
      "precio": 5.6,
      "viajes": [14, 1],
      "vendidos": 13,
      "ingresos": 72.8
    },
    {
      "nombre": "boopi",
      "precio": 25,
      "viajes": [3, 2],
      "vendidos": 1,
      "ingresos": 25
    },
    {
      "nombre": "dispensador",
      "precio": 50,
      "viajes": [4134, 2],
      "vendidos": 4132,
      "ingresos": 206600
    },
    {
      "nombre": "prueba",
      "precio": 13.43,
      "viajes": [134, 1],
      "vendidos": 133,
      "ingresos": 1786.19
    }
  ],
  "totalvendidos": 4375,
  "totalingresos": 209443.99
},
{
  "trabajador": "mostro",
  "productos": [{
      "nombre": "garrafón",
      "precio": 10,
      "viajes": [123, 23],
      "vendidos": 100,
      "ingresos": 1000
    },
    {
      "nombre": "bolsa",
      "precio": 5.6,
      "viajes": [54, 21],
      "vendidos": 33,
      "ingresos": 184.8
    },
    {
      "nombre": "isomax",
      "precio": 32,
      "viajes": [123, 4],
      "vendidos": 119,
      "ingresos": 3808
    },
    {
      "nombre": "cuco 50",
      "precio": 15,
      "viajes": [54, 5],
      "vendidos": 49,
      "ingresos": 735
    },
    {
      "nombre": "cuco 25",
      "precio": 15,
      "viajes": [2, 1],
      "vendidos": 1,
      "ingresos": 15
    },
    {
      "nombre": "boopi",
      "precio": 25,
      "viajes": [123, 3],
      "vendidos": 120,
      "ingresos": 3000
    },
    {
      "nombre": "dispensador",
      "precio": 50,
      "viajes": [25, 2],
      "vendidos": 23,
      "ingresos": 1150
    }
  ],
  "totalvendidos": 445,
  "totalingresos": 9892.8
}
]`
export let jsonDosTablasAlReves = `"tablas":[{"trabajador":"mostro","productos":[{"nombre":"garrafón","precio":10,"viajes":[123,23],"vendidos":100,"ingresos":1000},{"nombre":"bolsa","precio":5.6,"viajes":[54,21],"vendidos":33,"ingresos":184.8},{"nombre":"isomax","precio":32,"viajes":[123,4],"vendidos":119,"ingresos":3808},{"nombre":"cuco 50","precio":15,"viajes":[54,5],"vendidos":49,"ingresos":735},{"nombre":"cuco 25","precio":15,"viajes":[2,1],"vendidos":1,"ingresos":15},{"nombre":"boopi","precio":25,"viajes":[123,3],"vendidos":120,"ingresos":3000},{"nombre":"dispensador","precio":50,"viajes":[25,2],"vendidos":23,"ingresos":1150}],"totalvendidos":445,"totalingresos":9892.8},{"trabajador":"xeresano","productos":[{"nombre":"garrafón2","precio":10,"viajes":[99,3],"vendidos":96,"ingresos":960},{"nombre":"bolsa2","precio":5.6,"viajes":[14,1],"vendidos":13,"ingresos":72.8},{"nombre":"boopi","precio":25,"viajes":[3,2],"vendidos":1,"ingresos":25},{"nombre":"dispensador","precio":50,"viajes":[4134,2],"vendidos":4132,"ingresos":206600},{"nombre":"prueba","precio":13.43,"viajes":[134,1],"vendidos":133,"ingresos":1786.19}],"totalvendidos":4375,"totalingresos":209443.99}]`
export let jsonCambiandoPlantilla = `"tablas": [{
  "trabajador": "xeresano",
  "productos": [{
      "nombre": "garrafón",
      "precio": 10,
      "viajes": [123, 12],
      "vendidos": 111,
      "ingresos": 1110
    },
    {
      "nombre": "bolsa",
      "precio": 5.6,
      "viajes": [43, 5],
      "vendidos": 38,
      "ingresos": 212.8
    },
    {
      "nombre": "isomax",
      "precio": 32,
      "viajes": [1, 0],
      "vendidos": 1,
      "ingresos": 32
    },
    {
      "nombre": "cuco 50",
      "precio": 15,
      "viajes": [3, 3],
      "vendidos": 0,
      "ingresos": 0
    },
    {
      "nombre": "cuco 25",
      "precio": 15,
      "viajes": [4, 1],
      "vendidos": 3,
      "ingresos": 45
    },
    {
      "nombre": "boopi",
      "precio": 25,
      "viajes": [1, 1],
      "vendidos": 0,
      "ingresos": 0
    },
    {
      "nombre": "obj1",
      "precio": 12,
      "viajes": [4, 2],
      "vendidos": 2,
      "ingresos": 24
    },
    {
      "nombre": "dispensador",
      "precio": 50,
      "viajes": [12, 5],
      "vendidos": 7,
      "ingresos": 350
    },
    {
      "nombre": "obj2",
      "precio": 14.23,
      "viajes": [4, 2],
      "vendidos": 2,
      "ingresos": 28.46
    },
    {
      "nombre": "obj3",
      "precio": 31.12,
      "viajes": [124, 12],
      "vendidos": 112,
      "ingresos": 3485.44
    },
    {
      "nombre": "obj4",
      "precio": 12,
      "viajes": [54, 4],
      "vendidos": 50,
      "ingresos": 600
    },
    {
      "nombre": "obj5",
      "precio": 14,
      "viajes": [43, 12],
      "vendidos": 31,
      "ingresos": 434
    }
  ],
  "totalvendidos": 357,
  "totalingresos": 6321.7
}]`