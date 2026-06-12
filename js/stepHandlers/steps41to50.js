// ==========================================
// ARCHIVO: js/stepHandlers/steps41to50.js
// Propósito: Efectos visuales y de estado para los pasos 41 al 50
//            (Lavar erlenmeyer, baño termostático, estufa, desecador de cápsula)
// ==========================================

function handleSteps41to50(idPaso, datos, sm) {
    switch (idPaso) {

        case 41: // Lavar erlenmeyer
            if (datos.erlenmeyer) datos.erlenmeyer.destroy();
            break;

        case 42: // Prender baño termostático a 90 °C (Diapositiva 8)
            if (datos.banio) datos.banio.encender();
            break;

        case 43: // Colocar cápsula en baño (con video y zoom — Diapositiva 8)
            if (datos.banio && datos.capsula) {
                sm.mostrarVideoModal('Evaporación de Solvente en Baño Termostático', 3500, () => {
                    if (datos.banio && datos.capsula) {
                        datos.banio.colocarCapsula(datos.capsula);
                    }
                    sm.mostrarZoomImagen(TX.BANIO_CAPSULA);
                });
                sm.pasoActual--;
            }
            break;

        case 44: // Cerrar zoom del baño — sin efecto adicional
            break;

        case 45: // Prender estufa a 110 °C (Diapositiva 9)
            if (datos.estufa) datos.estufa.encender();
            break;

        case 46: // Colocar cápsula en estufa (con video y zoom — Diapositiva 9)
            if (datos.estufa && datos.capsula) {
                sm.mostrarVideoModal('Drying en Estufa a 110 °C', 3000, () => {
                    if (datos.estufa && datos.capsula) {
                        datos.estufa.colocarCapsula(datos.capsula);
                    }
                    sm.mostrarZoomImagen(TX.ESTUFA_CAPSULA);
                });
                sm.pasoActual--;
            }
            break;

        case 47: // Cerrar zoom de la estufa — sin efecto adicional
            break;

        case 48: // Apagar y guardar baño termostático
            if (datos.banio) datos.banio.destroy();
            break;

        case 49: // Apagar y guardar estufa
            if (datos.estufa) datos.estufa.destroy();
            break;

        case 50: // Trasladar cápsula al desecador
            if (datos.desecador) {
                datos.desecador.tieneCapsula = true;
                if (datos.desecador.tieneCrisol) {
                    datos.desecador.setTexture(TX.DESECADOR_AMBOS);
                } else {
                    datos.desecador.setTexture(TX.DESECADOR_CAPSULA);
                }
            }
            if (datos.capsula) datos.capsula.destroy();
            break;
    }
}
