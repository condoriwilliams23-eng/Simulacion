// ==========================================
// ARCHIVO: js/data/dropRules.js
// Propósito: Tabla declarativa de reglas para las interacciones entre objetos,
//            con soporte de margen amplio de ubicación y estados visuales exactos.
// ==========================================

window.DROP_RULES = [

    // --- Paso 2: Vaso → Balanza ---
    {
        pasos: [2],
        arrastrado: TX.VASO_VACIO,
        destinos: [TX.BALANZA],
        margen: 240,
        accion: 'COLOCAR_Y_TARAR_VASO',
        datos: (go, dz) => ({ balanza: dz, vaso: go })
    },

    // --- Paso 4a: Espátula vacía → Recipiente de mezcla ---
    {
        pasos: [4],
        arrastrado: TX.ESPATULA,
        destinos: [TX.VASO_CON_MEZCLA],
        margen: 230,
        accion: 'TRASVASAR_MEZCLA',
        datos: (go, dz) => ({ espatula: go, vasoMezcla: dz, subAccion: 'CARGAR' })
    },

    // --- Paso 4b: Espátula llena → Vaso en balanza (o balanza como referencia) ---
    {
        pasos: [4],
        arrastrado: TX.ESPATULA_LLENA,
        destinos: [TX.VASO_VACIO, TX.BALANZA],
        margen: 250,
        accion: 'TRASVASAR_MEZCLA',
        datos: (go, dz, scene) => {
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_VACIO)
                : dz;
            return vaso ? { espatula: go, vasoBalanza: vaso, subAccion: 'VERTIR' } : null;
        }
    },

    // --- Paso 8: Piseta → Probeta ---
    {
        pasos: [8],
        arrastrado: TX.PISETA,
        destinos: [TX.PROBETA],
        margen: 240,
        accion: 'LLENAR_PROBETA_40ML',
        datos: (go, dz) => ({ piseta: go, probeta: dz, subAccion: 'LLENAR' })
    },

    // --- Paso 9: Probeta 40 mL → Vaso con mezcla (efecto de volque en el borde de la boca) ---
    {
        pasos: [9],
        arrastrado: TX.PROBETA_40ML,
        destinos: [TX.VASO_CON_SUSTANCIA, TX.BALANZA],
        margen: 260,
        accion: 'VERTER_AGUA_VASO',
        datos: (go, dz, scene) => {
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_CON_SUSTANCIA)
                : dz;
            return vaso ? { probeta: go, vaso: vaso } : null;
        }
    },

    // --- Paso 11: Varilla → Vaso con sal+agua ---
    {
        pasos: [11],
        arrastrado: TX.VARILLA,
        destinos: [TX.VASO_CON_AGUA, TX.BALANZA],
        margen: 250,
        accion: 'AGITAR_MEZCLA',
        datos: (go, dz, scene) => {
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_CON_AGUA)
                : dz;
            return vaso ? { varilla: go, vaso: vaso } : null;
        }
    },

    // --- Paso 12: Aro → Soporte Universal vacío ---
    {
        pasos: [12],
        arrastrado: TX.SOPORTE_ARO_PIEZA,
        destinos: [TX.SOPORTE_ICONO],
        margen: 260,
        accion: 'ARMAR_SOPORTE_EMBUDO',
        datos: (go, dz) => ({ aro: go, soporte: dz })
    },

    // --- Paso 13: Erlenmeyer → Soporte con Aro ---
    {
        pasos: [13],
        arrastrado: TX.ERLENMEYER,
        destinos: [TX.SOPORTE_ARO, TX.SOPORTE_ICONO],
        margen: 260,
        accion: 'COLOCAR_ERLENMEYER',
        datos: (go, dz) => ({ erlenmeyer: go, soporte: dz })
    },

    // --- Paso 14: Papel de filtro → Embudo ---
    {
        pasos: [14],
        arrastrado: TX.FILTRO_1,
        destinos: [TX.EMBUDO],
        margen: 240,
        accion: 'DOBLAR_FILTRO_Y_COLOCAR_EMBUDO',
        datos: (go, dz) => ({ filtro: go, embudo: dz })
    },
    {
        pasos: [14],
        arrastrado: TX.FILTRO_ICONO,
        destinos: [TX.EMBUDO],
        margen: 240,
        accion: 'DOBLAR_FILTRO_Y_COLOCAR_EMBUDO',
        datos: (go, dz) => ({ filtro: go, embudo: dz })
    },

    // --- Paso 15: Piseta → Embudo con filtro ---
    {
        pasos: [15],
        arrastrado: TX.PISETA,
        destinos: [TX.EMBUDO_CON_FILTRO, TX.EMBUDO],
        margen: 240,
        accion: 'ADHERIR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, embudo: dz })
    },

    // --- Paso 16a: Embudo con filtro → Soporte con Aro y Erlenmeyer ---
    {
        pasos: [16],
        arrastrado: TX.EMBUDO_CON_FILTRO,
        destinos: [TX.SOPORTE_ARO_ERLENMEYER, TX.SOPORTE_ARO],
        margen: 260,
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, dz) => ({ embudo: go, soporte: dz, subAccion: 'EMBUDO' })
    },
    {
        pasos: [16],
        arrastrado: TX.EMBUDO,
        destinos: [TX.SOPORTE_ARO_ERLENMEYER, TX.SOPORTE_ARO],
        margen: 260,
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, dz) => ({ embudo: go, soporte: dz, subAccion: 'EMBUDO' })
    },

    // --- Paso 16b: Varilla → Soporte con Filtro ---
    {
        pasos: [16],
        arrastrado: TX.VARILLA,
        destinos: [TX.SOPORTE_FILTRO, TX.SOPORTE_EMBUDO],
        margen: 260,
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, dz) => ({ varilla: go, soporte: dz, subAccion: 'VARILLA' })
    },

    // --- Paso 17: Vaso con solución → Soporte con vigilante (volcado en boca de embudo) ---
    {
        pasos: [17],
        arrastrado: TX.VASO_AGITADO,
        destinos: [TX.SOPORTE_VIGILANTE, TX.SOPORTE_FILTRO, TX.SOPORTE_EMBUDO],
        margen: 280,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz })
    },
    {
        pasos: [17],
        arrastrado: TX.VASO_CON_AGUA,
        destinos: [TX.SOPORTE_VIGILANTE, TX.SOPORTE_FILTRO, TX.SOPORTE_EMBUDO],
        margen: 280,
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz })
    },

    // --- Paso 18: Piseta → Soporte filtrando con vigilante (lavar varilla) ---
    {
        pasos: [18],
        arrastrado: TX.PISETA,
        destinos: [TX.SOPORTE_SOLUCION, TX.SOPORTE_VIGILANTE, TX.SOPORTE_FILTRANDO, TX.SOPORTE_ARENA_1],
        margen: 260,
        accion: 'LAVAR_VARILLA_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz })
    },

    // --- Paso 19: Piseta → Vaso con arena húmeda (trasvasar arena con volcado) ---
    {
        pasos: [19],
        arrastrado: TX.PISETA,
        destinos: [TX.VASO_ARENA_HUMEDA],
        margen: 250,
        accion: 'TRASVASAR_ARENA_PISETA',
        datos: (go, dz, scene) => {
            const sc = scene || go.scene;
            const soporte = sc ? sc.children.list.find(o => o instanceof SoporteFiltracion) : null;
            return { piseta: go, vaso: dz, soporte: soporte };
        }
    },

    // --- Paso 20: Piseta → Soporte con arena (lavar filtro) ---
    {
        pasos: [20],
        arrastrado: TX.PISETA,
        destinos: [TX.SOPORTE_ARENA_1, TX.SOPORTE_ARENA_2, TX.SOPORTE_FILTRANDO, TX.SOPORTE_SOLUCION],
        margen: 260,
        accion: 'LAVAR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz })
    },

    // --- Paso 26 y 52: Crisol → Balanza ---
    {
        pasos: [26, 52],
        arrastrado: TX.CRISOL,
        destinos: [TX.BALANZA],
        margen: 250,
        accion: null,
        resolver: (paso) => paso === 26 ? 'PESAR_CRISOL_VACIO' : 'PESAR_CRISOL_ARENA',
        datos: (go, dz) => ({ crisol: go, balanza: dz })
    },

    // --- Paso 28: Papel de filtro con arena → Crisol ---
    {
        pasos: [28],
        arrastrado: TX.FILTRO_ARENA,
        destinos: [TX.CRISOL],
        margen: 240,
        accion: 'COLOCAR_FILTRO_CRISOL',
        datos: (go, dz) => ({ filtro: go, crisol: dz })
    },

    // --- Paso 29a: Triángulo → Trípode ---
    {
        pasos: [29],
        arrastrado: TX.TRIANGULO,
        destinos: [TX.TRIPODE],
        margen: 250,
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, dz) => ({ triangulo: go, calentamiento: dz, subAccion: 'TRIANGULO' })
    },

    // --- Paso 29b: Crisol (con filtro o normal) → Trípode con triángulo ---
    {
        pasos: [29],
        arrastrado: TX.CRISOL_FILTRO,
        destinos: [TX.TRIPODE_TRIANGULO, TX.TRIPODE],
        margen: 250,
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, dz) => ({ crisol: go, calentamiento: dz, subAccion: 'CRISOL' })
    },
    {
        pasos: [29],
        arrastrado: TX.CRISOL,
        destinos: [TX.TRIPODE_TRIANGULO, TX.TRIPODE],
        margen: 250,
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, dz) => ({ crisol: go, calentamiento: dz, subAccion: 'CRISOL' })
    },

    // --- Paso 30: Mechero → Calentamiento (Trípode + triángulo + crisol) ---
    {
        pasos: [30],
        arrastrado: TX.MECHERO,
        destinos: [TX.TRIPODE_TRIANGULO_CRISOL, TX.TRIPODE_COMPLETO, TX.TRIPODE_TRIANGULO, TX.TRIPODE],
        margen: 250,
        accion: 'SPAWN_MECHERO',
        datos: (go, dz) => ({ mechero: go, calentamiento: dz })
    },

    // --- Paso 32: Pinza → Calentamiento (alternativa a clickear para calcinar y verificar) ---
    {
        pasos: [32],
        arrastrado: TX.PINZA,
        destinos: [TX.TRIPODE_COMPLETO, TX.TRIPODE_TRIANGULO_MECHERO, TX.TRIPODE_TRIANGULO_CRISOL],
        margen: 250,
        accion: 'CALCINAR_ARENA',
        datos: (go, dz) => ({ pinza: go, calentamiento: dz })
    },

    // --- Paso 35: Crisol (o Pinza) → Desecador ---
    {
        pasos: [35],
        arrastrado: TX.CRISOL,
        destinos: [TX.DESECADOR],
        margen: 260,
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, dz) => ({ crisol: go, desecador: dz })
    },
    {
        pasos: [35],
        arrastrado: TX.CRISOL_PINZAS,
        destinos: [TX.DESECADOR],
        margen: 260,
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, dz) => ({ crisol: go, desecador: dz })
    },
    {
        pasos: [35],
        arrastrado: TX.PINZA,
        destinos: [TX.CRISOL, TX.CRISOL_PINZAS, TX.DESECADOR],
        margen: 260,
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, dz, scene) => {
            const desecador = dz.texture.key === TX.DESECADOR
                ? dz
                : scene.children.list.find(o => o.texture && o.texture.key === TX.DESECADOR);
            const crisol = (dz.texture.key === TX.CRISOL || dz.texture.key === TX.CRISOL_PINZAS)
                ? dz
                : scene.children.list.find(o => o.texture && (o.texture.key === TX.CRISOL || o.texture.key === TX.CRISOL_PINZAS));
            return (desecador && crisol) ? { pinza: go, crisol, desecador } : null;
        }
    },

    // --- Paso 38 y 56: Cápsula → Balanza ---
    {
        pasos: [38, 56],
        arrastrado: TX.CAPSULA,
        destinos: [TX.BALANZA],
        margen: 250,
        accion: null,
        resolver: (paso) => paso === 38 ? 'PESAR_CAPSULA_VACIA' : 'PESAR_CAPSULA_SAL',
        datos: (go, dz) => ({ capsula: go, balanza: dz })
    },

    // --- Paso 40: Erlenmeyer con solución → Cápsula (volcado en el borde de la boca) ---
    {
        pasos: [40],
        arrastrado: TX.VASO_SOLUCION_FINAL,
        destinos: [TX.CAPSULA],
        margen: 250,
        accion: 'TRASVASAR_FILTRADO_CAPSULA',
        datos: (go, dz) => ({ erlenmeyer: go, capsula: dz })
    },
    {
        pasos: [40],
        arrastrado: TX.ERLENMEYER_SOL4,
        destinos: [TX.CAPSULA],
        margen: 250,
        accion: 'TRASVASAR_FILTRADO_CAPSULA',
        datos: (go, dz) => ({ erlenmeyer: go, capsula: dz })
    },

    // --- Paso 43: Cápsula con solución → Baño prendido ---
    {
        pasos: [43],
        arrastrado: TX.CAPSULA_SOLUCION,
        destinos: [TX.BANIO_PRENDIDO, TX.BANIO],
        margen: 250,
        accion: 'COLOCAR_CAPSULA_BANIO',
        datos: (go, dz) => ({ capsula: go, banio: dz })
    },
    {
        pasos: [43],
        arrastrado: TX.CAPSULA,
        destinos: [TX.BANIO_PRENDIDO, TX.BANIO],
        margen: 250,
        accion: 'COLOCAR_CAPSULA_BANIO',
        datos: (go, dz) => ({ capsula: go, banio: dz })
    },
    {
        pasos: [43],
        arrastrado: TX.VASO_CON_SUSTANCIA,
        destinos: [TX.BANIO_PRENDIDO, TX.BANIO],
        margen: 250,
        accion: 'COLOCAR_CAPSULA_BANIO',
        datos: (go, dz) => ({ capsula: go, banio: dz })
    },

    // --- Paso 46: Cápsula → Estufa ---
    {
        pasos: [46],
        arrastrado: TX.CAPSULA,
        destinos: [TX.ESTUFA_CAPSULA, TX.ESTUFA],
        margen: 250,
        accion: 'COLOCAR_CAPSULA_ESTUFA',
        datos: (go, dz) => ({ capsula: go, estufa: dz })
    },
    {
        pasos: [46],
        arrastrado: TX.CAPSULA_SOLUCION,
        destinos: [TX.ESTUFA_CAPSULA, TX.ESTUFA],
        margen: 250,
        accion: 'COLOCAR_CAPSULA_ESTUFA',
        datos: (go, dz) => ({ capsula: go, estufa: dz })
    },

    // --- Paso 50: Cápsula → Desecador ---
    {
        pasos: [50],
        arrastrado: TX.CAPSULA,
        destinos: [TX.DESECADOR_CRISOL, TX.DESECADOR],
        margen: 260,
        accion: 'LLEVAR_CAPSULA_DESECADOR',
        datos: (go, dz) => ({ capsula: go, desecador: dz })
    },
];
