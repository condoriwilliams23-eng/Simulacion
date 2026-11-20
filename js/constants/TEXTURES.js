// ==========================================
// ARCHIVO: js/constants/TEXTURES.js
// Propósito: Centralizar todas las claves de textura de Phaser como constantes.
//            Usar TX.XXX en lugar de strings sueltos para evitar typos.
// ==========================================

const TX = {
    // --- Balanza ---
    BALANZA: 'Balanza analítica',

    // --- Vasos ---
    VASO_VACIO:             'Vaso de precipitados 250 ml',
    VASO_CON_MEZCLA:        'Vaso con Mezcla',
    VASO_CON_SUSTANCIA:     'Vaso con sustancia',
    VASO_CON_AGUA:          'Vaso 250 con sal + agua',
    VASO_AGITADO:           'Vaso 250 agitado',
    VASO_SOLUCION_FINAL:    'Vaso + solucion final', // Erlenmeyer vertical con 100 mL de solución azul
    VASO_ARENA_HUMEDA:      'Vaso con arena humeda',
    VASO_ARENA_VIGILANTE:   'Vaso con arena humeda + vigilante',

    // --- Espátula ---
    ESPATULA:               'Espatula de metal',
    ESPATULA_LLENA:         'Espatula llena',

    // --- Probeta y Piseta ---
    PROBETA:                'probeta',
    PROBETA_40ML:           'probeta 40 mL',
    PROBETA_40ML_2:         'probeta 40 mL 2',
    PROBETA_40ML_3:         'probeta 40 mL 3',
    PROBETA_40ML_4:         'probeta 40 mL 4',
    ZOOM_40ML:              'zoom 40 ml',
    PISETA:                 'Piseta',

    // --- Varilla de vidrio ---
    VARILLA:                'Varilla de vidrio',

    // --- Erlenmeyer ---
    ERLENMEYER:             'Erlenmeyer',
    ERLENMEYER_SOL2:        'Erlenmeyer+ 100 ml solucion 2',
    ERLENMEYER_SOL3:        'Erlenmeyer+ 100 ml solucion 3',
    ERLENMEYER_SOL4:        'Erlenmeyer+ 100 ml solucion 4',

    // --- Soporte de filtración (estados exactos del ensamblaje) ---
    SOPORTE_ICONO:          'Soporte Universal (icono)',                                            // Soporte vacío (sin aro ni erlenmeyer)
    SOPORTE_ARO_PIEZA:      'Soporte para embudo',                                                  // Pieza del aro suelta
    SOPORTE_ARO:            'Soporte Universal + soporte embudo',                                   // Soporte + Aro (sin erlenmeyer)
    SOPORTE_ARO_ERLENMEYER: 'Soporte Universal + soporte embudo + erlenmeyer',                      // Soporte + Aro + Erlenmeyer vacío en base
    SOPORTE_EMBUDO:         'Soporte Universal + soporte embudo + embudo',                          // Soporte + Aro + Erlenmeyer + Embudo
    SOPORTE_FILTRO:         'Soporte Universal + soporte embudo + embudo + filtro',                 // Soporte + Aro + Erlenmeyer + Embudo con filtro
    SOPORTE_VIGILANTE:      'Soporte Universal + soporte embudo + embudo + filtro + vigilante',     // + Varilla vigilante
    SOPORTE_SOLUCION:       'Soporte Universal + soporte embudo + embudo + filtro + vigilante + solucion', // Paso 17: Filtrado líquido con vigilante
    SOPORTE_FILTRANDO:      'Soporte Universal + soporte embudo + embudo + filtro + solucion',      // Paso 18: Vigilante retirado, aún sin arena
    SOPORTE_ARENA_1:        'Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (1)', // Paso 19: Arena trasvasada al filtro
    SOPORTE_ARENA_2:        'Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (2)', // Paso 20: Filtro con arena lavado
    SOPORTE_FINAL:          'Soporte Universal + soporte embudo + embudo + filtro + solucion final (2)',    // Paso 22: Embudo y filtro retirados, queda Erlenmeyer con solución

    // --- Filtración (piezas en mesa) ---
    EMBUDO:                 'Embudo',
    EMBUDO_CON_FILTRO:      'Embudo + filtro',
    FILTRO_1:               'Papel de filtro 1',
    FILTRO_2:               'Papel de filtro 2',
    FILTRO_ICONO:           'Papel de filtro (icono)',
    FILTRO_ARENA:           'Papel de filtro + arena',

    // --- Calcinación ---
    CRISOL:                         'Crisol',
    CRISOL_FILTRO:                  'Crisol + filtro',
    CRISOL_PINZAS:                  'Crisol + pinzas',
    TRIPODE:                        'Tripode',
    TRIANGULO:                      'Triangulo refractario',
    MECHERO:                        'Mechero',
    PINZA:                          'Pinza metalica',
    TRIPODE_TRIANGULO:              'Tripode + triangulo',
    TRIPODE_TRIANGULO_CRISOL:       'Tripode + triangulo + crisol',
    TRIPODE_TRIANGULO_MECHERO:      'Tripode + triangulo + Mechero',
    TRIPODE_COMPLETO:               'Tripode + triangulo + Mechero + crisol',

    // --- Desecador ---
    DESECADOR:              'Desecador',
    DESECADOR_CRISOL:       'Desecador + Crisol',
    DESECADOR_CAPSULA:      'Desecador + Capsula',
    DESECADOR_AMBOS:        'Desecador + Crisol + Capsula',

    // --- Cápsula ---
    CAPSULA:                'Capsula',
    CAPSULA_SOLUCION:       'Capsula + solucion',

    // --- Evaporación y Secado ---
    BANIO:                  'Baño termostatico',
    BANIO_PRENDIDO:         'Baño termostatico prendido',
    BANIO_CAPSULA:          'Baño termostatico prendido + capsula',
    ESTUFA:                 'Estufa',
    ESTUFA_CAPSULA:         'Estufa + capsula',
    FOTO_BANIO_CAPSULAS:    'Foto capsulas',
    FOTO_ESTUFA_CAPSULA:    'Foto capsula+estufa',
};
