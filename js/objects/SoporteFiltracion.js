// ==========================================
// ARCHIVO: js/objects/SoporteFiltracion.js
// Propósito: Definir la clase para el Soporte Universal y el ensamblado de filtración
//            con correspondencia exacta de texturas en cada paso (12 al 24).
// ==========================================

class SoporteFiltracion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, TX.SOPORTE_ICONO);

        scene.add.existing(this);

        this.setScale(0.9);
        this.setInteractive({ cursor: 'pointer' });
        scene.input.setDraggable(this);

        // Habilitar como dropZone con un hitArea generoso
        this.input.dropZone = true;
        this.input.hitArea = new Phaser.Geom.Rectangle(-100, -100, this.width + 200, this.height + 200);
        this.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;

        this.estadoEnsamble = 0;
        this.erlenmeyerVinculado = null;

        this.on('pointerdown', this.onSoporteClick, this);
    }

    // Paso 12: Soporte + Aro (sin Erlenmeyer)
    agregarAro() {
        this.estadoEnsamble = 1;
        this.setTexture(TX.SOPORTE_ARO);
        console.log("[SoporteFiltracion] Aro de embudo colocado.");
    }

    // Paso 13: Soporte + Aro + Erlenmeyer vacío en la base
    colocarErlenmeyer(erlenmeyer) {
        if (erlenmeyer) {
            if (erlenmeyer === this.scene.erlenmeyerActivo) {
                this.scene.erlenmeyerActivo = null;
            }
            erlenmeyer.destroy();
        }
        this.erlenmeyerVinculado = null;
        this.estadoEnsamble = 2;
        this.setTexture(TX.SOPORTE_ARO_ERLENMEYER);
        console.log("[SoporteFiltracion] Erlenmeyer colocado en la base del soporte.");
    }

    agregarEmbudo() {
        this.estadoEnsamble = 2;
        this.setTexture(TX.SOPORTE_EMBUDO);
    }

    // Paso 16a: Soporte + Aro + Erlenmeyer + Embudo con papel de filtro
    agregarFiltro() {
        this.estadoEnsamble = 3;
        this.setTexture(TX.SOPORTE_FILTRO);
        console.log("[SoporteFiltracion] Embudo con papel de filtro colocado en el aro.");
    }

    adherirFiltro() {
        this.estadoEnsamble = 4;
    }

    // Paso 16b: Soporte + Aro + Erlenmeyer + Embudo + Filtro + Varilla vigilante
    agregarVigilante() {
        this.estadoEnsamble = 5;
        this.setTexture(TX.SOPORTE_VIGILANTE);
        console.log("[SoporteFiltracion] Vigilante (varilla de vidrio) colocado sobre el embudo.");
    }

    // Paso 17: Se filtra el líquido azul; el vigilante sigue puesto para lavarse en el Paso 18 y la arena sigue en el vaso
    comenzarFiltrado() {
        this.estadoEnsamble = 6;
        this.setTexture(TX.SOPORTE_SOLUCION);

        if (this.scene.animarChorro) {
            this.scene.animarChorro(this.x - 6, this.y - 10, this.x - 6, this.y + 85, 0x0288d1, 'liquido', 1400);
        }
        console.log("[SoporteFiltracion] Solución líquida filtrada al Erlenmeyer (varilla en espera de lavado).");
    }

    // Paso 18: Se lava la varilla con piseta, se retira del embudo a la mesa y queda el embudo sin varilla
    lavarVarilla() {
        this.estadoEnsamble = 6;
        this.setTexture(TX.SOPORTE_FILTRANDO);
        console.log("[SoporteFiltracion] Varilla lavada y retirada a la mesa.");

        const yaExisteVarilla = this.scene.children.list.find(o => o.texture && o.texture.key === TX.VARILLA);
        if (!yaExisteVarilla) {
            const varillaLimpia = this.scene.add.sprite(
                this.x + 15,
                this.y - 95,
                TX.VARILLA
            ).setScale(0.25).setInteractive({ cursor: 'grab' });
            this.scene.input.setDraggable(varillaLimpia);
            varillaLimpia.input.dropZone = true;

            this.scene.tweens.add({
                targets: varillaLimpia,
                x: this.scene.scale.width * 0.38,
                y: this.scene.scale.height * 0.60,
                duration: 450,
                ease: 'Back.easeOut'
            });
        }
    }

    // Paso 19: Se trasvasa la arena húmeda del vaso al filtro con ayuda de la piseta
    trasvasarArena() {
        this.estadoEnsamble = 7;
        this.setTexture(TX.SOPORTE_ARENA_1);
        console.log("[SoporteFiltracion] Arena trasvasada al papel de filtro.");
    }

    // Paso 20: Se lava la arena en el filtro con la piseta; sube el nivel del filtrado en el Erlenmeyer
    lavarFiltroFinal(callback) {
        this.estadoEnsamble = 8;

        if (this.scene.animarChorro) {
            this.scene.animarChorro(this.x - 6, this.y - 10, this.x - 6, this.y + 85, 0x29b6f6, 'liquido', 1100);
        }

        this.scene.time.delayedCall(1000, () => {
            if (!this.scene) return;
            this.setTexture(TX.SOPORTE_ARENA_2);
            console.log("[SoporteFiltracion] Lavado del filtro con arena finalizado.");
            if (callback) callback();
        });
    }

    // Paso 23: Retirar el Erlenmeyer de la base del soporte, dejando el soporte solo con el aro
    retirarErlenmeyerDeBase() {
        this.setTexture(TX.SOPORTE_ARO);
        this.estadoEnsamble = 1;

        if (!this.scene.erlenmeyerActivo || !this.scene.erlenmeyerActivo.scene) {
            // Spawnear el Erlenmeyer vertical con 100 mL de solución azul ('Vaso + solucion final')
            const erlenmeyerConSolucion = this.scene.add.sprite(
                this.x + 15,
                this.y + 115,
                TX.VASO_SOLUCION_FINAL
            ).setScale(0.72).setInteractive({ cursor: 'grab' });
            this.scene.input.setDraggable(erlenmeyerConSolucion);
            this.scene.erlenmeyerActivo = erlenmeyerConSolucion;

            this.scene.tweens.add({
                targets: erlenmeyerConSolucion,
                x: this.scene.scale.width * 0.45,
                y: this.scene.scale.height * 0.56,
                duration: 460,
                ease: 'Back.easeOut'
            });
        } else {
            this.scene.erlenmeyerActivo.setTexture(TX.VASO_SOLUCION_FINAL);
            this.scene.erlenmeyerActivo.setScale(0.72);
            this.scene.tweens.add({
                targets: this.scene.erlenmeyerActivo,
                x: this.scene.scale.width * 0.45,
                y: this.scene.scale.height * 0.56,
                duration: 460,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (this.scene.erlenmeyerActivo && this.scene.erlenmeyerActivo.input) {
                        this.scene.erlenmeyerActivo.input.draggable = true;
                    }
                }
            });
        }
    }

    onSoporteClick() {
        const paso = this.scene.stepManager.pasoActual;

        if (paso === 22) {
            if (!this.scene.filtroConArena) {
                // Cambiar el soporte al estado donde se retiraron el embudo y el filtro, quedando el Erlenmeyer con solución en la base
                this.setTexture(TX.SOPORTE_FINAL);
                this.estadoEnsamble = 1;

                // Crear el papel de filtro con arena saliendo hacia la mesa
                this.scene.filtroConArena = this.scene.add.sprite(
                    this.x + 10,
                    this.y - 55,
                    TX.FILTRO_ARENA
                ).setScale(0.30).setInteractive({ cursor: 'grab' });
                this.scene.input.setDraggable(this.scene.filtroConArena);

                this.scene.tweens.add({
                    targets: this.scene.filtroConArena,
                    x: this.scene.scale.width * 0.42,
                    y: this.scene.scale.height * 0.55,
                    duration: 460,
                    ease: 'Back.easeOut'
                });

                // Crear el embudo limpio saliendo hacia la mesa para ser llevado a LAVAR
                const embudoSuelto = this.scene.add.sprite(
                    this.x + 10,
                    this.y - 35,
                    TX.EMBUDO
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.scene.input.setDraggable(embudoSuelto);

                this.scene.tweens.add({
                    targets: embudoSuelto,
                    x: this.x + 140,
                    y: this.y + 10,
                    duration: 440,
                    ease: 'Back.easeOut'
                });

                console.log("[SoporteFiltracion] Filtro con arena y embudo retirados a la mesa. Queda Erlenmeyer en la base.");
            }
        } else if (paso === 23) {
            this.scene.stepManager.validarAccion('RETIRAR_ERLENMEYER', { soporte: this });
        }
    }

    actualizarHitArea() {
        if (this.input && this.input.hitArea) {
            this.input.hitArea.setTo(-100, -100, this.width + 200, this.height + 200);
        }
    }

    setTexture(key, frame) {
        super.setTexture(key, frame);
        this.actualizarHitArea();
        return this;
    }
}
