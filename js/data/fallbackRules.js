// ==========================================
// ARCHIVO: js/data/fallbackRules.js
// Propósito: Tabla de fallbacks de proximidad para el evento dragend.
//            Cuando el dropZone no detecta la colisión, estos fallbacks buscan
//            el objeto destino dentro de un radio (distancia máxima en px).
// ==========================================

// Tipo de regla:
// {
//   paso:          number    — paso en que aplica
//   texturaObjeto: string    — textura del objeto soltado
//   texturaDestino: string   — textura del objeto a buscar en escena
//   distancia:     number    — radio máximo de detección en px
//   accion:        string    — acción para StepManager.validarAccion()
//   datos:         (go, destino) => object
//   post?:         (go, destino) => void
// }

window.FALLBACK_RULES = [

    // Paso 9: probeta suelta cerca del vaso con sustancia
    {
        paso: 9,
        texturaObjeto: TX.PROBETA_40ML,
        texturaDestino: TX.VASO_CON_SUSTANCIA,
        distancia: 250,
        accion: 'VERTER_AGUA_VASO',
        datos: (go, destino) => ({ probeta: go, vaso: destino }),
        post: (go, destino) => { go.x = destino.x; go.y = destino.y - 60; }
    },

    // Paso 11: varilla suelta cerca del vaso con sal+agua
    {
        paso: 11,
        texturaObjeto: TX.VARILLA,
        texturaDestino: TX.VASO_CON_AGUA,
        distancia: 250,
        accion: 'AGITAR_MEZCLA',
        datos: (go, destino) => ({ varilla: go, vaso: destino }),
        post: (go, destino) => { go.x = destino.x + 20; go.y = destino.y - 40; }
    },

    // Paso 13: Erlenmeyer suelto cerca del soporte con Aro
    {
        paso: 13,
        texturaObjeto: TX.ERLENMEYER,
        texturaDestino: TX.SOPORTE_ARO,
        distancia: 300,
        accion: 'COLOCAR_ERLENMEYER',
        datos: (go, destino) => ({ erlenmeyer: go, soporte: destino }),
        post: null
    },

    // Paso 12: Aro suelto cerca del soporte universal vacío
    {
        paso: 12,
        texturaObjeto: TX.SOPORTE_ARO_PIEZA,
        texturaDestino: TX.SOPORTE_ICONO,
        distancia: 300,
        accion: 'ARMAR_SOPORTE_EMBUDO',
        datos: (go, destino) => ({ aro: go, soporte: destino }),
        post: null
    },

    // Paso 14: Papel de filtro suelto cerca del embudo en la mesa
    {
        paso: 14,
        texturaObjeto: TX.FILTRO_ICONO,
        texturaDestino: TX.EMBUDO,
        distancia: 300,
        accion: 'DOBLAR_FILTRO_Y_COLOCAR_EMBUDO',
        datos: (go, destino) => ({ filtro: go, embudo: destino }),
        post: null
    },

    // Paso 15: Piseta suelta cerca del embudo en la mesa
    {
        paso: 15,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.EMBUDO,
        distancia: 300,
        accion: 'ADHERIR_FILTRO_PISETA',
        datos: (go, destino) => ({ piseta: go, embudo: destino }),
        post: null
    },

    // Paso 16a: Embudo suelto cerca del soporte con Aro y Erlenmeyer
    {
        paso: 16,
        texturaObjeto: TX.EMBUDO,
        texturaDestino: TX.SOPORTE_ARO,
        distancia: 300,
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, destino) => ({ embudo: go, soporte: destino, subAccion: 'EMBUDO' }),
        post: null
    },

    // Paso 16b: Varilla suelta cerca de la boca del embudo en el soporte
    {
        paso: 16,
        texturaObjeto: TX.VARILLA,
        texturaDestino: TX.SOPORTE_FILTRO,
        distancia: 300,
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, destino) => ({ varilla: go, soporte: destino, subAccion: 'VARILLA' }),
        post: null
    },

    // Paso 17: Vaso con solución suelto cerca del soporte con vigilante
    {
        paso: 17,
        texturaObjeto: TX.VASO_AGITADO,
        texturaDestino: TX.SOPORTE_VIGILANTE,
        distancia: 450,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz }),
        post: null
    },
    {
        paso: 17,
        texturaObjeto: TX.VASO_CON_AGUA,
        texturaDestino: TX.SOPORTE_VIGILANTE,
        distancia: 450,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz }),
        post: null
    },
    {
        paso: 17,
        texturaObjeto: TX.VASO_AGITADO,
        texturaDestino: TX.SOPORTE_FILTRO,
        distancia: 450,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz }),
        post: null
    },
    {
        paso: 17,
        texturaObjeto: TX.VASO_CON_AGUA,
        texturaDestino: TX.SOPORTE_FILTRO,
        distancia: 450,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz }),
        post: null
    },

    // Paso 18 (Estado 1): Piseta suelta cerca de soporte filtrando
    {
        paso: 18,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_SOLUCION,
        distancia: 300,
        accion: 'LAVAR_VARILLA_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },

    // Paso 18 (Estado 2): Piseta suelta cerca de soporte filtrando
    {
        paso: 18,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_FILTRANDO,
        distancia: 300,
        accion: 'LAVAR_VARILLA_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },

    // Paso 18 (Estado 3): Piseta suelta cerca de soporte filtrando
    {
        paso: 18,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_ARENA_1,
        distancia: 300,
        accion: 'LAVAR_VARILLA_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },

    // Paso 19: Piseta suelta cerca de vaso con arena humeda
    {
        paso: 19,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.VASO_ARENA_HUMEDA,
        distancia: 300,
        accion: 'TRASVASAR_ARENA_PISETA',
        datos: (go, dz) => {
            const sc = go.scene;
            const soporte = sc ? sc.children.list.find(o => o instanceof SoporteFiltracion) : null;
            return { piseta: go, vaso: dz, soporte: soporte };
        },
        post: null
    },

    // Paso 20: Piseta suelta cerca de soporte con arena (lavar filtro)
    {
        paso: 20,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_ARENA_2,
        distancia: 300,
        accion: 'LAVAR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },
    {
        paso: 20,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_ARENA_1,
        distancia: 300,
        accion: 'LAVAR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },
    {
        paso: 20,
        texturaObjeto: TX.PISETA,
        texturaDestino: TX.SOPORTE_FILTRANDO,
        distancia: 300,
        accion: 'LAVAR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz }),
        post: null
    },

    // Paso 28: Papel de filtro con arena cerca del crisol
    {
        paso: 28,
        texturaObjeto: TX.FILTRO_ARENA,
        texturaDestino: TX.CRISOL,
        distancia: 300,
        accion: 'COLOCAR_FILTRO_CRISOL',
        datos: (go, destino) => ({ filtro: go, crisol: destino }),
        post: null
    },

    // Paso 26: Crisol suelto cerca de la balanza
    {
        paso: 26,
        texturaObjeto: TX.CRISOL,
        texturaDestino: TX.BALANZA,
        distancia: 300,
        accion: 'PESAR_CRISOL_VACIO',
        datos: (go, destino) => ({ crisol: go, balanza: destino }),
        post: (go, destino) => { go.x = destino.x; go.y = destino.y - 100; }
    },

    // Paso 29a: Triángulo suelto cerca del trípode
    {
        paso: 29,
        texturaObjeto: TX.TRIANGULO,
        texturaDestino: TX.TRIPODE,
        distancia: 300,
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, destino) => ({ triangulo: go, calentamiento: destino, subAccion: 'TRIANGULO' }),
        post: null
    },

    // Paso 29b: Crisol suelto cerca del trípode con triángulo
    {
        paso: 29,
        texturaObjeto: TX.CRISOL,
        texturaDestino: TX.TRIPODE_TRIANGULO,
        distancia: 300,
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, destino) => ({ crisol: go, calentamiento: destino, subAccion: 'CRISOL' }),
        post: null
    },

    // Paso 30: Mechero suelto cerca de trípode completo
    {
        paso: 30,
        texturaObjeto: TX.MECHERO,
        texturaDestino: TX.TRIPODE_COMPLETO,
        distancia: 300,
        accion: 'SPAWN_MECHERO',
        datos: (go, destino) => ({ mechero: go, calentamiento: destino }),
        post: null
    },

    // Paso 35: Crisol suelto cerca de desecador
    {
        paso: 35,
        texturaObjeto: TX.CRISOL,
        texturaDestino: TX.DESECADOR,
        distancia: 300,
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, destino) => ({ crisol: go, desecador: destino }),
        post: null
    },
    {
        paso: 35,
        texturaObjeto: TX.CRISOL_PINZAS,
        texturaDestino: TX.DESECADOR,
        distancia: 300,
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, destino) => ({ crisol: go, desecador: destino }),
        post: null
    },

    // Paso 52: Crisol suelto cerca de la balanza
    {
        paso: 52,
        texturaObjeto: TX.CRISOL,
        texturaDestino: TX.BALANZA,
        distancia: 300,
        accion: 'PESAR_CRISOL_ARENA',
        datos: (go, destino) => ({ crisol: go, balanza: destino }),
        post: (go, destino) => { go.x = destino.x; go.y = destino.y - 100; }
    },
];
