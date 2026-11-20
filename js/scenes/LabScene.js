// ==========================================
// ARCHIVO: js/scenes/LabScene.js
// Propósito: Definir la escena principal, instanciar los objetos modulares y proveer
//            las animaciones físicas de interacción (efecto de volque en borde de boca,
//            chorros de líquido/sólido, colocación suave, agitación y calcinación).
// ==========================================

class LabScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LabScene' });
    }

    create() {
        console.log("[LabScene] Escena de laboratorio iniciada.");

        // Registrar escena globalmente para interactuar con la toolbar HTML en main.js
        window.escenaLaboratorio = this;

        // Inicializar managers principales
        this.stepManager = new StepManager(this);
        this.dragManager = new DragManager(this, this.stepManager);

        // Variables de referencias
        this.balanzaActiva = null;
        this.espatulaActiva = null;
        this.mezclaContainer = null;
        this.erlenmeyerActivo = null;
        this.crisolActivo = null;
        this.capsulaActiva = null;
        this.filtroConArena = null;

        // Agregar figuras de descarte (Lavar y Guardar)
        const width = this.scale.width;

        // Lavar (Pileta)
        this.sinkSprite = this.add.sprite(width - 230, 75, 'pileta_lavar').setScale(0.18);
        this.sinkText = this.add.text(width - 230, 140, 'LAVAR', {
            fontFamily: '"Courier New", monospace',
            fontSize: '15px',
            color: '#00e5ff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Guardar (Estante)
        this.cabinetSprite = this.add.sprite(width - 80, 75, 'estante_guardar').setScale(0.18);
        this.cabinetText = this.add.text(width - 80, 140, 'GUARDAR', {
            fontFamily: '"Courier New", monospace',
            fontSize: '15px',
            color: '#ff007f',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }

    // ── ANIMACIONES DE INTERACCIÓN FÍSICA ───────────────────────────────────

    /**
     * Calcula la posición del borde de la boca (parte superior) de un objeto receptor.
     */
    obtenerBocaReceptor(receptor, opciones = {}) {
        if (!receptor) return { x: this.scale.width * 0.5, y: this.scale.height * 0.5 };

        const dispW = receptor.displayWidth || (receptor.width * receptor.scaleX) || 100;
        const dispH = receptor.displayHeight || (receptor.height * receptor.scaleY) || 120;

        let offsetX = opciones.offsetBocaX !== undefined ? opciones.offsetBocaX : 0;
        let offsetY = opciones.offsetBocaY;

        if (offsetY === undefined) {
            if (receptor instanceof SoporteFiltracion) {
                // La boca del embudo en el soporte está en el tercio superior
                offsetY = -dispH * 0.16;
                offsetX = -8;
            } else if (receptor instanceof Capsula || (receptor.texture && receptor.texture.key === TX.CAPSULA)) {
                offsetY = -dispH * 0.30;
            } else {
                // Vaso, Probeta, Embudo, Crisol, etc.
                offsetY = -dispH * 0.42;
            }
        }

        return {
            x: receptor.x + offsetX,
            y: receptor.y + offsetY,
            anchoBoca: Math.max(36, dispW * 0.55),
            dispW,
            dispH
        };
    }

    /**
     * Anima el "efecto de volque" donde el borde/pico del objeto emisor toca el borde
     * de la boca del objeto receptor, pivota sobre ese punto de contacto inclinándose,
     * vierte su contenido (líquido o sólido) y luego se endereza y regresa a su lugar.
     */
    animarVolcadoEnBoca(emisor, receptor, opciones = {}) {
        if (!emisor || !receptor || !emisor.scene) {
            if (opciones.onMitadVolcado) opciones.onMitadVolcado();
            if (opciones.onFinVolcado) opciones.onFinVolcado();
            return;
        }

        const boca = this.obtenerBocaReceptor(receptor, opciones);

        // Determinar de qué lado del borde de la boca se ubica el emisor
        // (-1 = borde izquierdo, inclinándose hacia la derecha; +1 = borde derecho, inclinándose hacia la izquierda)
        let lado = opciones.forzarLado !== undefined
            ? opciones.forzarLado
            : (emisor.x <= boca.x ? -1 : 1);

        const anguloMax = opciones.anguloVolcado || 68;
        const duracionVertido = opciones.duracionVertido || 850;
        const colorChorro = opciones.colorChorro !== undefined ? opciones.colorChorro : 0x55ccff;
        const tipoChorro = opciones.tipoChorro || 'liquido';

        // Distancia desde el centro del emisor hasta su boca/punta superior
        const emisorH = emisor.displayHeight || (emisor.height * emisor.scaleY) || 120;
        const radioPivote = opciones.radioPivote !== undefined
            ? opciones.radioPivote
            : Math.min(Math.max(emisorH * 0.40, 32), 105);

        // Punto exacto en el borde de la boca del receptor donde apoya el pico del emisor
        const rimX = boca.x + (lado * Math.min(boca.anchoBoca * 0.32, 26));
        const rimY = boca.y;

        // Posición de retorno luego de volcar
        const destinoFinal = opciones.destinoFinal || {
            x: Phaser.Math.Clamp(receptor.x + (lado * 135), 90, this.scale.width - 90),
            y: Phaser.Math.Clamp(receptor.y + 15, 180, this.scale.height - 70)
        };

        if (emisor.input) emisor.input.draggable = false;
        this.children.bringToTop(emisor);

        // Posición del centro del emisor cuando su boca toca (rimX, rimY) con un ángulo inicial suave
        const anguloInicial = -lado * 18;
        const radIni = Phaser.Math.DegToRad(anguloInicial);
        const startPivotX = rimX - radioPivote * Math.sin(radIni);
        const startPivotY = rimY + radioPivote * Math.cos(radIni);

        // Efecto visual de contacto en el borde de la boca
        const haloBoca = this.add.graphics();
        haloBoca.lineStyle(2.5, 0x00e5ff, 0.75);
        haloBoca.strokeEllipse(boca.x, boca.y, boca.anchoBoca * 0.85, 12);
        this.tweens.add({
            targets: haloBoca,
            alpha: 0,
            duration: 600,
            onComplete: () => haloBoca.destroy()
        });

        // FASE 1: Acercar el pico del emisor hasta tocar el borde de la boca del receptor
        this.tweens.add({
            targets: emisor,
            x: startPivotX,
            y: startPivotY,
            angle: anguloInicial,
            duration: 280,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (!emisor.scene) return;

                // FASE 2: Efecto de volque pivotando sobre el borde de la boca (rimX, rimY)
                const anguloObjetivo = -lado * anguloMax;
                const state = { ang: anguloInicial };

                this.tweens.add({
                    targets: state,
                    ang: anguloObjetivo,
                    duration: 380,
                    ease: 'Sine.easeInOut',
                    onUpdate: () => {
                        if (!emisor.scene) return;
                        const r = Phaser.Math.DegToRad(state.ang);
                        emisor.angle = state.ang;
                        emisor.x = rimX - radioPivote * Math.sin(r);
                        emisor.y = rimY + radioPivote * Math.cos(r);
                    },
                    onComplete: () => {
                        if (!emisor.scene) return;

                        // FASE 3: Vertido activo con chorro/partículas y leve vaivén sobre el borde
                        const destinoChorroY = rimY + Math.min((boca.dispH || 100) * 0.48, 70);
                        this.animarChorro(rimX, rimY + 2, boca.x, destinoChorroY, colorChorro, tipoChorro, duracionVertido);

                        // Ejecutar el cambio de estado/textura a mitad del volcado
                        this.time.delayedCall(Math.floor(duracionVertido * 0.45), () => {
                            if (opciones.onMitadVolcado) opciones.onMitadVolcado();
                        });

                        const bobState = { ang: anguloObjetivo };
                        this.tweens.add({
                            targets: bobState,
                            ang: anguloObjetivo - (lado * 6),
                            duration: Math.floor(duracionVertido / 4),
                            yoyo: true,
                            repeat: 1,
                            ease: 'Sine.easeInOut',
                            onUpdate: () => {
                                if (!emisor.scene) return;
                                const r = Phaser.Math.DegToRad(bobState.ang);
                                emisor.angle = bobState.ang;
                                emisor.x = rimX - radioPivote * Math.sin(r);
                                emisor.y = rimY + radioPivote * Math.cos(r);
                            },
                            onComplete: () => {
                                if (!emisor.scene) return;

                                // FASE 4: Des-inclinar y regresar suavemente a la mesa
                                this.tweens.add({
                                    targets: emisor,
                                    angle: 0,
                                    x: destinoFinal.x,
                                    y: destinoFinal.y,
                                    duration: 460,
                                    ease: 'Back.easeOut',
                                    onComplete: () => {
                                        if (emisor.scene && emisor.input) {
                                            emisor.input.draggable = opciones.mantenerBloqueado ? false : true;
                                        }
                                        if (opciones.onFinVolcado) opciones.onFinVolcado();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * Dibuja y anima el chorro de líquido, rocío de piseta o caída de granos sólidos
     * desde el borde de la boca hacia el interior del recipiente receptor.
     */
    animarChorro(x1, y1, x2, y2, color = 0x55ccff, tipo = 'liquido', duracion = 800) {
        const gfx = this.add.graphics();
        this.children.bringToTop(gfx);

        const startTime = this.time.now;
        const timer = this.time.addEvent({
            delay: 30,
            repeat: Math.floor(duracion / 30),
            callback: () => {
                gfx.clear();
                const elapsed = this.time.now - startTime;
                const progress = Phaser.Math.Clamp(elapsed / duracion, 0, 1);

                if (tipo === 'solido') {
                    // Granos sólidos cayendo desde el borde de la boca
                    for (let i = 0; i < 9; i++) {
                        const t = ((progress * 3 + i * 0.13) % 1);
                        const gx = Phaser.Math.Linear(x1, x2, t) + Math.sin(i * 2.5 + elapsed * 0.02) * 5;
                        const gy = Phaser.Math.Linear(y1, y2, t * t);
                        const grainColor = (i % 2 === 0) ? color : 0xd7ccc8;
                        gfx.fillStyle(grainColor, 0.9);
                        gfx.fillCircle(gx, gy, (i % 3 === 0) ? 3.2 : 2.3);
                    }
                } else {
                    // Chorro continuo curvo + gotas + ondas en la superficie
                    gfx.lineStyle(tipo === 'rocio' ? 3 : 4.5, color, 0.78);
                    gfx.beginPath();
                    gfx.moveTo(x1, y1);
                    const ctrlX = (x1 + x2) * 0.5 + Math.sin(elapsed * 0.03) * 3;
                    const ctrlY = y1 + (y2 - y1) * 0.35;
                    for (let step = 1; step <= 10; step++) {
                        const st = step / 10;
                        const px = (1 - st) * (1 - st) * x1 + 2 * (1 - st) * st * ctrlX + st * st * x2;
                        const py = (1 - st) * (1 - st) * y1 + 2 * (1 - st) * st * ctrlY + st * st * y2;
                        gfx.lineTo(px, py);
                    }
                    gfx.strokePath();

                    // Gotas dinámicas
                    gfx.fillStyle(color, 0.9);
                    for (let i = 0; i < 5; i++) {
                        const gt = ((progress * 2.6 + i * 0.2) % 1);
                        const gx = Phaser.Math.Linear(x1, x2, gt) + Math.cos(i + elapsed * 0.02) * 3;
                        const gy = Phaser.Math.Linear(y1, y2, gt);
                        gfx.fillCircle(gx, gy, 2.8);
                    }

                    // Pequeña onda donde impacta el líquido dentro del recipiente
                    const rippleR = 4 + ((elapsed * 0.04) % 10);
                    gfx.lineStyle(1.5, color, 0.55);
                    gfx.strokeEllipse(x2, y2, rippleR * 2, rippleR * 0.6);
                }
            }
        });

        this.time.delayedCall(duracion + 40, () => {
            timer.remove(false);
            gfx.destroy();
        });
    }

    /**
     * Anima la aproximación de un objeto a la boca/parte superior de un destino y su descenso suave.
     */
    animarColocacionEnBoca(objeto, destinoX, destinoY, opciones = {}) {
        if (!objeto || !objeto.scene) {
            if (opciones.onComplete) opciones.onComplete();
            return;
        }

        const alturaArco = opciones.alturaArco !== undefined ? opciones.alturaArco : 55;
        const duracion = opciones.duracion || 450;

        if (objeto.input) objeto.input.draggable = false;
        this.children.bringToTop(objeto);

        this.tweens.add({
            targets: objeto,
            x: destinoX,
            y: destinoY - alturaArco,
            angle: opciones.anguloIntermedio || 0,
            duration: Math.floor(duracion * 0.52),
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (!objeto.scene) {
                    if (opciones.onComplete) opciones.onComplete();
                    return;
                }
                this.tweens.add({
                    targets: objeto,
                    x: destinoX,
                    y: destinoY,
                    angle: 0,
                    scaleX: opciones.escalaFinal !== undefined ? opciones.escalaFinal : objeto.scaleX,
                    scaleY: opciones.escalaFinal !== undefined ? opciones.escalaFinal : objeto.scaleY,
                    duration: Math.floor(duracion * 0.48),
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        if (opciones.onComplete) opciones.onComplete();
                    }
                });
            }
        });
    }

    /**
     * Anima una llama de mechero Bunsen y humo durante la calcinación en el Paso 32,
     * acercando además la pinza metálica al borde del crisol para verificar las cenizas.
     */
    animarLlamaYCalcinacion(calentamiento, onComplete) {
        if (!calentamiento || !calentamiento.scene) {
            if (onComplete) onComplete();
            return;
        }

        const flameGfx = this.add.graphics();
        this.children.bringToTop(flameGfx);

        const baseX = calentamiento.x;
        const baseY = calentamiento.y + 10;
        const topCrisolY = calentamiento.y - 75;

        // Si hay pinza en escena, animarla acercándose al borde de la boca del crisol
        const pinza = this.children.list.find(o => o.texture && o.texture.key === TX.PINZA);
        if (pinza) {
            this.children.bringToTop(pinza);
            const origX = pinza.x;
            const origY = pinza.y;
            this.tweens.add({
                targets: pinza,
                x: baseX + 55,
                y: topCrisolY - 15,
                angle: -35,
                duration: 600,
                yoyo: true,
                hold: 900,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    if (pinza.scene) {
                        pinza.angle = 0;
                        pinza.x = origX;
                        pinza.y = origY;
                    }
                }
            });
        }

        const startTime = this.time.now;
        const duracion = 2000;
        const timer = this.time.addEvent({
            delay: 40,
            repeat: Math.floor(duracion / 40),
            callback: () => {
                flameGfx.clear();
                const elapsed = this.time.now - startTime;
                const flicker = Math.sin(elapsed * 0.05) * 4;

                // Llama externa naranja/amarilla
                flameGfx.fillStyle(0xff9800, 0.75);
                flameGfx.fillEllipse(baseX + flicker * 0.3, baseY - 22, 22, 42 + flicker);

                // Cono interno azul oxidante del mechero Bunsen
                flameGfx.fillStyle(0x00e5ff, 0.85);
                flameGfx.fillEllipse(baseX, baseY - 14, 12, 24);

                // Humo blanco de calcinación del papel de filtro saliendo de la boca del crisol
                for (let i = 0; i < 4; i++) {
                    const st = ((elapsed * 0.0012 + i * 0.25) % 1);
                    const sx = baseX + Math.sin(st * 6 + i) * 14;
                    const sy = topCrisolY - st * 55;
                    flameGfx.fillStyle(0xeeeeee, (1 - st) * 0.55);
                    flameGfx.fillCircle(sx, sy, 6 + st * 10);
                }
            }
        });

        this.time.delayedCall(duracion, () => {
            timer.remove(false);
            flameGfx.destroy();
            if (onComplete) onComplete();
        });
    }

    // ── CREACIÓN DE OBJETOS EN LA MESA ──────────────────────────────────────

    aparecerObjeto(claveImagen) {
        console.log("[LabScene] Spawning en mesa: " + claveImagen);

        let nuevoObjeto;

        switch (claveImagen) {
            case 'Balanza analítica':
                nuevoObjeto = new Balanza(
                    this,
                    this.scale.width * 0.82,
                    this.scale.height * 0.80
                );
                this.balanzaActiva = nuevoObjeto;
                break;

            case 'Vaso de precipitados 250 ml':
                nuevoObjeto = new Vaso(
                    this,
                    this.scale.width * 0.25,
                    this.scale.height * 0.55
                );
                break;

            case 'Espatula de metal':
                nuevoObjeto = new Espatula(
                    this,
                    this.scale.width * 0.35,
                    this.scale.height * 0.55
                );
                this.espatulaActiva = nuevoObjeto;
                break;

            case 'Vaso con Mezcla':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    claveImagen
                ).setScale(0.3).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;
                this.mezclaContainer = nuevoObjeto;

                // Si es el paso 3, este spawn valida el paso
                if (this.stepManager.pasoActual === 3) {
                    this.stepManager.validarAccion('SPAWN_MEZCLA_CONTAINER', { vasoMezcla: nuevoObjeto });
                }
                break;

            case 'Probeta graduada':
                nuevoObjeto = new Probeta(
                    this,
                    this.scale.width * 0.30,
                    this.scale.height * 0.55
                );
                break;

            case 'Varilla de vidrio':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.40,
                    this.scale.height * 0.55,
                    'Varilla de vidrio'
                ).setScale(0.25).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;
                break;

            case 'Soporte Universal':
                nuevoObjeto = new SoporteFiltracion(
                    this,
                    this.scale.width * 0.14,
                    this.scale.height * 0.68
                );
                break;

            case 'Soporte y Embudo': // Aro para embudo
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.28,
                    this.scale.height * 0.55,
                    'Soporte para embudo'
                ).setScale(0.25).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Erlenmeyer':
            case 'Ernlenmeyer':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.45,
                    this.scale.height * 0.55,
                    'Erlenmeyer'
                ).setScale(0.35).setInteractive({ cursor: 'pointer' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;

                // Habilitar clic para retirar en el paso 23
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 23) {
                        this.stepManager.validarAccion('RETIRAR_ERLENMEYER', { erlenmeyer: nuevoObjeto });
                    }
                });

                this.erlenmeyerActivo = nuevoObjeto;
                break;

            case 'Papel de filtro':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.50,
                    this.scale.height * 0.55,
                    TX.FILTRO_1
                ).setScale(0.26).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Soporte universal y embudo': // Embudo de vidrio
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    'Embudo'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                nuevoObjeto.input.dropZone = true;
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Piseta con agua':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.42,
                    this.scale.height * 0.55,
                    'Piseta'
                ).setScale(0.15).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Crisol de metal':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.28,
                    this.scale.height * 0.55,
                    'Crisol'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;
                this.crisolActivo = nuevoObjeto;
                break;

            case 'Mechero y Trípode': // Trípode de hierro
                nuevoObjeto = new EquipoCalentamiento(
                    this,
                    this.scale.width * 0.58,
                    this.scale.height * 0.58
                );
                break;

            case 'Mechero bunsen':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.38,
                    this.scale.height * 0.55,
                    'Mechero'
                ).setScale(0.35).setInteractive({ cursor: 'pointer' });
                this.input.setDraggable(nuevoObjeto);

                // Si estamos en el paso 30 y ya existe el equipo de calentamiento, montar con animación o permitir arrastrar
                if (this.stepManager.pasoActual === 30) {
                    const calentamiento = this.children.list.find(c => c instanceof EquipoCalentamiento);
                    if (calentamiento) {
                        this.stepManager.validarAccion('SPAWN_MECHERO', {
                            mechero: nuevoObjeto,
                            calentamiento: calentamiento
                        });
                    }
                }

                // Permitir encendido si se clickea en el paso 32
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 32) {
                        const calentamiento = this.children.list.find(c => c instanceof EquipoCalentamiento);
                        if (calentamiento) {
                            this.stepManager.validarAccion('CALCINAR_ARENA', { calentamiento: calentamiento });
                        }
                    }
                });
                break;

            case 'Pinza de metal':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.48,
                    this.scale.height * 0.55,
                    'Pinza metalica'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);

                // Si es el paso 31, este spawn valida el paso
                if (this.stepManager.pasoActual === 31) {
                    this.stepManager.validarAccion('SPAWN_PINZAS', { pinza: nuevoObjeto });
                }
                break;

            case 'Desecador de Silicagel':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.68,
                    this.scale.height * 0.52,
                    'Desecador'
                ).setScale(0.55).setInteractive({ cursor: 'pointer' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;
                nuevoObjeto.tieneCrisol = false;
                nuevoObjeto.tieneCapsula = false;

                // Detectar clics para retirar crisol (paso 51) o cápsula (paso 55)
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 51 && nuevoObjeto.tieneCrisol) {
                        this.stepManager.validarAccion('RETIRAR_CRISOL_DESECADOR', {
                            desecador: nuevoObjeto,
                            balanza: this.balanzaActiva
                        });
                    } else if (paso === 55 && nuevoObjeto.tieneCapsula) {
                        this.stepManager.validarAccion('RETIRAR_CAPSULA_DESECADOR', {
                            desecador: nuevoObjeto,
                            balanza: this.balanzaActiva
                        });
                    }
                });

                // Si es el paso 34, este spawn valida el paso
                if (this.stepManager.pasoActual === 34) {
                    this.stepManager.validarAccion('SPAWN_DESECADOR', { desecador: nuevoObjeto });
                }
                break;

            case 'Cápsula de porcelana':
                nuevoObjeto = new Capsula(
                    this,
                    this.scale.width * 0.32,
                    this.scale.height * 0.55
                );
                break;

            case 'Baño Termostático':
            case 'Baño termostático':
                nuevoObjeto = new AparatoEvaporacion(
                    this,
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    'banio'
                );
                break;

            case 'Estufa de secado':
                nuevoObjeto = new AparatoEvaporacion(
                    this,
                    this.scale.width * 0.68,
                    this.scale.height * 0.52,
                    'estufa'
                );
                break;

            default:
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.40,
                    this.scale.height * 0.55,
                    claveImagen
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;
        }

        // Animación suave de aparición en la mesa
        if (nuevoObjeto && nuevoObjeto.scene) {
            const targetScaleX = nuevoObjeto.scaleX;
            const targetScaleY = nuevoObjeto.scaleY;
            nuevoObjeto.setScale(targetScaleX * 0.7, targetScaleY * 0.7);
            this.tweens.add({
                targets: nuevoObjeto,
                scaleX: targetScaleX,
                scaleY: targetScaleY,
                duration: 240,
                ease: 'Back.easeOut'
            });
        }

        return nuevoObjeto;
    }

    aparecerObjetoPorAlt(alt) {
        const mappingAltAClave = {
            'Vaso de precipitados': 'Vaso de precipitados 250 ml',
            'Espátula': 'Espatula de metal',
            'Mezcla': 'Vaso con Mezcla',
            'Desecador': 'Desecador de Silicagel',
            'Soporte para embudo': 'Soporte y Embudo',
            'Embudo': 'Soporte universal y embudo',
            'Trípode de hierro': 'Mechero y Trípode',
            'Triángulo refractario': 'Triangulo refractario',
            'Baño termostático': 'Baño Termostático'
        };

        let claveObjeto = mappingAltAClave[alt] || alt;

        this.aparecerObjeto(claveObjeto);
    }
}
