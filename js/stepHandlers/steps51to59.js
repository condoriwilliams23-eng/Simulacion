// ==========================================
// ARCHIVO: js/stepHandlers/steps51to59.js
// Propósito: Efectos visuales y de movimiento para los pasos 51 al 59
//            (Pesajes finales de crisol y cápsula, cálculos y cierre)
// ==========================================

function handleSteps51to59(idPaso, datos, sm) {
    const scene = sm.scene;

    switch (idPaso) {

        case 51: // Retirar crisol del desecador y encender balanza
            {
                const balanza = datos.balanza || scene.balanzaActiva;
                const desecador = datos.desecador || scene.children.list.find(o => o.tieneCrisol !== undefined);

                if (balanza) balanza.encender();

                if (desecador && desecador.tieneCrisol) {
                    desecador.tieneCrisol = false;
                    if (desecador.tieneCapsula) {
                        desecador.setTexture(TX.DESECADOR_CAPSULA);
                    } else {
                        desecador.setTexture(TX.DESECADOR);
                    }

                    // Crear el crisol con arena saliendo de la boca del desecador hacia la mesa
                    scene.crisolActivo = scene.add.sprite(
                        desecador.x,
                        desecador.y - 35,
                        TX.CRISOL
                    ).setScale(0.35).setInteractive({ cursor: 'grab' });
                    scene.input.setDraggable(scene.crisolActivo);
                    scene.crisolActivo.conArenaSeca = true;

                    scene.tweens.add({
                        targets: scene.crisolActivo,
                        x: scene.scale.width * 0.42,
                        y: scene.scale.height * 0.56,
                        duration: 460,
                        ease: 'Back.easeOut'
                    });
                }
            }
            break;

        case 52: // Pesar crisol con arena (37.3 g) con colocación suave en balanza
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
                                datos.balanza.actualizarPeso(37.3);
                            }
                        }
                    );
                } else {
                    datos.balanza.setEstado('PESANDO');
                    datos.balanza.actualizarPeso(37.3);
                }
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 53: // Apagar balanza y devolver el crisol a la mesa para poder lavarlo
            if (datos.balanza) datos.balanza.apagar();
            if (scene.crisolActivo && scene.crisolActivo.scene) {
                scene.tweens.add({
                    targets: scene.crisolActivo,
                    x: scene.scale.width * 0.42,
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

        case 54: // Lavar y guardar crisol
            if (datos.crisol && datos.crisol.scene) datos.crisol.destroy();
            break;

        case 55: // Retirar cápsula del desecador y encender balanza
            {
                const balanza = datos.balanza || scene.balanzaActiva;
                const desecador = datos.desecador || scene.children.list.find(o => o.tieneCapsula !== undefined);

                if (balanza) balanza.encender();

                if (desecador && desecador.tieneCapsula) {
                    desecador.tieneCapsula = false;
                    if (desecador.tieneCrisol) {
                        desecador.setTexture(TX.DESECADOR_CRISOL);
                    } else {
                        desecador.setTexture(TX.DESECADOR);
                    }

                    // Crear la cápsula con sal saliendo desde la boca del desecador hacia la mesa
                    scene.capsulaActiva = scene.add.sprite(
                        desecador.x,
                        desecador.y - 35,
                        TX.CAPSULA
                    ).setScale(0.35).setInteractive({ cursor: 'grab' });
                    scene.input.setDraggable(scene.capsulaActiva);
                    scene.capsulaActiva.conSalSeca = true;

                    scene.tweens.add({
                        targets: scene.capsulaActiva,
                        x: scene.scale.width * 0.42,
                        y: scene.scale.height * 0.56,
                        duration: 460,
                        ease: 'Back.easeOut'
                    });
                }
            }
            break;

        case 56: // Pesar cápsula con sal (56.8 g) con colocación suave en balanza
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
                                datos.balanza.actualizarPeso(56.8);
                            }
                        }
                    );
                } else {
                    datos.balanza.setEstado('PESANDO');
                    datos.balanza.actualizarPeso(56.8);
                }
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 57: // Apagar balanza y devolver la cápsula a la mesa para poder lavarla en el paso 59
            if (datos.balanza) datos.balanza.apagar();
            if (scene.capsulaActiva && scene.capsulaActiva.scene) {
                scene.tweens.add({
                    targets: scene.capsulaActiva,
                    x: scene.scale.width * 0.42,
                    y: scene.scale.height * 0.56,
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

        case 58: // Guardar balanza y desecador
            if (datos.balanza && datos.balanza.scene) datos.balanza.destroy();
            if (datos.desecador && datos.desecador.scene) datos.desecador.destroy();
            break;

        case 59: // Lavar cápsula y activar panel de cálculos finales
            if (datos.capsula && datos.capsula.scene) datos.capsula.destroy();
            sm.activarPanelCalculos();
            break;
    }
}
