// ==========================================
// ARCHIVO: js/data/dropRules.js
// Propósito: Tabla declarativa de reglas para el evento 'drop' de Phaser.
//            Reemplaza la cadena de 27+ else-if en DragManager.
//            Cada regla define cuándo aplica y qué acción ejecutar.
// ==========================================

// Tipo de regla:
// {
//   pasos:       number[]    — pasos en los que aplica esta regla
//   arrastrado:  string      — textura del objeto arrastrado
//   destinos:    string[]    — texturas del dropZone válidos
//   accion:      string      — nombre de la acción para StepManager.validarAccion()
//   datos:       (go, dz, scene) => object   — datos a pasar a validarAccion
//   post?:       (go, target, scene) => void — efecto visual después de un drop exitoso
// }

window.DROP_RULES = [

    // --- Paso 2: Vaso → Balanza ---
    {
        pasos: [2],
        arrastrado: TX.VASO_VACIO,
        destinos: [TX.BALANZA],
        accion: 'COLOCAR_Y_TARAR_VASO',
        datos: (go, dz) => ({ balanza: dz, vaso: go })
    },

    // --- Paso 4a: Espátula vacía → Recipiente de mezcla ---
    {
        pasos: [4],
        arrastrado: TX.ESPATULA,
        destinos: [TX.VASO_CON_MEZCLA],
        accion: 'TRASVASAR_MEZCLA',
        datos: (go, dz) => ({ espatula: go, subAccion: 'CARGAR' }),
        post: (go, dz) => { go.x = dz.x; go.y = dz.y - 30; }
    },

    // --- Paso 4b: Espátula llena → Vaso en balanza (o balanza como fallback) ---
    {
        pasos: [4],
        arrastrado: TX.ESPATULA_LLENA,
        destinos: [TX.VASO_VACIO, TX.BALANZA],  // El vaso aún está vacío en este punto
        accion: 'TRASVASAR_MEZCLA',
        datos: (go, dz, scene) => {
            // Si soltó sobre la balanza, buscar el vaso automáticamente
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_VACIO)
                : dz;
            return vaso ? { espatula: go, vasoBalanza: vaso, subAccion: 'VERTIR' } : null;
        },
        post: (go, dz, scene, exito) => {
            if (!exito) return;
            const vaso = scene.children.list.find(o => o.texture && (o.texture.key === TX.VASO_CON_SUSTANCIA || o.texture.key === TX.VASO_VACIO));
            if (vaso) {
                go.x = vaso.x + 30;
                go.y = vaso.y - 20;
                scene.time.delayedCall(1200, () => {
                    scene.tweens.add({ targets: go, x: scene.scale.width * 0.45, y: scene.scale.height * 0.60, duration: 500, ease: 'Power2' });
                });
            }
        }
    },

    // --- Paso 8: Piseta → Probeta ---
    {
        pasos: [8],
        arrastrado: TX.PISETA,
        destinos: [TX.PROBETA],
        accion: 'LLENAR_PROBETA_40ML',
        datos: (go, dz) => ({ piseta: go, probeta: dz, subAccion: 'LLENAR' }),
        post: (go, dz) => { go.x = dz.x + 30; go.y = dz.y - 40; }
    },

    // --- Paso 9: Probeta → Vaso con mezcla (o balanza como fallback) ---
    {
        pasos: [9],
        arrastrado: TX.PROBETA_40ML,
        destinos: [TX.VASO_CON_SUSTANCIA, TX.BALANZA],
        accion: 'VERTER_AGUA_VASO',
        datos: (go, dz, scene) => {
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_CON_SUSTANCIA)
                : dz;
            return vaso ? { probeta: go, vaso: vaso } : null;
        },
        post: (go, dz, scene, exito) => {
            if (!exito) return;
            const vaso = scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_CON_AGUA)
                      || dz;
            go.x = vaso.x; go.y = vaso.y - 60;
        }
    },

    // --- Paso 11: Varilla → Vaso con sal+agua (o balanza) ---
    {
        pasos: [11],
        arrastrado: TX.VARILLA,
        destinos: [TX.VASO_CON_AGUA, TX.BALANZA],
        accion: 'AGITAR_MEZCLA',
        datos: (go, dz, scene) => {
            const vaso = dz.texture.key === TX.BALANZA
                ? scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_CON_AGUA)
                : dz;
            return vaso ? { varilla: go, vaso: vaso } : null;
        },
        post: (go, dz, scene, exito) => {
            if (!exito) return;
            const vaso = scene.children.list.find(o => o.texture && o.texture.key === TX.VASO_AGITADO)
                      || dz;
            go.x = vaso.x + 20; go.y = vaso.y - 40;
        }
    },

    // --- Paso 12: Aro → Soporte Universal ---
    {
        pasos: [12],
        arrastrado: TX.SOPORTE_ARO_PIEZA,
        destinos: [TX.SOPORTE_ICONO],
        accion: 'ARMAR_SOPORTE_EMBUDO',
        datos: (go, dz) => ({ aro: go, soporte: dz })
    },

    // --- Paso 13: Erlenmeyer → Soporte con Aro ---
    {
        pasos: [13],
        arrastrado: TX.ERLENMEYER,
        destinos: [TX.SOPORTE_ARO],
        accion: 'COLOCAR_ERLENMEYER',
        datos: (go, dz) => ({ erlenmeyer: go, soporte: dz })
    },

    // --- Paso 14: Papel de filtro → Embudo ---
    {
        pasos: [14],
        arrastrado: TX.FILTRO_ICONO,
        destinos: [TX.EMBUDO],
        accion: 'DOBLAR_FILTRO_Y_COLOCAR_EMBUDO',
        datos: (go, dz) => ({ filtro: go, embudo: dz })
    },

    // --- Paso 15: Piseta → Embudo ---
    {
        pasos: [15],
        arrastrado: TX.PISETA,
        destinos: [TX.EMBUDO],
        accion: 'ADHERIR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, embudo: dz })
    },

    // --- Paso 16a: Embudo → Soporte con Aro ---
    {
        pasos: [16],
        arrastrado: TX.EMBUDO,
        destinos: [TX.SOPORTE_ARO],
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, dz) => ({ embudo: go, soporte: dz, subAccion: 'EMBUDO' })
    },

    // --- Paso 16b: Varilla → Soporte con Filtro ---
    {
        pasos: [16],
        arrastrado: TX.VARILLA,
        destinos: [TX.SOPORTE_FILTRO],
        accion: 'COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE',
        datos: (go, dz) => ({ varilla: go, soporte: dz, subAccion: 'VARILLA' })
    },

    // --- Paso 17: Vaso con solución → Soporte con vigilante ---
    {
        pasos: [17],
        arrastrado: TX.VASO_AGITADO,
        destinos: [TX.SOPORTE_VIGILANTE, TX.SOPORTE_FILTRO, TX.SOPORTE_EMBUDO],
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz })
    },
    {
        pasos: [17],
        arrastrado: TX.VASO_CON_AGUA,
        destinos: [TX.SOPORTE_VIGILANTE, TX.SOPORTE_FILTRO, TX.SOPORTE_EMBUDO],
        accion: 'FILTRAR_SOLUCION',
        datos: (go, dz) => ({ vaso: go, soporte: dz })
    },

    // --- Paso 18: Piseta → Soporte filtrando (lavar varilla) ---
    {
        pasos: [18],
        arrastrado: TX.PISETA,
        destinos: [TX.SOPORTE_SOLUCION, TX.SOPORTE_FILTRANDO, TX.SOPORTE_ARENA_1],
        accion: 'LAVAR_VARILLA_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz })
    },

    // --- Paso 19: Piseta → Vaso con arena húmeda (trasvasar arena) ---
    {
        pasos: [19],
        arrastrado: TX.PISETA,
        destinos: [TX.VASO_ARENA_HUMEDA],
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
        destinos: [TX.SOPORTE_ARENA_2, TX.SOPORTE_ARENA_1, TX.SOPORTE_SOLUCION, TX.SOPORTE_FILTRANDO],
        accion: 'LAVAR_FILTRO_PISETA',
        datos: (go, dz) => ({ piseta: go, soporte: dz })
    },

    // --- Paso 26 y 52: Crisol → Balanza ---
    {
        pasos: [26, 52],
        arrastrado: TX.CRISOL,
        destinos: [TX.BALANZA],
        accion: null, // Se resuelve dinámicamente
        resolver: (paso) => paso === 26 ? 'PESAR_CRISOL_VACIO' : 'PESAR_CRISOL_ARENA',
        datos: (go, dz) => ({ crisol: go, balanza: dz }),
        post: (go, dz) => { go.x = dz.x; go.y = dz.y - 100; }
    },

    // --- Paso 28: Papel de filtro con arena → Crisol ---
    {
        pasos: [28],
        arrastrado: TX.FILTRO_ARENA,
        destinos: [TX.CRISOL],
        accion: 'COLOCAR_FILTRO_CRISOL',
        datos: (go, dz) => ({ filtro: go, crisol: dz })
    },

    // --- Paso 29a: Triángulo → Trípode ---
    {
        pasos: [29],
        arrastrado: TX.TRIANGULO,
        destinos: [TX.TRIPODE],
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, dz) => ({ triangulo: go, calentamiento: dz, subAccion: 'TRIANGULO' })
    },

    // --- Paso 29b: Crisol → Trípode con triángulo ---
    {
        pasos: [29],
        arrastrado: TX.CRISOL,
        destinos: [TX.TRIPODE_TRIANGULO],
        accion: 'MONTAR_TRIPODE_TRIANGULO_CRISOL',
        datos: (go, dz) => ({ crisol: go, calentamiento: dz, subAccion: 'CRISOL' })
    },

    // --- Paso 30: Mechero → Calentamiento completo ---
    {
        pasos: [30],
        arrastrado: TX.MECHERO,
        destinos: [TX.TRIPODE_COMPLETO],
        accion: 'SPAWN_MECHERO',
        datos: (go, dz) => ({ mechero: go, calentamiento: dz })
    },

    // --- Paso 35: Crisol → Desecador ---
    {
        pasos: [35],
        arrastrado: TX.CRISOL,
        destinos: [TX.DESECADOR],
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, dz) => ({ crisol: go, desecador: dz })
    },
    {
        pasos: [35],
        arrastrado: TX.CRISOL_PINZAS,
        destinos: [TX.DESECADOR],
        accion: 'LLEVAR_CRISOL_DESECADOR',
        datos: (go, dz) => ({ crisol: go, desecador: dz })
    },

    // --- Paso 38 y 56: Cápsula → Balanza ---
    {
        pasos: [38, 56],
        arrastrado: TX.CAPSULA,
        destinos: [TX.BALANZA],
        accion: null,
        resolver: (paso) => paso === 38 ? 'PESAR_CAPSULA_VACIA' : 'PESAR_CAPSULA_SAL',
        datos: (go, dz) => ({ capsula: go, balanza: dz }),
        post: (go, dz) => { go.x = dz.x; go.y = dz.y - 100; }
    },

    // --- Paso 40: Erlenmeyer con solución → Cápsula ---
    {
        pasos: [40],
        arrastrado: TX.ERLENMEYER_SOL4,
        destinos: [TX.CAPSULA],
        accion: 'TRASVASAR_FILTRADO_CAPSULA',
        datos: (go, dz) => ({ erlenmeyer: go, capsula: dz })
    },

    // --- Paso 43: Cápsula con solución → Baño prendido ---
    {
        pasos: [43],
        arrastrado: TX.VASO_CON_SUSTANCIA,
        destinos: [TX.BANIO_PRENDIDO],
        accion: 'COLOCAR_CAPSULA_BANIO',
        datos: (go, dz) => ({ capsula: go, banio: dz })
    },

    // --- Paso 46: Cápsula → Estufa ---
    {
        pasos: [46],
        arrastrado: TX.CAPSULA,
        destinos: [TX.ESTUFA],
        accion: 'COLOCAR_CAPSULA_ESTUFA',
        datos: (go, dz) => ({ capsula: go, estufa: dz })
    },

    // --- Paso 50: Cápsula → Desecador con crisol ---
    {
        pasos: [50],
        arrastrado: TX.CAPSULA,
        destinos: [TX.DESECADOR_CRISOL],
        accion: 'LLEVAR_CAPSULA_DESECADOR',
        datos: (go, dz) => ({ capsula: go, desecador: dz })
    },
];
