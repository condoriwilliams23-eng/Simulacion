// ==========================================
// ARCHIVO: js/stepHandlers/steps01to10.js
// Propósito: Efectos visuales y de estado para los pasos 1 al 10
//            (Balanza, pesaje inicial, mezcla, probeta)
// ==========================================

function handleSteps01to10(idPaso, datos, sm) {
    switch (idPaso) {

        case 1: // Encender balanza
            if (datos.balanza) datos.balanza.encender();
            break;

        case 2: // Colocar vaso y tarar
            if (datos.subAccion === 'TARAR') {
                if (datos.balanza) {
                    datos.balanza.setEstado('TARADA');
                    datos.balanza.actualizarPeso(0.0, true);
                }
            } else {
                if (datos.vaso && datos.balanza) {
                    datos.vaso.bloquearEnBalanza(datos.balanza);
                    datos.balanza.setEstado('PESANDO');
                    datos.balanza.actualizarPeso(90.0);
                    sm.pasoActual--; // Esperar al botón TARA
                }
            }
            break;

        case 3: // Solo spawn del recipiente de mezcla — sin efectos adicionales
            break;

        case 4: // Trasvasar mezcla 5 g (con sub-acciones CARGAR / VERTIR)
            if (datos.subAccion === 'CARGAR') {
                if (datos.espatula) {
                    datos.espatula.cargar();
                    sm.pasoActual--; // Esperar la sub-acción VERTIR
                }
            } else if (datos.subAccion === 'VERTIR') {
                if (datos.espatula && datos.vasoBalanza) {
                    datos.espatula.vaciar();
                    datos.vasoBalanza.llenarConSustancia();
                    const balanza = datos.vasoBalanza.balanzaVinculada;
                    if (balanza) balanza.actualizarPeso(5.0);
                }
            }
            break;

        case 5: // Registrar masa de la mezcla en tabla lateral
            sm.registrarMasa('masa-mezcla', '5.0');
            break;

        case 6: // Apagar balanza
            if (datos.balanza) datos.balanza.apagar();
            // Desbloquear el vaso de la balanza automáticamente para que sea arrastrable en los pasos siguientes
            if (sm.scene) {
                const vasoObj = sm.scene.children.list.find(o => o instanceof Vaso);
                if (vasoObj && vasoObj.bloqueado) {
                    vasoObj.desbloquearDeBalanza();
                }
            }
            break;

        case 7: // Guardar recipiente y lavar espátula
            if (sm.scene.mezclaContainer) sm.scene.mezclaContainer.destroy();
            if (sm.scene.espatulaActiva) sm.scene.espatulaActiva.destroy();
            break;

        case 8: // Llenar probeta 40 mL con piseta (con zoom)
            if (datos.subAccion === 'LLENAR') {
                if (datos.probeta) {
                    datos.probeta.setTexture(TX.PROBETA_40ML);
                    datos.probeta.input.dropZone = false; // Evitar auto-detección como destino en paso 9
                    sm.mostrarZoomImagen(TX.ZOOM_40ML);
                    sm.pasoActual--; // Avanzar sólo al cerrar zoom
                }
            }
            break;

        case 9: // Verter agua destilada en vaso con CuSO4
            if (datos.vaso && datos.probeta) {
                datos.vaso.llenarConAgua();
                datos.probeta.setTexture(TX.PROBETA);
            }
            break;

        case 10: // Lavar y guardar probeta
            if (datos.probeta) datos.probeta.destroy();
            break;
    }
}
