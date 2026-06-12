// ==========================================
// ARCHIVO: js/managers/DragManager.js
// Propósito: Controlar los eventos de arrastre usando tablas de reglas declarativas.
//            Las reglas de drop, descarte y fallback están en js/data/.
// ==========================================

class DragManager {
    constructor(scene, stepManager) {
        this.scene = scene;
        this.stepManager = stepManager;
        this.initDragListeners();
    }

    initDragListeners() {
        // ── DRAG START ─────────────────────────────────────────────
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            if (!gameObject.input.draggable) return;

            // Bloquear arrastre de SoporteFiltracion si no estamos en el paso 24
            const paso = this.stepManager.pasoActual;
            if (gameObject instanceof SoporteFiltracion && paso !== 24) {
                return;
            }

            gameObject.posicionOriginalX = gameObject.x;
            gameObject.posicionOriginalY = gameObject.y;
            gameObject.dropped = false;
            gameObject.setAlpha(0.8);
            this.scene.children.bringToTop(gameObject);
        });

        // ── DRAG (mover) ───────────────────────────────────────────
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!gameObject.input.draggable) return;

            // Bloquear movimiento de SoporteFiltracion si no estamos en el paso 24
            const paso = this.stepManager.pasoActual;
            if (gameObject instanceof SoporteFiltracion && paso !== 24) {
                return;
            }

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // ── DROP (soltar sobre dropZone) ───────────────────────────
        this.scene.input.on('drop', (pointer, gameObject, dropZone) => {
            const paso       = this.stepManager.pasoActual;
            const keyA       = gameObject.texture.key;
            const keyD       = dropZone.texture.key;

            console.log(`[DragManager] drop: ${keyA} → ${keyD} (Paso ${paso})`);

            const rule = (window.DROP_RULES || []).find(r =>
                r.pasos.includes(paso) &&
                r.arrastrado === keyA &&
                r.destinos.includes(keyD)
            );

            let accionValida = false;

            if (rule) {
                // Resolver la acción (puede ser dinámica por paso)
                const accion = rule.resolver ? rule.resolver(paso) : rule.accion;

                // Obtener los datos (puede retornar null si el target no existe)
                const datos = rule.datos(gameObject, dropZone, this.scene);
                if (datos) {
                    accionValida = this.stepManager.validarAccion(accion, datos);
                    if (rule.post) rule.post(gameObject, dropZone, this.scene, accionValida);
                }
            }

            if (accionValida) {
                gameObject.dropped = true;
            } else {
                this.retornarObjeto(gameObject);
            }
        });

        // ── DRAG END (soltó sin dropZone) ─────────────────────────
        this.scene.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1.0);

            if (gameObject.dropped) return;

            const paso    = this.stepManager.pasoActual;
            const textura = gameObject.texture ? gameObject.texture.key : '';

            // 1. Verificar proximidad a las figuras de Lavar / Guardar en el canvas
            let closestTarget = null;
            let minDist = 100; // umbral de proximidad en px

            if (this.scene.sinkSprite) {
                const distSink = Phaser.Math.Distance.Between(
                    gameObject.x, gameObject.y, this.scene.sinkSprite.x, this.scene.sinkSprite.y
                );
                if (distSink < minDist) {
                    minDist = distSink;
                    closestTarget = 'LAVAR';
                }
            }

            if (this.scene.cabinetSprite) {
                const distCabinet = Phaser.Math.Distance.Between(
                    gameObject.x, gameObject.y, this.scene.cabinetSprite.x, this.scene.cabinetSprite.y
                );
                if (distCabinet < minDist) {
                    minDist = distCabinet;
                    closestTarget = 'GUARDAR';
                }
            }

            if (closestTarget) {
                const discardRule = (window.DISCARD_RULES || []).find(r =>
                    r.paso === paso && r.texturas.includes(textura)
                );

                if (discardRule) {
                    if (discardRule.destinoEsperado === closestTarget) {
                        gameObject.dropped = true;

                        // Limpiar referencia de escena antes de destruirlo
                        if (gameObject === this.scene.mezclaContainer) this.scene.mezclaContainer = null;
                        if (gameObject === this.scene.espatulaActiva) this.scene.espatulaActiva = null;
                        if (gameObject === this.scene.balanzaActiva) this.scene.balanzaActiva = null;
                        if (gameObject === this.scene.erlenmeyerActivo) this.scene.erlenmeyerActivo = null;
                        if (gameObject === this.scene.crisolActivo) this.scene.crisolActivo = null;
                        if (gameObject === this.scene.capsulaActiva) this.scene.capsulaActiva = null;

                        // Destruir el objeto
                        gameObject.destroy();

                        // Verificar si quedan otros objetos por descartar en este paso
                        const reglasPaso = (window.DISCARD_RULES || []).filter(r => r.paso === paso);
                        let quedanObjetos = false;

                        for (const r of reglasPaso) {
                            const objEnEscena = this.scene.children.list.find(o =>
                                o !== gameObject && o.texture && r.texturas.includes(o.texture.key)
                            );
                            if (objEnEscena) {
                                quedanObjetos = true;
                                break;
                            }
                        }

                        if (!quedanObjetos) {
                            // Todos los objetos requeridos para este paso se descartaron correctamente
                            this.stepManager.validarAccion(discardRule.accion, discardRule.datos(gameObject));
                        } else {
                            console.log("[DragManager] Objeto descartado correctamente. Aún quedan objetos por procesar en este paso.");
                        }
                        return;
                    } else {
                        console.warn(`[DragManager] Destino incorrecto. Se esperaba ${discardRule.destinoEsperado} pero se arrastró a ${closestTarget}`);
                        this.stepManager.mostrarFeedbackError();
                    }
                } else {
                    console.warn(`[DragManager] El objeto ${textura} no se puede descartar en el paso ${paso}.`);
                    this.stepManager.mostrarFeedbackError();
                }
            }

            // 2. Fallbacks de proximidad (cuando el dropZone no detecta la colisión)
            for (const fb of (window.FALLBACK_RULES || [])) {
                if (fb.paso !== paso || textura !== fb.texturaObjeto) continue;

                const destino = this.scene.children.list.find(
                    o => o.texture && o.texture.key === fb.texturaDestino
                );
                if (!destino) continue;

                const dist = Phaser.Math.Distance.Between(
                    gameObject.x, gameObject.y, destino.x, destino.y
                );
                if (dist > fb.distancia) continue;

                const exito = this.stepManager.validarAccion(fb.accion, fb.datos(gameObject, destino));
                if (exito) {
                    gameObject.dropped = true;
                    if (fb.post) fb.post(gameObject, destino);
                    return;
                }
            }

            // 3. Sin acción válida — dejar el objeto donde está
            this.retornarObjeto(gameObject);
        });
    }

    retornarObjeto(gameObject) {
        // Desactivado a pedido: los objetos se quedan donde se sueltan.
        // Si se requiere retorno animado, descomentar:
        /*
        if (gameObject.posicionOriginalX !== undefined) {
            this.scene.tweens.add({
                targets: gameObject,
                x: gameObject.posicionOriginalX,
                y: gameObject.posicionOriginalY,
                duration: 400,
                ease: 'Back.easeOut'
            });
        }
        */
    }
}