// ==========================================
// ARCHIVO: js/stepHandlers/steps51to59.js
// Propósito: Efectos visuales y de estado para los pasos 51 al 59
//            (Pesajes finales de crisol y cápsula, cálculos y cierre)
// ==========================================

function handleSteps51to59(idPaso, datos, sm) {
    switch (idPaso) {

        case 51: // Retirar crisol del desecador y encender balanza
            if (datos.balanza) datos.balanza.encender();
            if (datos.desecador) {
                datos.desecador.tieneCrisol = false;
                if (datos.desecador.tieneCapsula) {
                    datos.desecador.setTexture(TX.DESECADOR_CAPSULA);
                } else {
                    datos.desecador.setTexture(TX.DESECADOR);
                }
                // Crear el crisol con arena como objeto arrastrable
                sm.scene.crisolActivo = sm.scene.add.sprite(
                    sm.scene.scale.width * 0.4,
                    sm.scene.scale.height * 0.5,
                    TX.CRISOL
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                sm.scene.input.setDraggable(sm.scene.crisolActivo);
                sm.scene.crisolActivo.conArenaSeca = true;
            }
            break;

        case 52: // Pesar crisol con arena (37.3 g — Diapositiva 10)
            if (datos.balanza) {
                datos.balanza.setEstado('PESANDO');
                datos.balanza.actualizarPeso(37.3);
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 53: // Apagar balanza
            if (datos.balanza) datos.balanza.apagar();
            break;

        case 54: // Lavar y guardar crisol
            if (datos.crisol) datos.crisol.destroy();
            break;

        case 55: // Retirar cápsula del desecador y encender balanza
            if (datos.balanza) datos.balanza.encender();
            if (datos.desecador) {
                datos.desecador.tieneCapsula = false;
                if (datos.desecador.tieneCrisol) {
                    datos.desecador.setTexture(TX.DESECADOR_CRISOL);
                } else {
                    datos.desecador.setTexture(TX.DESECADOR);
                }
                // Crear la cápsula con sal como objeto arrastrable
                sm.scene.capsulaActiva = sm.scene.add.sprite(
                    sm.scene.scale.width * 0.4,
                    sm.scene.scale.height * 0.5,
                    TX.CAPSULA
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                sm.scene.input.setDraggable(sm.scene.capsulaActiva);
                sm.scene.capsulaActiva.conSalSeca = true;
            }
            break;

        case 56: // Pesar cápsula con sal (56.8 g — Diapositiva 10)
            if (datos.balanza) {
                datos.balanza.setEstado('PESANDO');
                datos.balanza.actualizarPeso(56.8);
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 57: // Apagar balanza
            if (datos.balanza) datos.balanza.apagar();
            break;

        case 58: // Guardar balanza y desecador
            if (datos.balanza) datos.balanza.destroy();
            if (datos.desecador) datos.desecador.destroy();
            break;

        case 59: // Lavar cápsula y activar panel de cálculos finales
            if (datos.capsula) datos.capsula.destroy();
            sm.activarPanelCalculos();
            break;
    }
}
