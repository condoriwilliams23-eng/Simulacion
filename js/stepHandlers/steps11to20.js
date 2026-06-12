// ==========================================
// ARCHIVO: js/stepHandlers/steps11to20.js
// Propósito: Efectos visuales y de estado para los pasos 11 al 20
//            (Agitación, soporte de filtración, embudo, filtrado, limpieza)
// ==========================================

function handleSteps11to20(idPaso, datos, sm) {
    switch (idPaso) {

        case 11: // Agitar con varilla de vidrio
            if (datos.vaso && datos.varilla) {
                datos.varilla.input.draggable = false;
                sm.scene.children.bringToTop(datos.varilla);
                datos.varilla.setVisible(true);

                // Posición inicial del vaso
                const vasoX = datos.vaso.x;
                const vasoY = datos.vaso.y;

                // Animación de agitación (movimiento elíptico / circular y rotación)
                const tweenX = sm.scene.tweens.add({
                    targets: datos.varilla,
                    x: { from: vasoX - 12, to: vasoX + 12 },
                    y: { from: vasoY - 60, to: vasoY - 40 },
                    duration: 300,
                    yoyo: true,
                    repeat: 5,
                    ease: 'Sine.easeInOut'
                });

                const tweenAngle = sm.scene.tweens.add({
                    targets: datos.varilla,
                    angle: { from: -12, to: 12 },
                    duration: 150,
                    yoyo: true,
                    repeat: 11,
                    ease: 'Sine.easeInOut'
                });

                datos.vaso.agitar(() => {
                    // Retornar la varilla a su posición original en la mesa
                    if (datos.varilla.posicionOriginalX !== undefined) {
                        datos.varilla.x = datos.varilla.posicionOriginalX;
                        datos.varilla.y = datos.varilla.posicionOriginalY;
                    } else {
                        datos.varilla.x = vasoX;
                        datos.varilla.y = vasoY - 100;
                    }
                    datos.varilla.angle = 0;
                    datos.varilla.setVisible(true);
                    datos.varilla.input.draggable = true;
                    sm.avanzarPaso();
                });
                sm.pasoActual--; // Prevenir salto doble; avanza en el callback
            }
            break;

        case 12: // Armar soporte (colocar aro)
            if (datos.soporte) {
                datos.soporte.agregarAro();
                if (datos.aro) datos.aro.destroy();
            }
            break;

        case 13: // Colocar Erlenmeyer en soporte
            if (datos.soporte && datos.erlenmeyer) {
                datos.soporte.colocarErlenmeyer(datos.erlenmeyer);
            }
            break;

        case 14: // Doblar filtro y colocarlo dentro del embudo suelto
            if (datos.embudo) {
                if (datos.filtro) datos.filtro.input.draggable = false;
                sm.mostrarVideoModal('Doblado y Ajuste del Papel de Filtro', 3000, () => {
                    if (datos.filtro) datos.filtro.destroy();
                    sm.avanzarPaso();
                });
                sm.pasoActual--; // Prevenir avance automático
            }
            break;

        case 15: // Adherir filtro con piseta
            if (datos.embudo) {
                sm.mostrarVideoModal('Adherido de Papel Filtro con Piseta', 2500, () => {
                    sm.avanzarPaso();
                });
                sm.pasoActual--;
            }
            break;

        case 16: // Colocar embudo en soporte y luego colocar varilla
            if (datos.soporte) {
                if (datos.subAccion === 'EMBUDO') {
                    datos.soporte.agregarFiltro();
                    if (datos.embudo) datos.embudo.destroy();
                    sm.pasoActual--; // Esperar a colocar la varilla
                } else {
                    datos.soporte.agregarVigilante();
                    if (datos.varilla) datos.varilla.destroy();
                }
            }
            break;

        case 17: // Filtrar solución (con video)
            {
                const soporte = datos.soporte || sm.scene.children.list.find(o => o instanceof SoporteFiltracion);
                const vaso = datos.vaso || sm.scene.children.list.find(o => o instanceof Vaso);
                if (soporte && vaso) {
                    vaso.input.draggable = false;
                    sm.mostrarVideoModal('Trasvaso y Filtración de la Solución', 3000, () => {
                        vaso.input.draggable = true;
                        soporte.comenzarFiltrado();
                        vaso.vaciarSolucion();
                        sm.avanzarPaso();
                    });
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 17: No se encontró soporte o vaso en escena.");
                }
            }
            break;

        case 18: // Lavar varilla con piseta (con video)
            if (datos.soporte) {
                sm.mostrarVideoModal('Lavado e Higienizado del Vigilante', 2500, () => {
                    datos.soporte.lavarVarilla();
                    sm.avanzarPaso();
                });
                sm.pasoActual--;
            }
            break;

        case 19: // Trasvasar arena con piseta (con video)
            {
                const soporte = datos.soporte || sm.scene.children.list.find(o => o instanceof SoporteFiltracion);
                const vaso = datos.vaso || sm.scene.children.list.find(o => o instanceof Vaso);
                if (soporte && vaso) {
                    sm.mostrarVideoModal('Trasvase y Lavado Final de la Arena', 3000, () => {
                        soporte.trasvasarArena();
                        vaso.vaciarArena();
                        sm.avanzarPaso();
                    });
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 19: No se encontró soporte o vaso en escena.");
                }
            }
            break;

        case 20: // Lavar filtro con piseta
            {
                const soporte = datos.soporte || sm.scene.children.list.find(o => o instanceof SoporteFiltracion);
                if (soporte) {
                    soporte.lavarFiltroFinal(() => {
                        sm.avanzarPaso();
                    });
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 20: No se encontró soporte en escena.");
                }
            }
            break;
    }
}
