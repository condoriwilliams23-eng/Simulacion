// ==========================================
// ARCHIVO: js/objects/Capsula.js
// Propósito: Clase Capsula de porcelana — encapsula estados y texturas
// ==========================================

class Capsula extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, TX.CAPSULA);
        scene.add.existing(this);
        this.setScale(0.35).setInteractive({ cursor: 'grab' });

        // Habilitada como dropZone para recibir filtrado (paso 40)
        this.input.dropZone = true;

        scene.input.setDraggable(this);

        this.tieneSolucion = false;
        this.conSalSeca    = false;

        // Registrar referencia global en la escena
        scene.capsulaActiva = this;

        console.log('[Capsula] Creada en escena.');
    }

    /** Recibe el filtrado del Erlenmeyer (paso 40) */
    recibirFiltrado() {
        this.setTexture(TX.VASO_CON_SUSTANCIA);
        this.tieneSolucion = true;
        console.log('[Capsula] Solución de CuSO4 recibida.');
    }
}
