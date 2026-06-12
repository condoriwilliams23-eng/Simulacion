// ==========================================
// ARCHIVO: js/data/steps.js
// Propósito: Definir la secuencia completa de los 59 pasos del TP
// ==========================================

window.STEPS = [
    {
        id: 1,
        title: "Preparar balanza",
        description: "1. Preparar la balanza (clickear la imagen) y encenderla (clickear en el botón On/Off).",
        actionExpected: "ENCENDER_BALANZA_1"
    },
    {
        id: 2,
        title: "Colocar vaso y tarar",
        description: "2. Usar un vaso de precipitados (clickear la imagen) y colocarlo sobre la balanza (arrastrar con el cursor). Luego, llevar a “cero” (clickear en el botón Tara).",
        actionExpected: "COLOCAR_Y_TARAR_VASO"
    },
    {
        id: 3,
        title: "Mezcla próxima",
        description: "3. Seleccionar el recipiente con la mezcla de arena-sal (clickear en la imagen) y colocarlo próximo a la balanza.",
        actionExpected: "SPAWN_MEZCLA_CONTAINER"
    },
    {
        id: 4,
        title: "Trasvasar mezcla",
        description: "4. Usar la espátula (clickear en la imagen) para trasvasar la mezcla (arena-sal) del recipiente al vaso de precipitados sobre la balanza. Colocar el extremo de la espátula en la boca de la mezcla para llevarla al vaso. Alcanzar 5 g.",
        actionExpected: "TRASVASAR_MEZCLA"
    },
    {
        id: 5,
        title: "Registrar masa",
        description: "5. Registrar el valor correspondiente de la masa de la mezcla en la tabla lateral (hacer clic en la casilla correspondiente de la tabla).",
        actionExpected: "REGISTRAR_MASA_MEZCLA"
    },
    {
        id: 6,
        title: "Apagar balanza",
        description: "6. Apagar la balanza (clickear en botón On/Off).",
        actionExpected: "APAGAR_BALANZA_1"
    },
    {
        id: 7,
        title: "Limpieza",
        description: "7. Guardar el recipiente de la mezcla (arrastrar a Guardar) y llevar la espátula a lavar (arrastrar a Lavar).",
        actionExpected: "GUARDAR_MEZCLA_Y_LAVAR_ESPATULA"
    },
    {
        id: 8,
        title: "Llenar probeta",
        description: "8. Tomar probeta y piseta (clickearlas). Arrastrar piseta a probeta para llenar 40 mL de agua (cerrar zoom con la X).",
        actionExpected: "LLENAR_PROBETA_40ML"
    },
    {
        id: 9,
        title: "Verter agua",
        description: "9. Verter el agua de la probeta al vaso de precipitados (arrastrar con el cursor).",
        actionExpected: "VERTER_AGUA_VASO"
    },
    {
        id: 10,
        title: "Lavar probeta",
        description: "10. Lavar la probeta (arrastrar con el cursor hacia Lavar).",
        actionExpected: "LAVAR_PROBETA"
    },
    {
        id: 11,
        title: "Disolver sal",
        description: "11. Tomar varilla de vidrio (clickear imagen) y agitar el vaso suavemente para disolver la sal CuSO4 (tornará azulado).",
        actionExpected: "AGITAR_MEZCLA"
    },
    {
        id: 12,
        title: "Armar soporte",
        description: "12. Tomar Soporte Universal y aro de embudo. Colocar el aro sobre el soporte universal (arrastrar para encajar).",
        actionExpected: "ARMAR_SOPORTE_EMBUDO"
    },
    {
        id: 13,
        title: "Colocar Erlenmeyer",
        description: "13. Usar erlenmeyer (clickear imagen) y colocarlo en la base del soporte universal (arrastrar con el cursor).",
        actionExpected: "COLOCAR_ERLENMEYER"
    },
    {
        id: 14,
        title: "Preparar embudo",
        description: "14. Tomar papel filtro y embudo. Doblar el filtro y colocarlo dentro del embudo (arrastrar filtro al embudo).",
        actionExpected: "DOBLAR_FILTRO_Y_COLOCAR_EMBUDO"
    },
    {
        id: 15,
        title: "Adherir filtro",
        description: "15. Usar la piseta para adherir el papel de filtro al embudo (arrastrar la piseta al embudo).",
        actionExpected: "ADHERIR_FILTRO_PISETA"
    },
    {
        id: 16,
        title: "Montar embudo",
        description: "16. Colocar el embudo en su soporte (arrastrar). Tomar y colocar el vigilante/varilla sobre el embudo (arrastrar).",
        actionExpected: "COLOCAR_EMBUDO_SOPORTE_Y_VIGILANTE"
    },
    {
        id: 17,
        title: "Filtrar",
        description: "17. Trasvasar la solución del vaso al embudo apoyándolo sobre el vigilante (arrastrar el vaso al embudo).",
        actionExpected: "FILTRAR_SOLUCION"
    },
    {
        id: 18,
        title: "Lavar varilla",
        description: "18. Tomar la piseta y, con pequeñas porciones de agua, lavar la varilla de vidrio (arrastrar la piseta a la varilla).",
        actionExpected: "LAVAR_VARILLA_PISETA"
    },
    {
        id: 19,
        title: "Trasvasar arena",
        description: "19. Usar piseta para trasvasar toda la arena del vaso al filtro, realizando lavados (arrastrar piseta al vaso).",
        actionExpected: "TRASVASAR_ARENA_PISETA"
    },
    {
        id: 20,
        title: "Lavar filtro",
        description: "20. Lavar con agua de la piseta el papel de filtro y dejar filtrar.",
        actionExpected: "LAVAR_FILTRO_PISETA"
    },
    {
        id: 21,
        title: "Limpieza filtro",
        description: "21. Llevar vaso y varilla a Lavar, y guardar la piseta (arrastrar a Guardar).",
        actionExpected: "LAVAR_VASO_VARILLA_GUARDAR_PISETA"
    },
    {
        id: 22,
        title: "Quitar filtro",
        description: "22. Quitar el papel de filtro (clickearlo para sacarlo a la mesa) y lavar el embudo (arrastrar a Lavar).",
        actionExpected: "QUITAR_FILTRO_Y_LAVAR_EMBUDO"
    },
    {
        id: 23,
        title: "Quitar Erlenmeyer",
        description: "23. Quitar el erlenmeyer de la base del soporte universal (clickear sobre el erlenmeyer).",
        actionExpected: "RETIRAR_ERLENMEYER"
    },
    {
        id: 24,
        title: "Guardar soporte",
        description: "24. Desarmar soporte universal y guardarlo (arrastrar hacia Guardar).",
        actionExpected: "GUARDAR_SOPORTE"
    },
    {
        id: 25,
        title: "Prender balanza",
        description: "25. Encender nuevamente la balanza analítica (clickear en botón On/Off).",
        actionExpected: "ENCENDER_BALANZA_2"
    },
    {
        id: 26,
        title: "Pesar crisol",
        description: "26. Tomar crisol (clickear), pesar (arrastrar a balanza) y registrar el valor en la tabla (hacer clic en la casilla correspondiente).",
        actionExpected: "PESAR_CRISOL_VACIO"
    },
    {
        id: 27,
        title: "Apagar balanza",
        description: "27. Apagamos la balanza (clickear en botón On/Off).",
        actionExpected: "APAGAR_BALANZA_2"
    },
    {
        id: 28,
        title: "Arena en crisol",
        description: "28. Colocar el papel de filtro con la arena dentro del crisol (arrastrar y colocar, luego cerrar zoom con la X).",
        actionExpected: "COLOCAR_FILTRO_CRISOL"
    },
    {
        id: 29,
        title: "Montar trípode",
        description: "29. Tomar trípode y triángulo. Poner triángulo en trípode, y encima colocar el crisol (arrastrar con cursor).",
        actionExpected: "MONTAR_TRIPODE_TRIANGULO_CRISOL"
    },
    {
        id: 30,
        title: "Montar mechero",
        description: "30. Montar el mechero bunsen (clickear sobre la imagen).",
        actionExpected: "SPAWN_MECHERO"
    },
    {
        id: 31,
        title: "Tomar pinzas",
        description: "31. Seleccionar la pinza metálica (clickear sobre la imagen).",
        actionExpected: "SPAWN_PINZAS"
    },
    {
        id: 32,
        title: "Calcinar",
        description: "32. Encender mechero (clickearlo). Tras calcinar, verificar con pinzas que no haya cenizas, y apagar el mechero.",
        actionExpected: "CALCINAR_ARENA"
    },
    {
        id: 33,
        title: "Guardar calentamiento",
        description: "33. Se guardan trípode, triángulo y mechero (arrastrar con el cursor hacia Guardar).",
        actionExpected: "GUARDAR_ELEMENTOS_CALCINACION"
    },
    {
        id: 34,
        title: "Tomar desecador",
        description: "34. Utilizar el desecador de silica gel (clickear sobre la imagen).",
        actionExpected: "SPAWN_DESECADOR"
    },
    {
        id: 35,
        title: "Crisol a desecador",
        description: "35. Con ayuda de la pinza metálica, llevar el crisol caliente al desecador (arrastrar crisol al desecador). Esperar 20 min.",
        actionExpected: "LLEVAR_CRISOL_DESECADOR"
    },
    {
        id: 36,
        title: "Guardar pinzas",
        description: "36. Guardar la pinza metálica (arrastrar hacia Guardar).",
        actionExpected: "GUARDAR_PINZAS"
    },
    {
        id: 37,
        title: "Prender balanza",
        description: "37. Encender nuevamente la balanza analítica (clickear en botón On/Off).",
        actionExpected: "ENCENDER_BALANZA_3"
    },
    {
        id: 38,
        title: "Pesar cápsula",
        description: "38. Tomar cápsula (clickear), pesarla en la balanza y registrar el valor en la tabla (hacer clic en la casilla correspondiente).",
        actionExpected: "PESAR_CAPSULA_VACIA"
    },
    {
        id: 39,
        title: "Apagar balanza",
        description: "39. Apagar la balanza (clickear en botón On/Off).",
        actionExpected: "APAGAR_BALANZA_3"
    },
    {
        id: 40,
        title: "Trasvasar solución",
        description: "40. Trasvasar la solución filtrada del erlenmeyer a la cápsula de porcelana (arrastrar erlenmeyer a cápsula).",
        actionExpected: "TRASVASAR_FILTRADO_CAPSULA"
    },
    {
        id: 41,
        title: "Lavar Erlenmeyer",
        description: "41. Llevar a lavar el erlenmeyer (arrastrar a Lavar).",
        actionExpected: "LAVAR_ERLENMEYER"
    },
    {
        id: 42,
        title: "Prender baño",
        description: "42. Seleccionar el baño termostático (clickear) y prenderlo (clickear en el botón On/Off).",
        actionExpected: "ENCENDER_BANIO"
    },
    {
        id: 43,
        title: "Cápsula al baño",
        description: "43. Llevar la cápsula con la solución y colocarla sobre el baño termostático para evaporar (arrastrar cápsula al baño).",
        actionExpected: "COLOCAR_CAPSULA_BANIO"
    },
    {
        id: 44,
        title: "Cerrar zoom baño",
        description: "44. Hacer click sobre la equis (X) para cerrar la imagen ampliada del baño.",
        actionExpected: "CERRAR_ZOOM_BANIO"
    },
    {
        id: 45,
        title: "Prender estufa",
        description: "45. Seleccionar la estufa (clickear) y prenderla (clickear en el botón On).",
        actionExpected: "ENCENDER_ESTUFA"
    },
    {
        id: 46,
        title: "Cápsula a estufa",
        description: "46. Llevar la cápsula a la estufa para secado final (arrastrar la cápsula a la estufa).",
        actionExpected: "COLOCAR_CAPSULA_ESTUFA"
    },
    {
        id: 47,
        title: "Cerrar zoom estufa",
        description: "47. Hacer click sobre la equis (X) para cerrar la imagen de la cápsula dentro de la estufa.",
        actionExpected: "CERRAR_ZOOM_ESTUFA"
    },
    {
        id: 48,
        title: "Guardar baño",
        description: "48. Apagar el baño termostático (clickear Off) y guardarlo (arrastrar a Guardar).",
        actionExpected: "APAGAR_Y_GUARDAR_BANIO"
    },
    {
        id: 49,
        title: "Guardar estufa",
        description: "49. Apagar la estufa (clickear Off) y guardarla (arrastrar a Guardar).",
        actionExpected: "APAGAR_Y_GUARDAR_ESTUFA"
    },
    {
        id: 50,
        title: "Cápsula a desecador",
        description: "50. Llevar la cápsula al desecador para enfriar (arrastrar cápsula al desecador).",
        actionExpected: "LLEVAR_CAPSULA_DESECADOR"
    },
    {
        id: 51,
        title: "Retirar crisol",
        description: "51. Encender balanza (On/Off). Retirar el crisol seco del desecador (clickear en el crisol para llevarlo a la mesa).",
        actionExpected: "RETIRAR_CRISOL_DESECADOR"
    },
    {
        id: 52,
        title: "Pesar crisol+arena",
        description: "52. Pesar crisol con arena (arrastrar a balanza) y registrar el valor en la tabla (hacer clic en la casilla correspondiente).",
        actionExpected: "PESAR_CRISOL_ARENA"
    },
    {
        id: 53,
        title: "Apagar balanza",
        description: "53. Apagamos la balanza (clickear en botón On/Off).",
        actionExpected: "APAGAR_BALANZA_4"
    },
    {
        id: 54,
        title: "Lavar crisol",
        description: "54. Llevar a lavar el crisol, eliminando previamente la arena (arrastrar crisol a Lavar).",
        actionExpected: "LAVAR_CRISOL_FINAL"
    },
    {
        id: 55,
        title: "Retirar cápsula",
        description: "55. Prender balanza (On/Off). Retirar la cápsula del desecador (clickear sobre la cápsula para llevarla a la mesa).",
        actionExpected: "RETIRAR_CAPSULA_DESECADOR"
    },
    {
        id: 56,
        title: "Pesar cápsula+sal",
        description: "56. Pesar cápsula con sal (arrastrar a balanza) y registrar el valor en la tabla (hacer clic en la casilla correspondiente).",
        actionExpected: "PESAR_CAPSULA_SAL"
    },
    {
        id: 57,
        title: "Apagar balanza",
        description: "57. Apagar la balanza (clickear en botón On/Off).",
        actionExpected: "APAGAR_BALANZA_5"
    },
    {
        id: 58,
        title: "Guardar equipos",
        description: "58. Guardar la balanza y el desecador (arrastrarlos hacia Guardar).",
        actionExpected: "GUARDAR_BALANZA_DESECADOR"
    },
    {
        id: 59,
        title: "Lavar cápsula",
        description: "59. Llevar a lavar la cápsula (arrastrar hacia Lavar). ¡Felicidades! Completaste la parte práctica del TP.",
        actionExpected: "LAVAR_CAPSULA_FINAL"
    }
];