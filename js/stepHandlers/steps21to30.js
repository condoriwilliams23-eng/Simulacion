// ==========================================
// ARCHIVO: js/stepHandlers/steps21to30.js
// Propósito: Efectos visuales y de movimiento para los pasos 21 al 30
//            (Limpieza, crisol, pesaje, filtro en boca del crisol, montaje de calcinación)
// ==========================================

function handleSteps21to30(idPaso, datos, sm) {
    const scene = sm.scene;

    switch (idPaso) {

        case 21: // Lavar vaso, varilla, guardar piseta
            {
                const vaso = scene.children.list.find(o => o instanceof Vaso);
                const varilla = scene.children.list.find(o => o.texture && o.texture.key === TX.VARILLA);
                const piseta = scene.children.list.find(o => o.texture && o.texture.key === TX.PISETA);
                if (vaso) vaso.destroy();
                if (varilla) varilla.destroy();
                if (piseta) piseta.destroy();
            }
            break;

        case 22: // Retirar filtro con arena y lavar embudo
            if (datos.embudo && datos.embudo.scene) datos.embudo.destroy();
            break;

        case 23: // Quitar Erlenmeyer de la base del soporte y deslizarlo suavemente a la mesa
            {
                const soporte = datos.soporte || scene.children.list.find(o => o instanceof SoporteFiltracion);
                if (soporte && soporte.retirarErlenmeyerDeBase) {
                    soporte.retirarErlenmeyerDeBase();
                } else if (scene.erlenmeyerActivo) {
                    scene.erlenmeyerActivo.setTexture(TX.VASO_SOLUCION_FINAL);
                    scene.erlenmeyerActivo.setScale(0.72);
                    scene.tweens.add({
                        targets: scene.erlenmeyerActivo,
                        x: scene.scale.width * 0.45,
                        y: scene.scale.height * 0.55,
                        duration: 450,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            if (scene.erlenmeyerActivo && scene.erlenmeyerActivo.input) {
                                scene.erlenmeyerActivo.input.draggable = true;
                            }
                        }
                    });
                }
            }
            break;

        case 24: // Guardar soporte de filtración y aro
            {
                const soporte = datos.soporte || scene.children.list.find(o => o instanceof SoporteFiltracion);
                if (soporte && soporte.scene) soporte.destroy();
                const aro = datos.aro || scene.children.list.find(o => o.texture && o.texture.key === TX.SOPORTE_ARO_PIEZA);
                if (aro && aro.scene) aro.destroy();
            }
            break;

        case 25: // Prender balanza para pesaje del crisol
            if (datos.balanza) datos.balanza.encender();
            break;

        case 26: // Pesar crisol vacío (34.1 g) con colocación suave en platillo
            if (datos.balanza) {
                const crisol = datos.crisol || scene.crisolActivo;
                if (crisol) {
                    scene.animarColocacionEnBoca(
                        crisol,
                        datos.balanza.x,
                        datos.balanza.y - 95,
                        {
                            alturaArco: 40,
                            duracion: 400,
                            onComplete: () => {
                                datos.balanza.setEstado('PESANDO');
                                datos.balanza.actualizarPeso(34.1);
                            }
                        }
                    );
                } else {
                    datos.balanza.setEstado('PESANDO');
                    datos.balanza.actualizarPeso(34.1);
                }
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 27: // Apagar balanza y deslizar el crisol nuevamente a la mesa
            if (datos.balanza) datos.balanza.apagar();
            if (scene.crisolActivo && scene.crisolActivo.scene) {
                scene.tweens.add({
                    targets: scene.crisolActivo,
                    x: scene.scale.width * 0.28,
                    y: scene.scale.height * 0.56,
                    duration: 450,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        if (scene.crisolActivo && scene.crisolActivo.input) {
                            scene.crisolActivo.input.draggable = true;
                        }
                    }
                });
            }
            break;

        case 28: // Colocar filtro con arena en la boca del crisol (con animación de pliegue e inserción)
            if (datos.filtro && datos.crisol) {
                datos.filtro.input.draggable = false;
                scene.children.bringToTop(datos.filtro);

                const bocaCrisol = scene.obtenerBocaReceptor(datos.crisol);
                scene.tweens.add({
                    targets: datos.filtro,
                    x: bocaCrisol.x,
                    y: bocaCrisol.y - 25,
                    angle: 30,
                    scaleX: datos.filtro.scaleX * 0.7,
                    scaleY: datos.filtro.scaleY * 0.7,
                    duration: 300,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        scene.tweens.add({
                            targets: datos.filtro,
                            x: datos.crisol.x,
                            y: datos.crisol.y - 8,
                            angle: 0,
                            scaleX: datos.filtro.scaleX * 0.35,
                            scaleY: datos.filtro.scaleY * 0.35,
                            alpha: 0.15,
                            duration: 280,
                            ease: 'Back.easeIn',
                            onComplete: () => {
                                if (datos.filtro && datos.filtro.scene) datos.filtro.destroy();
                                scene.filtroConArena = null;
                                if (datos.crisol && datos.crisol.scene) {
                                    datos.crisol.conFiltro = true;
                                    datos.crisol.setTexture(TX.CRISOL_FILTRO);
                                }
                                sm.mostrarVideoModal('Introducción del Filtro en Crisol', 2000, () => {
                                    sm.avanzarPaso();
                                });
                            }
                        });
                    }
                });
                sm.pasoActual--;
            } else if (datos.filtro) {
                datos.filtro.destroy();
                if (datos.crisol) datos.crisol.conFiltro = true;
            }
            break;

        case 29: // Montar trípode / triángulo / crisol con colocación animada
            {
                const calentamiento = datos.calentamiento || scene.children.list.find(o => o instanceof EquipoCalentamiento);
                if (calentamiento) {
                    if (datos.subAccion === 'TRIANGULO') {
                        const triangulo = datos.triangulo || scene.children.list.find(o => o.texture && o.texture.key === TX.TRIANGULO);
                        if (triangulo) {
                            scene.animarColocacionEnBoca(
                                triangulo,
                                calentamiento.x,
                                calentamiento.y - 55,
                                {
                                    alturaArco: 40,
                                    duracion: 380,
                                    onComplete: () => {
                                        calentamiento.agregarTriangulo();
                                        if (triangulo && triangulo.scene) triangulo.destroy();
                                    }
                                }
                            );
                        } else {
                            calentamiento.agregarTriangulo();
                        }
                        sm.pasoActual--; // Esperar sub-acción CRISOL
                    } else if (datos.subAccion === 'CRISOL') {
                        const crisol = datos.crisol || scene.crisolActivo || scene.children.list.find(o => o.texture && o.texture.key === TX.CRISOL);
                        if (crisol) {
                            scene.animarColocacionEnBoca(
                                crisol,
                                calentamiento.x,
                                calentamiento.y - 68,
                                {
                                    alturaArco: 45,
                                    duracion: 420,
                                    onComplete: () => {
                                        calentamiento.agregarCrisol(crisol);
                                    }
                                }
                            );
                        } else {
                            calentamiento.agregarCrisol(null);
                        }
                    }
                } else {
                    console.error("[steps21to30.js] Paso 29: No se encontró equipo de calentamiento en escena.");
                }
            }
            break;

        case 30: // Montar mechero bunsen debajo del trípode con movimiento suave
            {
                const calentamiento = datos.calentamiento || scene.children.list.find(o => o instanceof EquipoCalentamiento);
                const mechero = datos.mechero || scene.children.list.find(o => o.texture && o.texture.key === TX.MECHERO);
                if (calentamiento) {
                    if (mechero && mechero.scene) {
                        if (mechero.input) mechero.input.draggable = false;
                        scene.tweens.add({
                            targets: mechero,
                            x: calentamiento.x,
                            y: calentamiento.y + 25,
                            duration: 420,
                            ease: 'Back.easeOut',
                            onComplete: () => {
                                calentamiento.agregarMechero();
                                if (mechero && mechero.scene) mechero.destroy();
                            }
                        });
                    } else {
                        calentamiento.agregarMechero();
                    }
                } else {
                    console.error("[steps21to30.js] Paso 30: No se encontró equipo de calentamiento en escena.");
                }
            }
            break;
    }
}
