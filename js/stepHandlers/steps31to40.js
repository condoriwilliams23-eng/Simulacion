// ==========================================
// ARCHIVO: js/stepHandlers/steps31to40.js
// Propósito: Efectos visuales y de movimiento para los pasos 31 al 40
//            (Calcinación con llama animada, desecador, cápsula, volcado del filtrado)
// ==========================================

function handleSteps31to40(idPaso, datos, sm) {
    const scene = sm.scene;

    switch (idPaso) {

        case 31: // Tomar pinzas
            break;

        case 32: // Calcinar arena (llama animada en el mechero + verificación con pinza en boca del crisol)
            {
                const calentamiento = datos.calentamiento || scene.children.list.find(o => o instanceof EquipoCalentamiento);
                if (calentamiento) {
                    scene.animarLlamaYCalcinacion(calentamiento, () => {
                        sm.mostrarVideoModal('Calcinación de Papel y Muestra', 2500, () => {
                            if (calentamiento) {
                                calentamiento.encendido = false;
                                calentamiento.estadoCalentamiento = 4;
                                if (calentamiento.crisolVinculado) {
                                    calentamiento.crisolVinculado.conArenaSeca = true;
                                }
                            }
                            sm.avanzarPaso();
                        });
                    });
                    sm.pasoActual--;
                }
            }
            break;

        case 33: // Guardar equipo de calentamiento y dejar el crisol listo en la mesa
            {
                const crisol = (datos.calentamiento && datos.calentamiento.crisolVinculado)
                    || scene.crisolActivo
                    || scene.children.list.find(o => o.texture && (o.texture.key === TX.CRISOL || o.texture.key === TX.CRISOL_PINZAS));

                if (crisol && crisol.scene) {
                    crisol.setVisible(true);
                    crisol.setTexture(TX.CRISOL_PINZAS);
                    crisol.x = scene.scale.width * 0.55;
                    crisol.y = scene.scale.height * 0.48;
                    scene.tweens.add({
                        targets: crisol,
                        x: scene.scale.width * 0.44,
                        y: scene.scale.height * 0.56,
                        duration: 420,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            if (crisol.input) crisol.input.draggable = true;
                        }
                    });
                }
                if (datos.calentamiento && datos.calentamiento.scene) {
                    datos.calentamiento.destroy();
                }
            }
            break;

        case 34: // Seleccionar desecador
            break;

        case 35: // Trasladar crisol a la boca del desecador con pinzas
            {
                const desecador = datos.desecador || scene.children.list.find(o => o.texture && o.texture.key === TX.DESECADOR);
                const crisol = datos.crisol || scene.crisolActivo || scene.children.list.find(o => o.texture && (o.texture.key === TX.CRISOL || o.texture.key === TX.CRISOL_PINZAS));
                const pinza = datos.pinza || scene.children.list.find(o => o.texture && o.texture.key === TX.PINZA);

                if (desecador && crisol) {
                    if (pinza && pinza.scene) {
                        scene.children.bringToTop(pinza);
                        scene.tweens.add({
                            targets: pinza,
                            x: desecador.x - 35,
                            y: desecador.y - 75,
                            angle: -20,
                            duration: 380,
                            yoyo: true,
                            ease: 'Sine.easeInOut',
                            onComplete: () => {
                                if (pinza.scene) {
                                    pinza.angle = 0;
                                    pinza.x = scene.scale.width * 0.46;
                                    pinza.y = scene.scale.height * 0.56;
                                    if (pinza.input) pinza.input.draggable = true;
                                }
                            }
                        });
                    }

                    scene.animarColocacionEnBoca(
                        crisol,
                        desecador.x,
                        desecador.y - 20,
                        {
                            alturaArco: 60,
                            duracion: 460,
                            onComplete: () => {
                                desecador.setTexture(TX.DESECADOR_CRISOL);
                                desecador.tieneCrisol = true;
                                if (crisol && crisol.scene) crisol.destroy();
                                scene.crisolActivo = null;
                                sm.mostrarVideoModal('Traslado de Crisol con Pinzas a Desecador', 2000, () => {
                                    sm.avanzarPaso();
                                });
                            }
                        }
                    );
                    sm.pasoActual--;
                } else {
                    console.error("[steps31to40.js] Paso 35: No se encontró desecador o crisol en escena.");
                }
            }
            break;

        case 36: // Guardar pinzas
            if (datos.pinza && datos.pinza.scene) datos.pinza.destroy();
            break;

        case 37: // Prender balanza para pesaje de cápsula
            if (datos.balanza) datos.balanza.encender();
            break;

        case 38: // Pesar cápsula vacía (55.5 g) con colocación suave en balanza
            if (datos.balanza) {
                const capsula = datos.capsula || scene.capsulaActiva;
                if (capsula) {
                    scene.animarColocacionEnBoca(
                        capsula,
                        datos.balanza.x,
                        datos.balanza.y - 95,
                        {
                            alturaArco: 40,
                            duracion: 400,
                            onComplete: () => {
                                datos.balanza.setEstado('PESANDO');
                                datos.balanza.actualizarPeso(55.5);
                            }
                        }
                    );
                } else {
                    datos.balanza.setEstado('PESANDO');
                    datos.balanza.actualizarPeso(55.5);
                }
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 39: // Apagar balanza y devolver la cápsula suavemente a la mesa
            if (datos.balanza) datos.balanza.apagar();
            if (scene.capsulaActiva && scene.capsulaActiva.scene) {
                scene.tweens.add({
                    targets: scene.capsulaActiva,
                    x: scene.scale.width * 0.30,
                    y: scene.scale.height * 0.58,
                    duration: 450,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        if (scene.capsulaActiva && scene.capsulaActiva.input) {
                            scene.capsulaActiva.input.draggable = true;
                        }
                    }
                });
            }
            break;

        case 40: // Trasvasar filtrado del Erlenmeyer a la cápsula (efecto de volque en el borde de la boca)
            if (datos.capsula && datos.erlenmeyer) {
                // Ajustar a los cuadros de volcado del Erlenmeyer (2 -> 3 -> 4 -> vacío)
                datos.erlenmeyer.setScale(0.35);
                datos.erlenmeyer.setTexture(TX.ERLENMEYER_SOL2);

                scene.time.delayedCall(280, () => {
                    if (datos.erlenmeyer && datos.erlenmeyer.scene) {
                        datos.erlenmeyer.setTexture(TX.ERLENMEYER_SOL3);
                    }
                });
                scene.time.delayedCall(520, () => {
                    if (datos.erlenmeyer && datos.erlenmeyer.scene) {
                        datos.erlenmeyer.setTexture(TX.ERLENMEYER_SOL4);
                    }
                });

                scene.animarVolcadoEnBoca(datos.erlenmeyer, datos.capsula, {
                    forzarLado: 1,
                    anguloVolcado: 42,
                    duracionVertido: 950,
                    tipoChorro: 'liquido',
                    colorChorro: 0x0288d1,
                    destinoFinal: {
                        x: scene.scale.width * 0.48,
                        y: scene.scale.height * 0.58
                    },
                    onMitadVolcado: () => {
                        if (datos.capsula.recibirFiltrado) {
                            datos.capsula.recibirFiltrado();
                        } else {
                            datos.capsula.setTexture(TX.CAPSULA_SOLUCION);
                            datos.capsula.tieneSolucion = true;
                        }
                        datos.erlenmeyer.setTexture(TX.ERLENMEYER);
                    },
                    onFinVolcado: () => {
                        sm.avanzarPaso();
                    }
                });
                sm.pasoActual--; // Avanza al terminar el volcado
            }
            break;
    }
}
