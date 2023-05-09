export let jsonSimple = `"camiones": [{ "nombretrabajador": "nanard", "filas": [{ "nombreproducto": "garrafón2","precioproducto": 10, "viajes": [{ "sale": 99, "entra": 3 } ],"vendidos": 96, "ingresos": 960 },{ "nombreproducto": "bolsa2","precioproducto": 5.60, "viajes": [{ "sale": 14, "entra": 1 } ],"vendidos": 13, "ingresos": 72.80 },{ "nombreproducto": "boopi","precioproducto": 25, "viajes": [{ "sale": 3, "entra": 2 } ],"vendidos": 1, "ingresos": 25 },{ "nombreproducto": "dispensador","precioproducto": 50, "viajes": [{ "sale": 4134, "entra": 2 } ],"vendidos": 4132, "ingresos": 206600 },{ "nombreproducto": "prueba","precioproducto": 13.43, "viajes": [{ "sale": 134, "entra": 1 } ],"vendidos": 133, "ingresos": 1786.19 } ],"totalvendidos": 4375, "totalingresos": 209443.99 }]`;
export let jsonUnCamionero = `"camiones": [{ "nombretrabajador": "xeresano", "filas": [{ "nombreproducto": "garrafón2","precioproducto": 10, "viajes": [{ "sale": 99, "entra": 3 } ],"vendidos": 96, "ingresos": 960 },{ "nombreproducto": "bolsa2","precioproducto": 5.60, "viajes": [{ "sale": 14, "entra": 1 } ],"vendidos": 13, "ingresos": 72.80 },{ "nombreproducto": "boopi","precioproducto": 25, "viajes": [{ "sale": 3, "entra": 2 } ],"vendidos": 1, "ingresos": 25 },{ "nombreproducto": "dispensador","precioproducto": 50, "viajes": [{ "sale": 4134, "entra": 2 } ],"vendidos": 4132, "ingresos": 206600 },{ "nombreproducto": "prueba","precioproducto": 13.43, "viajes": [{ "sale": 134, "entra": 1 } ],"vendidos": 133, "ingresos": 1786.19 } ],"totalvendidos": 4375, "totalingresos": 209443.99 }]`;
export let jsonCambiandoOrdenProductos = `"camiones": [{ "nombretrabajador": "xeresano", "filas": [{ "nombreproducto": "bolsa2","precioproducto": 5.60, "viajes": [{ "sale": 14, "entra": 1 } ],"vendidos": 13, "ingresos": 72.80 },{ "nombreproducto": "boopi","precioproducto": 25, "viajes": [{ "sale": 3, "entra": 2 } ],"vendidos": 1, "ingresos": 25 },{ "nombreproducto": "dispensador","precioproducto": 50, "viajes": [{ "sale": 4134, "entra": 2 } ],"vendidos": 4132, "ingresos": 206600 },{ "nombreproducto": "prueba","precioproducto": 13.43, "viajes": [{ "sale": 134, "entra": 1 } ],"vendidos": 133, "ingresos": 1786.19 }, { "nombreproducto": "garrafón2","precioproducto": 10, "viajes": [{ "sale": 99, "entra": 3 } ],"vendidos": 96, "ingresos": 960 } ],"totalvendidos": 4375, "totalingresos": 209443.99 }]`;
export let jsonAgregandoProductosYViajes = `"camiones": [{
  "nombretrabajador": "xeresano",
  "filas": [{
      "nombreproducto": "garrafón2",
      "precioproducto": 10,
      "viajes": [{
        "sale": 99,
        "entra": 3
      }, {
        "sale": 124,
        "entra": 42
      }],
      "vendidos": 178,
      "ingresos": 1780
    },
    {
      "nombreproducto": "bolsa2",
      "precioproducto": 5.60,
      "viajes": [{
        "sale": 14,
        "entra": 1
      }, {
        "sale": 125,
        "entra": 21
      }],
      "vendidos": 117,
      "ingresos": 655.20
    },
    {
      "nombreproducto": "boopi",
      "precioproducto": 25,
      "viajes": [{
        "sale": 3,
        "entra": 2
      }, {
        "sale": 124,
        "entra": 4
      }],
      "vendidos": 121,
      "ingresos": 3025
    },
    {
      "nombreproducto": "dispensador",
      "precioproducto": 50,
      "viajes": [{
        "sale": 4134,
        "entra": 2
      }, {
        "sale": 2154,
        "entra": 2
      }],
      "vendidos": 6284,
      "ingresos": 314200
    },
    {
      "nombreproducto": "prueba",
      "precioproducto": 13.43,
      "viajes": [{
        "sale": 134,
        "entra": 1
      }, {
        "sale": 54,
        "entra": 5
      }],
      "vendidos": 182,
      "ingresos": 2444.26
    },
    {
      "nombreproducto": "yami",
      "precioproducto": 12.4,
      "viajes": [{
        "sale": 125,
        "entra": 32
      }, {
        "sale": 12,
        "entra": 2
      }],
      "vendidos": 103,
      "ingresos": 1277.20
    }
  ],
  "totalvendidos": 6985,
  "totalingresos": 323381.66
}]`;
export let jsonDosTablas = `"camiones": [{
  "nombretrabajador": "xeresano",
  "filas": [{
      "nombreproducto": "garrafón2",
      "precioproducto": 10,
      "viajes": [{
        "sale": 99,
        "entra": 3
      }],
      "vendidos": 96,
      "ingresos": 960
    },
    {
      "nombreproducto": "bolsa2",
      "precioproducto": 5.60,
      "viajes": [{
        "sale": 14,
        "entra": 1
      }],
      "vendidos": 13,
      "ingresos": 72.80
    },
    {
      "nombreproducto": "boopi",
      "precioproducto": 25,
      "viajes": [{
        "sale": 3,
        "entra": 2
      }],
      "vendidos": 1,
      "ingresos": 25
    },
    {
      "nombreproducto": "dispensador",
      "precioproducto": 50,
      "viajes": [{
        "sale": 4134,
        "entra": 2
      }],
      "vendidos": 4132,
      "ingresos": 206600
    },
    {
      "nombreproducto": "prueba",
      "precioproducto": 13.43,
      "viajes": [{
        "sale": 134,
        "entra": 1
      }],
      "vendidos": 133,
      "ingresos": 1786.19
    }
  ],
  "totalvendidos": 4375,
  "totalingresos": 209443.99
},
{
  "nombretrabajador": "mostro",
  "filas": [{
      "nombreproducto": "garrafón",
      "precioproducto": 10,
      "viajes": [{
        "sale": 123,
        "entra": 23
      }],
      "vendidos": 100,
      "ingresos": 1000
    },
    {
      "nombreproducto": "bolsa",
      "precioproducto": 5.60,
      "viajes": [{
        "sale": 54,
        "entra": 21
      }],
      "vendidos": 33,
      "ingresos": 184.80
    },
    {
      "nombreproducto": "isomax",
      "precioproducto": 32,
      "viajes": [{
        "sale": 123,
        "entra": 4
      }],
      "vendidos": 119,
      "ingresos": 3808
    },
    {
      "nombreproducto": "cuco 50",
      "precioproducto": 15,
      "viajes": [{
        "sale": 54,
        "entra": 5
      }],
      "vendidos": 49,
      "ingresos": 735
    },
    {
      "nombreproducto": "cuco 25",
      "precioproducto": 15,
      "viajes": [{
        "sale": 2,
        "entra": 1
      }],
      "vendidos": 1,
      "ingresos": 15
    },
    {
      "nombreproducto": "boopi",
      "precioproducto": 25,
      "viajes": [{
        "sale": 123,
        "entra": 3
      }],
      "vendidos": 120,
      "ingresos": 3000
    },
    {
      "nombreproducto": "dispensador",
      "precioproducto": 50,
      "viajes": [{
        "sale": 25,
        "entra": 2
      }],
      "vendidos": 23,
      "ingresos": 1150
    }
  ],
  "totalvendidos": 445,
  "totalingresos": 9892.80
}
]`
export let jsonDosTablasAlReves = `"camiones": [{
  "nombretrabajador": "xeresano",
  "filas": [
    {
      "nombretrabajador": "mostro",
      "filas": [{
          "nombreproducto": "garrafón",
          "precioproducto": 10,
          "viajes": [{
            "sale": 123,
            "entra": 23
          }],
          "vendidos": 100,
          "ingresos": 1000
        },
        {
          "nombreproducto": "bolsa",
          "precioproducto": 5.60,
          "viajes": [{
            "sale": 54,
            "entra": 21
          }],
          "vendidos": 33,
          "ingresos": 184.80
        },
        {
          "nombreproducto": "isomax",
          "precioproducto": 32,
          "viajes": [{
            "sale": 123,
            "entra": 4
          }],
          "vendidos": 119,
          "ingresos": 3808
        },
        {
          "nombreproducto": "cuco 50",
          "precioproducto": 15,
          "viajes": [{
            "sale": 54,
            "entra": 5
          }],
          "vendidos": 49,
          "ingresos": 735
        },
        {
          "nombreproducto": "cuco 25",
          "precioproducto": 15,
          "viajes": [{
            "sale": 2,
            "entra": 1
          }],
          "vendidos": 1,
          "ingresos": 15
        },
        {
          "nombreproducto": "boopi",
          "precioproducto": 25,
          "viajes": [{
            "sale": 123,
            "entra": 3
          }],
          "vendidos": 120,
          "ingresos": 3000
        },
        {
          "nombreproducto": "dispensador",
          "precioproducto": 50,
          "viajes": [{
            "sale": 25,
            "entra": 2
          }],
          "vendidos": 23,
          "ingresos": 1150
        }
      ],
      "totalvendidos": 445,
      "totalingresos": 9892.80
    },
    {
      "nombreproducto": "garrafón2",
      "precioproducto": 10,
      "viajes": [{
        "sale": 99,
        "entra": 3
      }],
      "vendidos": 96,
      "ingresos": 960
    },
    {
      "nombreproducto": "bolsa2",
      "precioproducto": 5.60,
      "viajes": [{
        "sale": 14,
        "entra": 1
      }],
      "vendidos": 13,
      "ingresos": 72.80
    },
    {
      "nombreproducto": "boopi",
      "precioproducto": 25,
      "viajes": [{
        "sale": 3,
        "entra": 2
      }],
      "vendidos": 1,
      "ingresos": 25
    },
    {
      "nombreproducto": "dispensador",
      "precioproducto": 50,
      "viajes": [{
        "sale": 4134,
        "entra": 2
      }],
      "vendidos": 4132,
      "ingresos": 206600
    },
    {
      "nombreproducto": "prueba",
      "precioproducto": 13.43,
      "viajes": [{
        "sale": 134,
        "entra": 1
      }],
      "vendidos": 133,
      "ingresos": 1786.19
    }
  ],
  "totalvendidos": 4375,
  "totalingresos": 209443.99
}
]`
export let jsonCambiandoPlantilla = `"camiones": [{
  "nombretrabajador": "xeresano",
  "filas": [{
      "nombreproducto": "garrafón",
      "precioproducto": 10,
      "viajes": [{
        "sale": 123,
        "entra": 12
      }],
      "vendidos": 111,
      "ingresos": 1110
    },
    {
      "nombreproducto": "bolsa",
      "precioproducto": 5.60,
      "viajes": [{
        "sale": 43,
        "entra": 5
      }],
      "vendidos": 38,
      "ingresos": 212.80
    },
    {
      "nombreproducto": "isomax",
      "precioproducto": 32,
      "viajes": [{
        "sale": 1,
        "entra": 0
      }],
      "vendidos": 1,
      "ingresos": 32
    },
    {
      "nombreproducto": "cuco 50",
      "precioproducto": 15,
      "viajes": [{
        "sale": 3,
        "entra": 3
      }],
      "vendidos": 0,
      "ingresos": 0
    },
    {
      "nombreproducto": "cuco 25",
      "precioproducto": 15,
      "viajes": [{
        "sale": 4,
        "entra": 1
      }],
      "vendidos": 3,
      "ingresos": 45
    },
    {
      "nombreproducto": "boopi",
      "precioproducto": 25,
      "viajes": [{
        "sale": 1,
        "entra": 1
      }],
      "vendidos": 0,
      "ingresos": 0
    },
    {
      "nombreproducto": "obj1",
      "precioproducto": 12,
      "viajes": [{
        "sale": 4,
        "entra": 2
      }],
      "vendidos": 2,
      "ingresos": 24
    },
    {
      "nombreproducto": "dispensador",
      "precioproducto": 50,
      "viajes": [{
        "sale": 12,
        "entra": 5
      }],
      "vendidos": 7,
      "ingresos": 350
    },
    {
      "nombreproducto": "obj2",
      "precioproducto": 14.23,
      "viajes": [{
        "sale": 4,
        "entra": 2
      }],
      "vendidos": 2,
      "ingresos": 28.46
    },
    {
      "nombreproducto": "obj3",
      "precioproducto": 31.12,
      "viajes": [{
        "sale": 124,
        "entra": 12
      }],
      "vendidos": 112,
      "ingresos": 3485.44
    },
    {
      "nombreproducto": "obj4",
      "precioproducto": 12,
      "viajes": [{
        "sale": 54,
        "entra": 4
      }],
      "vendidos": 50,
      "ingresos": 600
    },
    {
      "nombreproducto": "obj5",
      "precioproducto": 14,
      "viajes": [{
        "sale": 43,
        "entra": 12
      }],
      "vendidos": 31,
      "ingresos": 434
    }
  ],
  "totalvendidos": 357,
  "totalingresos": 6321.70
}]`