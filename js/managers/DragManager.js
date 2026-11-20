// ==========================================
// ARCHIVO: js/managers/DragManager.js
// Propósito: Controlar los eventos de arrastre con margen amplio de ubicación
//            (especialmente en el borde de la boca de los recipientes), feedback
//            visual de proximidad y animaciones de lavado/guardado.
// ==========================================

class DragManager {
    constructor(scene, stepManager) {
        this.scene = scene;
        this.stepManager = stepManager;
        this.indicadorBoca = this.scene.add.graphics();
        this.indicadorBoca.setDepth(999);
        this.initDragListeners();
    }

    /**
     * Verifica si un objeto tiene el arrastre bloqueado según el paso actual.
     */
    arrastreBloqueadoPorPaso(gameObject, paso) {
        if (!gameObject.input || !gameObject.input.draggable) return true;
        if (gameObject instanceof SoporteFiltracion && paso !== 24) return true;
        if (gameObject instanceof Balanza && paso !== 58) return true;
        if (gameObject.tieneCrisol !== undefined && paso !== 58) return true; // Desecador solo se arrastra en paso 58
        return false;
    }

    /**
     * Calcula si dos objetos están dentro del margen de interacción (incluyendo
     * el borde de la boca del recipiente destino y el pico/extremo del objeto arrastrado).
     */
    calcularDistanciaEnMargen(gameObject, destino, margenBase = 210) {
        if (!gameObject || !destino || gameObject === destino) return Infinity;

        const goW = gameObject.displayWidth || (gameObject.width * gameObject.scaleX) || 80;
        const goH = gameObject.displayHeight || (gameObject.height * gameObject.scaleY) || 100;
        const dzW = destino.displayWidth || (destino.width * destino.scaleX) || 100;
        const dzH = destino.displayHeight || (destino.height * destino.scaleY) || 120;

        // Puntos clave del objeto arrastrado: centro, extremo superior (boca/pico) y extremo inferior (base)
        const puntosArrastrado = [
            { x: gameObject.x, y: gameObject.y },
            { x: gameObject.x, y: gameObject.y - goH * 0.42 },
            { x: gameObject.x, y: gameObject.y + goH * 0.40 },
            { x: gameObject.x - goW * 0.35, y: gameObject.y - goH * 0.30 },
            { x: gameObject.x + goW * 0.35, y: gameObject.y - goH * 0.30 }
        ];

        // Puntos clave del destino: borde de la boca (centro, izq, der), centro del cuerpo y base
        const boca = this.scene.obtenerBocaReceptor
            ? this.scene.obtenerBocaReceptor(destino)
            : { x: destino.x, y: destino.y - dzH * 0.40, anchoBoca: dzW * 0.5 };

        const puntosDestino = [
            { x: boca.x, y: boca.y },                                     // Centro de la boca
            { x: boca.x - boca.anchoBoca * 0.45, y: boca.y },             // Borde izquierdo de la boca
            { x: boca.x + boca.anchoBoca * 0.45, y: boca.y },             // Borde derecho de la boca
            { x: boca.x, y: boca.y - 30 },                                // Zona inmediatamente sobre la boca
            { x: destino.x, y: destino.y },                               // Centro del recipiente
            { x: destino.x, y: destino.y + dzH * 0.25 }                   // Base (ej. Erlenmeyer en soporte)
        ];

        let minDistancia = Infinity;
        for (const pA of puntosArrastrado) {
            for (const pD of puntosDestino) {
                const d = Phaser.Math.Distance.Between(pA.x, pA.y, pD.x, pD.y);
                if (d < minDistancia) minDistancia = d;
            }
        }

        // También verificar superposición de cajas expandidas con margen generoso
        const margenCajaX = Math.max(85, dzW * 0.45);
        const margenCajaArriba = Math.max(115, dzH * 0.50);
        const rectDestino = new Phaser.Geom.Rectangle(
            destino.x - dzW * 0.5 - margenCajaX,
            destino.y - dzH * 0.5 - margenCajaArriba,
            dzW + margenCajaX * 2,
            dzH + margenCajaArriba + 70
        );
        const rectArrastrado = new Phaser.Geom.Rectangle(
            gameObject.x - goW * 0.45,
            gameObject.y - goH * 0.45,
            goW * 0.9,
            goH * 0.9
        );

        if (Phaser.Geom.Intersects.RectangleToRectangle(rectArrastrado, rectDestino)) {
            minDistancia = Math.min(minDistancia, margenBase * 0.65);
        }

        return minDistancia;
    }

    /**
     * Busca la mejor regla en DROP_RULES y el objeto destino dentro del margen de ubicación.
     */
    buscarInteraccionEnMargen(gameObject, paso, destinoPreferido = null) {
        if (!gameObject || !gameObject.texture) return null;
        const keyA = gameObject.texture.key;

        const reglasCandidatas = (window.DROP_RULES || []).filter(r =>
            r.pasos.includes(paso) && r.arrastrado === keyA
        );

        if (reglasCandidatas.length === 0) return null;

        // Si Phaser reportó un dropZone directo que coincide con una regla válida, priorizarlo
        if (destinoPreferido && destinoPreferido.texture) {
            const keyD = destinoPreferido.texture.key;
            const reglaDirecta = reglasCandidatas.find(r => r.destinos.includes(keyD));
            if (reglaDirecta) {
                return { rule: reglaDirecta, destino: destinoPreferido, distancia: 0 };
            }
        }

        // Buscar entre todos los objetos de la escena que estén dentro del margen de ubicación
        let mejorMatch = null;
        let mejorDist = Infinity;

        for (const rule of reglasCandidatas) {
            const margenPermitido = rule.margen || 220;
            const posiblesDestinos = this.scene.children.list.filter(o =>
                o !== gameObject &&
                o.visible !== false &&
                o.texture &&
                rule.destinos.includes(o.texture.key)
            );

            for (const cand of posiblesDestinos) {
                const dist = this.calcularDistanciaEnMargen(gameObject, cand, margenPermitido);
                if (dist <= margenPermitido && dist < mejorDist) {
                    mejorDist = dist;
                    mejorMatch = { rule, destino: cand, distancia: dist };
                }
            }
        }

        return mejorMatch;
    }

    /**
     * Dibuja un indicador luminoso en el borde de la boca del recipiente destino
     * cuando el usuario acerca el objeto arrastrado dentro del margen de ubicación.
     */
    actualizarIndicadorBoca(match) {
        this.indicadorBoca.clear();
        if (!match || !match.destino || !this.scene.obtenerBocaReceptor) return;

        const boca = this.scene.obtenerBocaReceptor(match.destino);
        this.scene.children.bringToTop(this.indicadorBoca);

        // Halo elíptico en el borde de la boca del recipiente
        this.indicadorBoca.lineStyle(2.5, 0x00e5ff, 0.85);
        this.indicadorBoca.strokeEllipse(boca.x, boca.y, boca.anchoBoca, 14);
        this.indicadorBoca.fillStyle(0x00e5ff, 0.16);
        this.indicadorBoca.fillEllipse(boca.x, boca.y, boca.anchoBoca, 14);
    }

    initDragListeners() {
        // ── DRAG START ─────────────────────────────────────────────
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            const paso = this.stepManager.pasoActual;
            if (this.arrastreBloqueadoPorPaso(gameObject, paso)) return;

            gameObject.posicionOriginalX = gameObject.x;
            gameObject.posicionOriginalY = gameObject.y;
            gameObject.dropped = false;
            gameObject.setAlpha(0.92);
            this.scene.children.bringToTop(gameObject);
        });

        // ── DRAG (mover y detectar margen de boca) ─────────────────
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const paso = this.stepManager.pasoActual;
            if (this.arrastreBloqueadoPorPaso(gameObject, paso)) return;

            gameObject.x = dragX;
            gameObject.y = dragY;

            // Si es la balanza en el paso 58, mover su visor digital con ella
            if (gameObject instanceof Balanza && gameObject.visorDigital) {
                gameObject.visorDigital.x = dragX + 60;
                gameObject.visorDigital.y = dragY - 3;
            }

            // Mostrar feedback visual si está en el margen de ubicación de un objetivo válido
            const match = this.buscarInteraccionEnMargen(gameObject, paso);
            this.actualizarIndicadorBoca(match);
        });

        // ── DROP (soltar sobre dropZone de Phaser) ─────────────────
        this.scene.input.on('drop', (pointer, gameObject, dropZone) => {
            const paso = this.stepManager.pasoActual;
            if (this.arrastreBloqueadoPorPaso(gameObject, paso)) return;
            if (gameObject.dropped) return;

            this.indicadorBoca.clear();

            const match = this.buscarInteraccionEnMargen(gameObject, paso, dropZone);
            if (match && this.ejecutarReglaMatch(match, gameObject)) {
                gameObject.dropped = true;
            }
        });

        // ── DRAG END (soltar en margen de ubicación o descarte) ────
        this.scene.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1.0);
            this.indicadorBoca.clear();

            const paso = this.stepManager.pasoActual;
            if (this.arrastreBloqueadoPorPaso(gameObject, paso)) return;
            if (gameObject.dropped) return;

            const textura = gameObject.texture ? gameObject.texture.key : '';

            // 1. Verificar proximidad con margen amplio a las figuras de Lavar / Guardar
            let closestTarget = null;
            let minDist = 145; // margen amplio en px para Lavar y Guardar

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
                        this.procesarDescarteAnimado(gameObject, discardRule, closestTarget, paso);
                        return;
                    } else {
                        console.warn(`[DragManager] Destino incorrecto. Se esperaba ${discardRule.destinoEsperado} pero se arrastró a ${closestTarget}`);
                        this.stepManager.mostrarFeedbackError();
                        return;
                    }
                } else {
                    console.warn(`[DragManager] El objeto ${textura} no se puede descartar en el paso ${paso}.`);
                    this.stepManager.mostrarFeedbackError();
                    return;
                }
            }

            // 2. Evaluar DROP_RULES con el margen amplio de ubicación (boca y cuerpo)
            const match = this.buscarInteraccionEnMargen(gameObject, paso);
            if (match && this.ejecutarReglaMatch(match, gameObject)) {
                gameObject.dropped = true;
                return;
            }

            // 3. Evaluar FALLBACK_RULES adicionales por compatibilidad
            for (const fb of (window.FALLBACK_RULES || [])) {
                if (fb.paso !== paso || textura !== fb.texturaObjeto) continue;

                const destino = this.scene.children.list.find(
                    o => o.texture && o.texture.key === fb.texturaDestino
                );
                if (!destino) continue;

                const dist = this.calcularDistanciaEnMargen(gameObject, destino, fb.distancia || 260);
                if (dist > (fb.distancia || 260)) continue;

                const exito = this.stepManager.validarAccion(fb.accion, fb.datos(gameObject, destino));
                if (exito) {
                    gameObject.dropped = true;
                    if (fb.post) fb.post(gameObject, destino);
                    return;
                }
            }

            // 4. Sin acción válida — dejar el objeto donde está
            this.retornarObjeto(gameObject);
        });
    }

    ejecutarReglaMatch(match, gameObject) {
        const { rule, destino } = match;
        const paso = this.stepManager.pasoActual;
        const accion = rule.resolver ? rule.resolver(paso) : rule.accion;
        const datos = rule.datos(gameObject, destino, this.scene);

        if (!datos) return false;

        const accionValida = this.stepManager.validarAccion(accion, datos);
        if (rule.post) {
            rule.post(gameObject, destino, this.scene, accionValida);
        }
        return accionValida;
    }

    procesarDescarteAnimado(gameObject, discardRule, closestTarget, paso) {
        if (gameObject.input) gameObject.input.draggable = false;

        const targetSprite = closestTarget === 'LAVAR' ? this.scene.sinkSprite : this.scene.cabinetSprite;
        const destX = targetSprite ? targetSprite.x : gameObject.x;
        const destY = targetSprite ? targetSprite.y : gameObject.y;

        // Marcar el objeto como en proceso de descarte para el conteo de objetos restantes
        gameObject.enDescarte = true;

        // Limpiar referencias globales de escena
        if (gameObject === this.scene.mezclaContainer) this.scene.mezclaContainer = null;
        if (gameObject === this.scene.espatulaActiva) this.scene.espatulaActiva = null;
        if (gameObject === this.scene.balanzaActiva) this.scene.balanzaActiva = null;
        if (gameObject === this.scene.erlenmeyerActivo) this.scene.erlenmeyerActivo = null;
        if (gameObject === this.scene.crisolActivo) this.scene.crisolActivo = null;
        if (gameObject === this.scene.capsulaActiva) this.scene.capsulaActiva = null;

        const datosAccion = discardRule.datos(gameObject);

        // Si es LAVAR, mostrar chorrito de agua en la pileta
        if (closestTarget === 'LAVAR' && this.scene.animarChorro) {
            this.scene.animarChorro(destX, destY - 28, destX, destY + 12, 0x00e5ff, 'rocio', 380);
        }

        this.scene.tweens.add({
            targets: gameObject,
            x: destX,
            y: destY,
            angle: closestTarget === 'LAVAR' ? 25 : 0,
            scaleX: gameObject.scaleX * 0.25,
            scaleY: gameObject.scaleY * 0.25,
            alpha: 0.1,
            duration: 360,
            ease: 'Back.easeIn',
            onComplete: () => {
                if (gameObject.scene) gameObject.destroy();

                // Verificar si quedan otros objetos por descartar en este paso
                const reglasPaso = (window.DISCARD_RULES || []).filter(r => r.paso === paso);
                let quedanObjetos = false;

                for (const r of reglasPaso) {
                    const objEnEscena = this.scene.children.list.find(o =>
                        o !== gameObject &&
                        !o.enDescarte &&
                        o.visible !== false &&
                        o.texture &&
                        r.texturas.includes(o.texture.key)
                    );
                    if (objEnEscena) {
                        quedanObjetos = true;
                        break;
                    }
                }

                if (!quedanObjetos) {
                    this.stepManager.validarAccion(discardRule.accion, datosAccion);
                } else {
                    console.log("[DragManager] Objeto descartado con animación. Aún quedan objetos en este paso.");
                }
            }
        });
    }

    retornarObjeto(gameObject) {
        // Los objetos se quedan donde se sueltan en la mesa de trabajo
    }
}
