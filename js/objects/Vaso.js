// ==========================================
// ARCHIVO: js/objects/Vaso.js
// Propósito: Definir la clase Vaso de precipitados y sus múltiples estados durante el TP
// ==========================================

class Vaso extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture = 'Vaso de precipitados 250 ml') {
        super(scene, x, y, texture);

        scene.add.existing(this);
        this.setScale(0.3);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);

        this.balanzaVinculada = null;
        this.bloqueado = false;

        this.on('pointerdown', this.onVasoClick, this);
    }

    bloquearEnBalanza(balanza) {
        this.x = balanza.x;
        this.y = balanza.y - 100;
        this.input.draggable = false;
        this.balanzaVinculada = balanza;
        this.bloqueado = true;

        // Agrandar el rango de contacto y hacerlo dropZone (después del paso 3)
        this.input.dropZone = true;
        this.input.hitArea = new Phaser.Geom.Rectangle(-40, -40, this.width + 110, this.height + 110);

        console.log("[Vaso] Bloqueado en la balanza. Rango de contacto agrandado.");
    }

    desbloquearDeBalanza() {
        this.input.draggable = true;
        this.bloqueado = false;
        this.balanzaVinculada = null;

        // Mantener dropZone activo para que la probeta pueda soltarse sobre el vaso (paso 9)
        this.input.dropZone = true;
        this.input.hitArea = new Phaser.Geom.Rectangle(-80, -80, this.width + 160, this.height + 160);

        console.log("[Vaso] Desbloqueado de la balanza. DropZone mantenida activa.");
    }

    llenarConSustancia() {
        this.setTexture('Vaso con sustancia');
        console.log("[Vaso] Mezcla de sólidos cargada.");
    }

    llenarConAgua() {
        // Al agregar agua destilada a la mezcla de CuSO4 y arena, se torna celeste/azul
        this.setTexture('Vaso 250 con sal + agua');
        console.log("[Vaso] Agua añadida a la mezcla.");
    }

    agitar(callback) {
        console.log("[Vaso] Agitando la mezcla...");

        // Durante la agitación, mantenemos la textura actual (celeste sin varilla)
        // para que la varilla animada en la escena sea la única visible.

        // Después de 1.8 segundos, cambiamos a la textura final 'Vaso 250 agitado'
        this.scene.time.delayedCall(1800, () => {
            this.setTexture('Vaso 250 agitado');
            console.log("[Vaso] Sal disuelta. Solución azulada estable.");
            if (callback) callback();
        });
    }

    vaciarSolucion() {
        // Al filtrar la solución líquida azul, solo queda la arena húmeda en el vaso
        this.setTexture('Vaso con arena humeda');
        console.log("[Vaso] Solución líquida azul decantada. Queda arena húmeda.");
    }

    vaciarArena() {
        // Al trasvasar la arena restante al filtro, el vaso queda vacío de nuevo
        this.setTexture('Vaso de precipitados 250 ml');
        console.log("[Vaso] Arena retirada. Vaso limpio.");
    }

    onVasoClick() {
        // Permitir desbloqueo interactivo en el paso 6
        if (this.scene.stepManager.pasoActual === 6 && this.bloqueado) {
            this.desbloquearDeBalanza();
            if (this.balanzaVinculada) {
                this.balanzaVinculada.setEstado('PRENDIDA');
                this.balanzaVinculada.actualizarPeso(0.0);
            }
        }
    }
}
