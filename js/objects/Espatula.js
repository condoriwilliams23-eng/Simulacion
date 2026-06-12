// ==========================================
// ARCHIVO: js/objects/Espatula.js
// Propósito: Definir la clase Espátula y sus cambios de textura en el trasvase
// ==========================================

class Espatula extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture = 'Espatula de metal') {
        super(scene, x, y, texture);
        
        // Agregar a la escena
        scene.add.existing(this);
        
        // Configurar escala y arrastre
        this.setScale(0.5);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);
        
        this.llena = false;
    }

    cargar() {
        this.llena = true;
        this.setTexture('Espatula llena');
        console.log("[Espatula] Cargada con sustancia.");
    }

    vaciar() {
        this.llena = false;
        this.setTexture('Espatula de metal');
        console.log("[Espatula] Vaciada.");
    }
}
