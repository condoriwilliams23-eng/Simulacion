// ==========================================
// ARCHIVO: js/stepHandlers/steps11to20.js
// Propósito: Efectos visuales y de movimiento para los pasos 11 al 20
//            (Agitación, soporte de filtración, embudo, filtrado con volcado, lavados)
// ==========================================

function handleSteps11to20(idPaso, datos, sm) {
    const scene = sm.scene;

    switch (idPaso) {

        case 11: // Agitar con varilla de vidrio entrando por la boca del vaso
            if (datos.vaso && datos.varilla) {
                datos.varilla.input.draggable = false;
                scene.children.bringToTop(datos.varilla);
                datos.varilla.setVisible(true);

                const vasoX = datos.vaso.x;
                const vasoY = datos.vaso.y;

                // Primero posicionar la varilla sobre la boca del vaso y sumergirla
                scene.tweens.add({
                    targets: datos.varilla,
                    x: vasoX - 10,
                    y: vasoY - 55,
                    angle: -10,
                    duration: 240,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        // Movimiento de agitación elíptico dentro del vaso
                        scene.tweens.add({
                            targets: datos.varilla,
                            x: { from: vasoX - 14, to: vasoX + 14 },
                            y: { from: vasoY - 58, to: vasoY - 38 },
                            duration: 280,
                            yoyo: true,
                            repeat: 5,
                            ease: 'Sine.easeInOut'
                        });

                        scene.tweens.add({
                            targets: datos.varilla,
                            angle: { from: -12, to: 12 },
                            duration: 140,
                            yoyo: true,
                            repeat: 11,
                            ease: 'Sine.easeInOut'
                        });

                        datos.vaso.agitar(() => {
                            const retX = datos.varilla.posicionOriginalX !== undefined
                                ? datos.varilla.posicionOriginalX
                                : scene.scale.width * 0.42;
                            const retY = datos.varilla.posicionOriginalY !== undefined
                                ? datos.varilla.posicionOriginalY
                                : scene.scale.height * 0.56;

                            scene.tweens.add({
                                targets: datos.varilla,
                                x: retX,
                                y: retY,
                                angle: 0,
                                duration: 400,
                                ease: 'Back.easeOut',
                                onComplete: () => {
                                    datos.varilla.setVisible(true);
                                    datos.varilla.input.draggable = true;
                                    sm.avanzarPaso();
                                }
                            });
                        });
                    }
                });
                sm.pasoActual--; // Avanza en el callback al terminar de agitar
            }
            break;

        case 12: // Armar soporte (encajar aro en el soporte universal con animación)
            if (datos.soporte) {
                if (datos.aro) {
                    scene.animarColocacionEnBoca(
                        datos.aro,
                        datos.soporte.x + 10,
                        datos.soporte.y - 30,
                        {
                            alturaArco: 35,
                            duracion: 380,
                            onComplete: () => {
                                datos.soporte.agregarAro();
                                if (datos.aro && datos.aro.scene) datos.aro.destroy();
                            }
                        }
                    );
                } else {
                    datos.soporte.agregarAro();
                }
            }
            break;

        case 13: // Colocar Erlenmeyer en la base del soporte con animación
            if (datos.soporte && datos.erlenmeyer) {
                scene.animarColocacionEnBoca(
                    datos.erlenmeyer,
                    datos.soporte.x - 5,
                    datos.soporte.y + 110,
                    {
                        alturaArco: 30,
                        duracion: 400,
                        onComplete: () => {
                            datos.soporte.colocarErlenmeyer(datos.erlenmeyer);
                        }
                    }
                );
            }
            break;

        case 14: // Doblar papel de filtro (1 -> 2 -> cono) e introducirlo en la boca del embudo
            if (datos.embudo) {
                if (datos.filtro) {
                    datos.filtro.input.draggable = false;
                    scene.children.bringToTop(datos.filtro);

                    // Paso 1 del pliegue: medio círculo (Papel de filtro 2)
                    scene.tweens.add({
                        targets: datos.filtro,
                        x: datos.embudo.x,
                        y: datos.embudo.y - 65,
                        duration: 240,
                        ease: 'Sine.easeOut',
                        onComplete: () => {
                            if (datos.filtro && datos.filtro.scene) {
                                datos.filtro.setTexture(TX.FILTRO_2);
                            }
                            // Paso 2 del pliegue: cono (Papel de filtro icono) y descenso al embudo
                            scene.time.delayedCall(220, () => {
                                if (datos.filtro && datos.filtro.scene) {
                                    datos.filtro.setTexture(TX.FILTRO_ICONO);
                                }
                                scene.tweens.add({
                                    targets: datos.filtro,
                                    y: datos.embudo.y - 18,
                                    scaleX: 0.22,
                                    scaleY: 0.22,
                                    alpha: 0.2,
                                    duration: 280,
                                    ease: 'Back.easeIn',
                                    onComplete: () => {
                                        if (datos.filtro && datos.filtro.scene) datos.filtro.destroy();
                                        if (datos.embudo && datos.embudo.scene) {
                                            datos.embudo.setTexture(TX.EMBUDO_CON_FILTRO);
                                        }
                                        sm.mostrarVideoModal('Doblado y Ajuste del Papel de Filtro', 2000, () => {
                                            sm.avanzarPaso();
                                        });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    datos.embudo.setTexture(TX.EMBUDO_CON_FILTRO);
                    sm.mostrarVideoModal('Doblado y Ajuste del Papel de Filtro', 2000, () => {
                        sm.avanzarPaso();
                    });
                }
                sm.pasoActual--; // Avanza al cerrar el modal
            }
            break;

        case 15: // Adherir filtro con piseta (efecto de volque en el borde de la boca del embudo)
            if (datos.embudo) {
                if (datos.piseta) {
                    scene.animarVolcadoEnBoca(datos.piseta, datos.embudo, {
                        forzarLado: 1,
                        anguloVolcado: 48,
                        duracionVertido: 700,
                        tipoChorro: 'rocio',
                        colorChorro: 0x4dd0e1,
                        destinoFinal: {
                            x: scene.scale.width * 0.42,
                            y: scene.scale.height * 0.58
                        },
                        onFinVolcado: () => {
                            sm.mostrarVideoModal('Adherido de Papel Filtro con Piseta', 1800, () => {
                                sm.avanzarPaso();
                            });
                        }
                    });
                } else {
                    sm.mostrarVideoModal('Adherido de Papel Filtro con Piseta', 1800, () => {
                        sm.avanzarPaso();
                    });
                }
                sm.pasoActual--;
            }
            break;

        case 16: // Colocar embudo en soporte y luego colocar varilla vigilante sobre la boca del embudo
            if (datos.soporte) {
                if (datos.subAccion === 'EMBUDO') {
                    if (datos.embudo) {
                        scene.animarColocacionEnBoca(
                            datos.embudo,
                            datos.soporte.x - 5,
                            datos.soporte.y - 35,
                            {
                                alturaArco: 45,
                                duracion: 420,
                                onComplete: () => {
                                    datos.soporte.agregarFiltro();
                                    if (datos.embudo && datos.embudo.scene) datos.embudo.destroy();
                                }
                            }
                        );
                    } else {
                        datos.soporte.agregarFiltro();
                    }
                    sm.pasoActual--; // Esperar a colocar la varilla
                } else {
                    if (datos.varilla) {
                        scene.animarColocacionEnBoca(
                            datos.varilla,
                            datos.soporte.x + 12,
                            datos.soporte.y - 85,
                            {
                                alturaArco: 40,
                                anguloIntermedio: -25,
                                duracion: 420,
                                onComplete: () => {
                                    datos.soporte.agregarVigilante();
                                    if (datos.varilla && datos.varilla.scene) datos.varilla.destroy();
                                }
                            }
                        );
                    } else {
                        datos.soporte.agregarVigilante();
                    }
                }
            }
            break;

        case 17: // Filtrar solución (efecto de volque del vaso apoyado en el borde del embudo/vigilante)
            {
                const soporte = datos.soporte || scene.children.list.find(o => o instanceof SoporteFiltracion);
                const vaso = datos.vaso || scene.children.list.find(o => o instanceof Vaso);
                if (soporte && vaso) {
                    scene.animarVolcadoEnBoca(vaso, soporte, {
                        forzarLado: 1,
                        anguloVolcado: 74,
                        duracionVertido: 1050,
                        tipoChorro: 'liquido',
                        colorChorro: 0x0288d1,
                        destinoFinal: {
                            x: scene.scale.width * 0.30,
                            y: scene.scale.height * 0.58
                        },
                        onMitadVolcado: () => {
                            soporte.comenzarFiltrado();
                            vaso.vaciarSolucion();
                        },
                        onFinVolcado: () => {
                            sm.mostrarVideoModal('Trasvaso y Filtración de la Solución', 2200, () => {
                                sm.avanzarPaso();
                            });
                        }
                    });
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 17: No se encontró soporte o vaso en escena.");
                }
            }
            break;

        case 18: // Lavar varilla con piseta (volcado en borde superior del soporte/varilla)
            if (datos.soporte) {
                const piseta = datos.piseta || scene.children.list.find(o => o.texture && o.texture.key === TX.PISETA);
                if (piseta) {
                    scene.animarVolcadoEnBoca(piseta, datos.soporte, {
                        forzarLado: 1,
                        anguloVolcado: 52,
                        duracionVertido: 800,
                        tipoChorro: 'rocio',
                        colorChorro: 0x4dd0e1,
                        destinoFinal: {
                            x: scene.scale.width * 0.48,
                            y: scene.scale.height * 0.58
                        },
                        onMitadVolcado: () => {
                            datos.soporte.lavarVarilla();
                        },
                        onFinVolcado: () => {
                            sm.mostrarVideoModal('Lavado e Higienizado del Vigilante', 2000, () => {
                                sm.avanzarPaso();
                            });
                        }
                    });
                } else {
                    datos.soporte.lavarVarilla();
                    sm.mostrarVideoModal('Lavado e Higienizado del Vigilante', 2000, () => {
                        sm.avanzarPaso();
                    });
                }
                sm.pasoActual--;
            }
            break;

        case 19: // Trasvasar arena con piseta (lavado en boca del vaso + volcado del vaso en la boca del embudo)
            {
                const soporte = datos.soporte || scene.children.list.find(o => o instanceof SoporteFiltracion);
                const vaso = datos.vaso || scene.children.list.find(o => o instanceof Vaso);
                const piseta = datos.piseta || scene.children.list.find(o => o.texture && o.texture.key === TX.PISETA);

                if (soporte && vaso) {
                    if (piseta) {
                        // 1) Piseta rocía agua en la boca del vaso con arena húmeda
                        scene.animarVolcadoEnBoca(piseta, vaso, {
                            forzarLado: 1,
                            anguloVolcado: 48,
                            duracionVertido: 600,
                            tipoChorro: 'rocio',
                            colorChorro: 0x4dd0e1,
                            destinoFinal: {
                                x: scene.scale.width * 0.48,
                                y: scene.scale.height * 0.58
                            },
                            onFinVolcado: () => {
                                // 2) El vaso sube al borde de la boca del embudo y vuelca la arena húmeda
                                scene.animarVolcadoEnBoca(vaso, soporte, {
                                    forzarLado: 1,
                                    anguloVolcado: 80,
                                    duracionVertido: 900,
                                    tipoChorro: 'solido',
                                    colorChorro: 0xd7ccc8,
                                    destinoFinal: {
                                        x: scene.scale.width * 0.28,
                                        y: scene.scale.height * 0.58
                                    },
                                    onMitadVolcado: () => {
                                        soporte.trasvasarArena();
                                        vaso.vaciarArena();
                                    },
                                    onFinVolcado: () => {
                                        sm.mostrarVideoModal('Trasvase y Lavado Final de la Arena', 2200, () => {
                                            sm.avanzarPaso();
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        soporte.trasvasarArena();
                        vaso.vaciarArena();
                        sm.mostrarVideoModal('Trasvase y Lavado Final de la Arena', 2200, () => {
                            sm.avanzarPaso();
                        });
                    }
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 19: No se encontró soporte o vaso en escena.");
                }
            }
            break;

        case 20: // Lavar filtro con piseta (volcado sobre la boca del embudo en el soporte)
            {
                const soporte = datos.soporte || scene.children.list.find(o => o instanceof SoporteFiltracion);
                const piseta = datos.piseta || scene.children.list.find(o => o.texture && o.texture.key === TX.PISETA);
                if (soporte) {
                    if (piseta) {
                        scene.animarVolcadoEnBoca(piseta, soporte, {
                            forzarLado: 1,
                            anguloVolcado: 54,
                            duracionVertido: 850,
                            tipoChorro: 'rocio',
                            colorChorro: 0x4dd0e1,
                            destinoFinal: {
                                x: scene.scale.width * 0.48,
                                y: scene.scale.height * 0.58
                            },
                            onMitadVolcado: () => {
                                soporte.lavarFiltroFinal(() => {
                                    sm.avanzarPaso();
                                });
                            }
                        });
                    } else {
                        soporte.lavarFiltroFinal(() => {
                            sm.avanzarPaso();
                        });
                    }
                    sm.pasoActual--;
                } else {
                    console.error("[steps11to20.js] Paso 20: No se encontró soporte en escena.");
                }
            }
            break;
    }
}
