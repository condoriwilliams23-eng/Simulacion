// ==========================================
// ARCHIVO: js/stepHandlers/steps31to40.js
// Propósito: Efectos visuales y de estado para los pasos 31 al 40
//            (Calcinación, desecador, cápsula, trasvasado filtrado)
// ==========================================

function handleSteps31to40(idPaso, datos, sm) {
    switch (idPaso) {

        case 31: // Tomar pinzas — sin efecto visual adicional
            break;

        case 32: // Calcinar arena (con video — Diapositiva 6)
            if (datos.calentamiento) {
                sm.mostrarVideoModal('Calcinación de Papel y Muestra', 4000, () => {
                    if (datos.calentamiento) {
                        datos.calentamiento.encendido = false;
                        datos.calentamiento.estadoCalentamiento = 4;
                        if (datos.calentamiento.crisolVinculado) {
                            datos.calentamiento.crisolVinculado.conArenaSeca = true;
                        }
                    }
                    sm.avanzarPaso();
                });
                sm.pasoActual--;
            }
            break;

        case 33: // Guardar equipo de calentamiento
            if (datos.calentamiento) {
                const crisol = datos.calentamiento.crisolVinculado || sm.scene.children.list.find(o => o.texture && o.texture.key === TX.CRISOL);
                if (crisol) {
                    crisol.setVisible(true);
                    crisol.x = datos.calentamiento.x;
                    crisol.y = datos.calentamiento.y + 50;
                    crisol.input.draggable = true;
                    crisol.setTexture(TX.CRISOL_PINZAS);
                }
                datos.calentamiento.destroy();
            }
            break;

        case 34: // Seleccionar desecador — solo spawn, sin efectos
            break;

        case 35: // Trasladar crisol a desecador con pinzas (con video — Diapositiva 7)
            {
                const desecador = datos.desecador || sm.scene.children.list.find(o => o.texture && o.texture.key === TX.DESECADOR);
                const crisol = datos.crisol || sm.scene.children.list.find(o => o.texture && (o.texture.key === TX.CRISOL || o.texture.key === TX.CRISOL_PINZAS));
                if (desecador && crisol) {
                    sm.mostrarVideoModal('Traslado de Crisol con Pinzas a Desecador', 2500, () => {
                        desecador.setTexture(TX.DESECADOR_CRISOL);
                        desecador.tieneCrisol = true;
                        crisol.destroy();
                        sm.avanzarPaso();
                    });
                    sm.pasoActual--;
                } else {
                    console.error("[steps31to40.js] Paso 35: No se encontró desecador o crisol en escena.");
                }
            }
            break;

        case 36: // Guardar pinzas
            if (datos.pinza) datos.pinza.destroy();
            break;

        case 37: // Prender balanza para pesaje de cápsula
            if (datos.balanza) datos.balanza.encender();
            break;

        case 38: // Pesar cápsula vacía (55.5 g — Diapositiva 8)
            if (datos.balanza) {
                datos.balanza.setEstado('PESANDO');
                datos.balanza.actualizarPeso(55.5);
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 39: // Apagar balanza
            if (datos.balanza) datos.balanza.apagar();
            break;

        case 40: // Trasvasar filtrado del Erlenmeyer a la cápsula
            if (datos.capsula && datos.erlenmeyer) {
                datos.capsula.setTexture(TX.VASO_CON_SUSTANCIA);
                datos.capsula.tieneSolucion = true;
                datos.erlenmeyer.setTexture(TX.ERLENMEYER);
            }
            break;
    }
}
