// ==========================================
// ARCHIVO: js/objects/SoporteFiltracion.js
// Propósito: Definir la clase para el Soporte Universal y el ensamblado de filtración
// ==========================================

class SoporteFiltracion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Soporte Universal (icono)');

        // Agregar a la escena
        scene.add.existing(this);

        // Configurar escala y arrastre inicial
        this.setScale(0.9);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);

        // Habilitar como dropZone para recibir los ensamblajes con un hitArea generoso
        this.input.dropZone = true;
        this.input.hitArea = new Phaser.Geom.Rectangle(-100, -100, this.width + 200, this.height + 200);
        this.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;

        // Estados: 
        // 0: Soporte vacío
        // 1: Con Aro (Soporte Universal + soporte embudo)
        // 2: Con Embudo
        // 3: Con Filtro seco
        // 4: Con Filtro mojado
        // 5: Con Vigilante (varilla)
        // 6: Filtrando (con solución)
        // 7: Con Arena en filtro
        // 8: Solución filtrada completada
        this.estadoEnsamble = 0;

        this.erlenmeyerVinculado = null;

        this.on('pointerdown', this.onSoporteClick, this);
    }

    agregarAro() {
        this.estadoEnsamble = 1;
        this.setTexture('Soporte Universal + soporte embudo');
        console.log("[SoporteFiltracion] Aro de embudo colocado.");
    }

    agregarEmbudo() {
        this.estadoEnsamble = 2;
        this.setTexture('Soporte Universal + soporte embudo + embudo');
        console.log("[SoporteFiltracion] Embudo colocado.");
    }

    agregarFiltro() {
        this.estadoEnsamble = 3;
        this.setTexture('Soporte Universal + soporte embudo + embudo + filtro');
        console.log("[SoporteFiltracion] Papel de filtro colocado (Erlenmeyer no recreado aún).");
    }

    adherirFiltro() {
        this.estadoEnsamble = 4;
        console.log("[SoporteFiltracion] Papel de filtro adherido con agua destilada.");
    }

    agregarVigilante() {
        this.estadoEnsamble = 5;
        this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + vigilante');
        console.log("[SoporteFiltracion] Vigilante (varilla de vidrio) colocado.");
    }

    colocarErlenmeyer(erlenmeyer) {
        if (erlenmeyer) {
            if (erlenmeyer === this.scene.erlenmeyerActivo) {
                this.scene.erlenmeyerActivo = null;
            }
            erlenmeyer.destroy(); // Destruir el sprite del Erlenmeyer completamente
        }
        this.erlenmeyerVinculado = null;
        this.setTexture('Soporte Universal + soporte embudo');
        console.log("[SoporteFiltracion] Erlenmeyer colocado en la base (sprite destruido, textura de soporte+aro de embudo mantenida).");
    }

    comenzarFiltrado() {
        this.estadoEnsamble = 6;
        this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + vigilante + solucion');

        this.scene.time.delayedCall(1500, () => {
            this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + solucion');
            if (this.erlenmeyerVinculado) {
                this.erlenmeyerVinculado.setTexture('Erlenmeyer+ 100 ml solucion 2');
            }
        });

        this.scene.time.delayedCall(3000, () => {
            this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (1)');
            if (this.erlenmeyerVinculado) {
                this.erlenmeyerVinculado.setTexture('Erlenmeyer+ 100 ml solucion 3');
            }
        });
    }

    lavarVarilla() {
        console.log("[SoporteFiltracion] Lavando varilla.");
    }

    trasvasarArena() {
        this.estadoEnsamble = 7;
        this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (2)');
        console.log("[SoporteFiltracion] Arena trasvasada por completo.");
    }

    lavarFiltroFinal(callback) {
        this.estadoEnsamble = 8;

        // Simular que drena todo el líquido al Erlenmeyer y queda la arena limpia en el filtro
        this.scene.time.delayedCall(1500, () => {
            this.setTexture('Soporte Universal + soporte embudo + embudo + filtro + solucion final (2)');
            if (this.erlenmeyerVinculado) {
                this.erlenmeyerVinculado.setTexture('Erlenmeyer+ 100 ml solucion 4');
            }
            console.log("[SoporteFiltracion] Filtrado y lavado finalizados.");
            if (callback) callback();
        });
    }

    retirarFiltroPapel() {
        // Devuelve el estado con el embudo vacío
        this.setTexture('Soporte Universal + soporte embudo + embudo');
        this.estadoEnsamble = 2;
    }

    onSoporteClick() {
        const paso = this.scene.stepManager.pasoActual;
        if (paso === 22) {
            if (!this.scene.filtroConArena) {
                // Cambiar el soporte al estado de Aro únicamente (sin embudo)
                this.setTexture('Soporte Universal + soporte embudo');
                this.estadoEnsamble = 1;

                // Crear el papel de filtro con arena en la mesa
                this.scene.filtroConArena = this.scene.add.sprite(
                    this.scene.scale.width * 0.4,
                    this.scene.scale.height * 0.5,
                    'Papel de filtro + arena'
                ).setScale(0.3).setInteractive({ cursor: 'grab' });
                this.scene.input.setDraggable(this.scene.filtroConArena);

                // Crear el embudo suelto al lado
                const embudoSuelto = this.scene.add.sprite(
                    this.x - 100,
                    this.y + 50,
                    'Embudo'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.scene.input.setDraggable(embudoSuelto);

                // Crear/Hacer aparecer el Erlenmeyer con la solución final al desarmar el soporte
                this.erlenmeyerVinculado = this.scene.add.sprite(
                    this.x - 5,
                    this.y + 110,
                    'Erlenmeyer+ 100 ml solucion 4'
                ).setScale(0.35).setInteractive({ cursor: 'pointer' });
                this.scene.input.setDraggable(this.erlenmeyerVinculado);
                this.erlenmeyerVinculado.input.draggable = false; // Bloqueado hasta el paso 23
                this.scene.erlenmeyerActivo = this.erlenmeyerVinculado;

                // Registrar click para el paso 23
                this.erlenmeyerVinculado.on('pointerdown', () => {
                    const paso = this.scene.stepManager.pasoActual;
                    if (paso === 23) {
                        this.scene.stepManager.validarAccion('RETIRAR_ERLENMEYER', { erlenmeyer: this.erlenmeyerVinculado });
                    }
                });

                console.log("[SoporteFiltracion] Filtro con arena y embudo suelto creados en la mesa. Erlenmeyer con solución aparecido en la base.");
            }
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
