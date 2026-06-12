// ==========================================
// ARCHIVO: js/objects/Probeta.js
// Propósito: Clase Probeta — encapsula estados y texturas de la probeta graduada
// ==========================================

class Probeta extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, TX.PROBETA);
        scene.add.existing(this);
        this.setScale(0.35).setInteractive({ cursor: 'grab' });

        // Habilitada como dropZone para recibir la piseta (paso 8)
        this.input.dropZone = true;

        scene.input.setDraggable(this);
        console.log('[Probeta] Creada en escena.');
    }

    /** Llena la probeta a 40 mL y desactiva su dropZone */
    llenarCon40ml() {
        this.setTexture(TX.PROBETA_40ML);
        this.input.dropZone = false; // Evitar auto-detección como destino en paso 9
        console.log('[Probeta] Llena con 40 mL.');
    }

    /** Vacía la probeta (luego de verter en el vaso) */
    vaciar() {
        this.setTexture(TX.PROBETA);
        console.log('[Probeta] Vaciada.');
    }
}
