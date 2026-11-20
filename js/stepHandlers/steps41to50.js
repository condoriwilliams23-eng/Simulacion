// ==========================================
// ARCHIVO: js/stepHandlers/steps41to50.js
// Propósito: Efectos visuales y de movimiento para los pasos 41 al 50
//            (Lavar erlenmeyer, baño termostático, estufa, desecador de cápsula)
// ==========================================

function handleSteps41to50(idPaso, datos, sm) {
    const scene = sm.scene;

    switch (idPaso) {

        case 41: // Lavar erlenmeyer
            if (datos.erlenmeyer && datos.erlenmeyer.scene) datos.erlenmeyer.destroy();
            break;

        case 42: // Prender baño termostático a 90 °C
            if (datos.banio) datos.banio.encender();
            break;

        case 43: // Colocar cápsula en la boca del baño termostático (con colocación animada, video y zoom)
            if (datos.banio && datos.capsula) {
                scene.animarColocacionEnBoca(
                    datos.capsula,
                    datos.banio.x,
                    datos.banio.y - 45,
                    {
                        alturaArco: 50,
                        duracion: 440,
                        onComplete: () => {
                            datos.banio.colocarCapsula(datos.capsula);
                            sm.mostrarVideoModal('Evaporación de Solvente en Baño Termostático', 2400, () => {
                                sm.mostrarZoomImagen(TX.FOTO_BANIO_CAPSULAS);
                            });
                        }
                    }
                );
            }
            break;

        case 44: // Al cerrar el zoom del baño, devolver la cápsula evaporada a la mesa para llevarla a la estufa
            {
                const banio = scene.children.list.find(o => o instanceof AparatoEvaporacion && o.tipo === 'banio');
                if (banio) {
                    banio.retirarCapsulaAMesa(scene.scale.width * 0.34, scene.scale.height * 0.58);
                }
            }
            break;

        case 45: // Prender estufa a 110 °C
            if (datos.estufa) datos.estufa.encender();
            break;

        case 46: // Colocar cápsula en la estufa (con colocación animada, video y zoom de la cápsula dentro de la estufa)
            if (datos.estufa && datos.capsula) {
                scene.animarColocacionEnBoca(
                    datos.capsula,
                    datos.estufa.x,
                    datos.estufa.y - 20,
                    {
                        alturaArco: 45,
                        duracion: 440,
                        onComplete: () => {
                            datos.estufa.colocarCapsula(datos.capsula);
                            sm.mostrarVideoModal('Secado en Estufa a 110 °C', 2200, () => {
                                sm.mostrarZoomImagen(TX.FOTO_ESTUFA_CAPSULA);
                            });
                        }
                    }
                );
            }
            break;

        case 47: // Al cerrar el zoom de la estufa, devolver la cápsula con sal seca a la mesa
            {
                const estufa = scene.children.list.find(o => o instanceof AparatoEvaporacion && o.tipo === 'estufa');
                if (estufa) {
                    estufa.retirarCapsulaAMesa(scene.scale.width * 0.36, scene.scale.height * 0.58);
                }
                if (scene.capsulaActiva) {
                    scene.capsulaActiva.conSalSeca = true;
                }
            }
            break;

        case 48: // Apagar y guardar baño termostático
            if (datos.banio && datos.banio.scene) datos.banio.destroy();
            break;

        case 49: // Apagar y guardar estufa
            if (datos.estufa && datos.estufa.scene) datos.estufa.destroy();
            break;

        case 50: // Trasladar cápsula a la boca del desecador con movimiento suave
            if (datos.desecador && datos.capsula) {
                scene.animarColocacionEnBoca(
                    datos.capsula,
                    datos.desecador.x,
                    datos.desecador.y - 25,
                    {
                        alturaArco: 55,
                        duracion: 450,
                        onComplete: () => {
                            datos.desecador.tieneCapsula = true;
                            if (datos.desecador.tieneCrisol) {
                                datos.desecador.setTexture(TX.DESECADOR_AMBOS);
                            } else {
                                datos.desecador.setTexture(TX.DESECADOR_CAPSULA);
                            }
                            if (datos.capsula && datos.capsula.scene) datos.capsula.destroy();
                            scene.capsulaActiva = null;
                        }
                    }
                );
            }
            break;
    }
}
