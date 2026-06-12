// ==========================================
// ARCHIVO: js/data/discardRules.js
// Propósito: Tabla declarativa de reglas para las acciones de "Lavar" y "Guardar"
//            asociadas a los sprites de descarte en el canvas.
// ==========================================

// Tipo de regla:
// {
//   paso:            number      — paso en que aplica
//   texturas:        string[]    — texturas válidas del objeto arrastrado
//   destinoEsperado: string      — 'LAVAR' o 'GUARDAR'
//   accion:          string      — nombre de la acción para StepManager.validarAccion()
//   datos:           (go) => object
// }

window.DISCARD_RULES = [

    // --- PASO 7: Guardar recipiente de mezcla y lavar espátula ---
    {
        paso: 7,
        texturas: [TX.VASO_CON_MEZCLA],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_MEZCLA_Y_LAVAR_ESPATULA',
        datos: (go) => ({ mezcla: go })
    },
    {
        paso: 7,
        texturas: [TX.ESPATULA_LLENA, TX.ESPATULA],
        destinoEsperado: 'LAVAR',
        accion: 'GUARDAR_MEZCLA_Y_LAVAR_ESPATULA',
        datos: (go) => ({ espatula: go })
    },

    // --- PASO 10: Lavar probeta ---
    {
        paso: 10,
        texturas: [TX.PROBETA, TX.PROBETA_40ML],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_PROBETA',
        datos: (go) => ({ probeta: go })
    },

    // --- PASO 21: Lavar vaso y varilla, guardar piseta ---
    {
        paso: 21,
        texturas: [
            TX.VASO_AGITADO, TX.VASO_SOLUCION_FINAL, TX.VASO_VACIO,
            TX.VASO_CON_SUSTANCIA, TX.VASO_CON_AGUA, TX.VASO_ARENA_HUMEDA,
            TX.VASO_ARENA_VIGILANTE
        ],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_VASO_VARILLA_GUARDAR_PISETA',
        datos: (go) => ({ vaso: go })
    },
    {
        paso: 21,
        texturas: [TX.VARILLA],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_VASO_VARILLA_GUARDAR_PISETA',
        datos: (go) => ({ varilla: go })
    },
    {
        paso: 21,
        texturas: [TX.PISETA],
        destinoEsperado: 'GUARDAR',
        accion: 'LAVAR_VASO_VARILLA_GUARDAR_PISETA',
        datos: (go) => ({ piseta: go })
    },

    // --- PASO 22: Retirar filtro con arena y lavar embudo ---
    {
        paso: 22,
        texturas: [TX.EMBUDO],
        destinoEsperado: 'LAVAR',
        accion: 'QUITAR_FILTRO_Y_LAVAR_EMBUDO',
        datos: (go) => ({ embudo: go })
    },

    // --- PASO 24: Guardar soporte de filtración ---
    {
        paso: 24,
        texturas: [
            TX.SOPORTE_EMBUDO, TX.SOPORTE_ARO, TX.SOPORTE_ICONO,
            TX.SOPORTE_FILTRO, TX.SOPORTE_VIGILANTE, TX.SOPORTE_SOLUCION,
            TX.SOPORTE_FILTRANDO, TX.SOPORTE_ARENA_1, TX.SOPORTE_ARENA_2,
            TX.SOPORTE_FINAL, 'Soporte Universal'
        ],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_SOPORTE',
        datos: (go) => ({ soporte: go })
    },
    {
        paso: 24,
        texturas: [TX.SOPORTE_ARO_PIEZA],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_SOPORTE',
        datos: (go) => ({ aro: go })
    },

    // --- PASO 33: Guardar trípode completo y mechero ---
    {
        paso: 33,
        texturas: [TX.TRIPODE_COMPLETO, TX.MECHERO],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_ELEMENTOS_CALCINACION',
        datos: (go) => ({ calentamiento: go })
    },

    // --- PASO 36: Guardar pinzas ---
    {
        paso: 36,
        texturas: [TX.PINZA],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_PINZAS',
        datos: (go) => ({ pinza: go })
    },

    // --- PASO 41: Lavar erlenmeyer ---
    {
        paso: 41,
        texturas: [TX.ERLENMEYER, TX.ERLENMEYER_SOL2, TX.ERLENMEYER_SOL3, TX.ERLENMEYER_SOL4],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_ERLENMEYER',
        datos: (go) => ({ erlenmeyer: go })
    },

    // --- PASO 48: Apagar y guardar baño termostático ---
    {
        paso: 48,
        texturas: [TX.BANIO_CAPSULA, TX.BANIO_PRENDIDO, TX.BANIO],
        destinoEsperado: 'GUARDAR',
        accion: 'APAGAR_Y_GUARDAR_BANIO',
        datos: (go) => ({ banio: go })
    },

    // --- PASO 49: Apagar y guardar estufa ---
    {
        paso: 49,
        texturas: [TX.ESTUFA_CAPSULA, TX.ESTUFA],
        destinoEsperado: 'GUARDAR',
        accion: 'APAGAR_Y_GUARDAR_ESTUFA',
        datos: (go) => ({ estufa: go })
    },

    // --- PASO 54: Lavar crisol ---
    {
        paso: 54,
        texturas: [TX.CRISOL],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_CRISOL_FINAL',
        datos: (go) => ({ crisol: go })
    },

    // --- PASO 58: Guardar balanza y desecador ---
    {
        paso: 58,
        texturas: [TX.BALANZA],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_BALANZA_DESECADOR',
        datos: (go) => ({ balanza: go })
    },
    {
        paso: 58,
        texturas: [TX.DESECADOR, TX.DESECADOR_AMBOS, TX.DESECADOR_CAPSULA, TX.DESECADOR_CRISOL],
        destinoEsperado: 'GUARDAR',
        accion: 'GUARDAR_BALANZA_DESECADOR',
        datos: (go) => ({ desecador: go })
    },

    // --- PASO 59: Lavar cápsula ---
    {
        paso: 59,
        texturas: [TX.CAPSULA],
        destinoEsperado: 'LAVAR',
        accion: 'LAVAR_CAPSULA_FINAL',
        datos: (go) => ({ capsula: go })
    }
];
