// ==========================================
// ARCHIVO: js/stepHandlers/steps01to10.js
// Propósito: Efectos visuales y de movimiento para los pasos 1 al 10
//            (Balanza, pesaje inicial, mezcla, probeta con efecto de volque en boca)
// ==========================================

function handleSteps01to10(idPaso, datos, sm) {
    const scene = sm.scene;

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
                    scene.animarColocacionEnBoca(
                        datos.vaso,
                        datos.balanza.x,
                        datos.balanza.y - 100,
                        {
                            alturaArco: 45,
                            duracion: 420,
                            onComplete: () => {
                                datos.vaso.bloquearEnBalanza(datos.balanza);
                                datos.balanza.setEstado('PESANDO');
                                datos.balanza.actualizarPeso(90.0);
                            }
                        }
                    );
                    sm.pasoActual--; // Esperar al botón TARA
                }
            }
            break;

        case 3: // Spawn del recipiente de mezcla
            break;

        case 4: // Trasvasar mezcla 5 g (sub-acciones CARGAR / VERTIR con efecto de volque en boca)
            if (datos.subAccion === 'CARGAR') {
                if (datos.espatula) {
                    const vasoMezcla = datos.vasoMezcla || scene.mezclaContainer;
                    if (vasoMezcla) {
                        scene.animarVolcadoEnBoca(datos.espatula, vasoMezcla, {
                            anguloVolcado: 42,
                            duracionVertido: 450,
                            tipoChorro: 'solido',
                            colorChorro: 0x4fc3f7,
                            destinoFinal: {
                                x: vasoMezcla.x - 85,
                                y: vasoMezcla.y - 45
                            },
                            onMitadVolcado: () => {
                                datos.espatula.cargar();
                            }
                        });
                    } else {
                        datos.espatula.cargar();
                    }
                    sm.pasoActual--; // Esperar la sub-acción VERTIR
                }
            } else if (datos.subAccion === 'VERTIR') {
                if (datos.espatula && datos.vasoBalanza) {
                    scene.animarVolcadoEnBoca(datos.espatula, datos.vasoBalanza, {
                        anguloVolcado: 60,
                        duracionVertido: 750,
                        tipoChorro: 'solido',
                        colorChorro: 0x29b6f6,
                        destinoFinal: {
                            x: scene.scale.width * 0.44,
                            y: scene.scale.height * 0.58
                        },
                        onMitadVolcado: () => {
                            datos.espatula.vaciar();
                            datos.vasoBalanza.llenarConSustancia();
                            const balanza = datos.vasoBalanza.balanzaVinculada || scene.balanzaActiva;
                            if (balanza) balanza.actualizarPeso(5.0);
                        }
                    });
                }
            }
            break;

        case 5: // Registrar masa de la mezcla en tabla lateral
            sm.registrarMasa('masa-mezcla', '5.0');
            break;

        case 6: // Apagar balanza y bajar el vaso suavemente a la mesa
            if (datos.balanza) datos.balanza.apagar();
            if (scene) {
                const vasoObj = scene.children.list.find(o => o instanceof Vaso);
                if (vasoObj) {
                    vasoObj.desbloquearDeBalanza();
                    scene.tweens.add({
                        targets: vasoObj,
                        x: scene.scale.width * 0.26,
                        y: scene.scale.height * 0.58,
                        duration: 450,
                        ease: 'Cubic.easeOut'
                    });
                }
            }
            break;

        case 7: // Guardar recipiente y lavar espátula
            if (scene.mezclaContainer) scene.mezclaContainer.destroy();
            if (scene.espatulaActiva) scene.espatulaActiva.destroy();
            break;

        case 8: // Llenar probeta 40 mL con piseta (volcado en boca de probeta + zoom)
            if (datos.subAccion === 'LLENAR') {
                if (datos.probeta && datos.piseta) {
                    scene.animarVolcadoEnBoca(datos.piseta, datos.probeta, {
                        forzarLado: 1,
                        anguloVolcado: 48,
                        duracionVertido: 780,
                        tipoChorro: 'rocio',
                        colorChorro: 0x4dd0e1,
                        destinoFinal: {
                            x: scene.scale.width * 0.45,
                            y: scene.scale.height * 0.58
                        },
                        onMitadVolcado: () => {
                            datos.probeta.setTexture(TX.PROBETA_40ML);
                            datos.probeta.input.dropZone = false;
                        },
                        onFinVolcado: () => {
                            sm.mostrarZoomImagen(TX.ZOOM_40ML);
                        }
                    });
                    sm.pasoActual--; // Avanzar sólo al cerrar zoom
                } else if (datos.probeta) {
                    datos.probeta.setTexture(TX.PROBETA_40ML);
                    datos.probeta.input.dropZone = false;
                    sm.mostrarZoomImagen(TX.ZOOM_40ML);
                    sm.pasoActual--;
                }
            }
            break;

        case 9: // Verter agua de la probeta al vaso (efecto de volque apoyado en el borde de la boca del vaso)
            if (datos.vaso && datos.probeta) {
                scene.animarVolcadoEnBoca(datos.probeta, datos.vaso, {
                    anguloVolcado: 74,
                    duracionVertido: 950,
                    tipoChorro: 'liquido',
                    colorChorro: 0x4fc3f7,
                    destinoFinal: {
                        x: scene.scale.width * 0.42,
                        y: scene.scale.height * 0.58
                    },
                    onMitadVolcado: () => {
                        datos.vaso.llenarConAgua();
                        datos.probeta.setTexture(TX.PROBETA);
                    },
                    onFinVolcado: () => {
                        sm.avanzarPaso();
                    }
                });
                sm.pasoActual--; // Avanzar al terminar el volcado
            }
            break;

        case 10: // Lavar probeta
            if (datos.probeta) datos.probeta.destroy();
            break;
    }
}
