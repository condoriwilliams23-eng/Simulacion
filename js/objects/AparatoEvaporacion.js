// ==========================================
// ARCHIVO: js/objects/AparatoEvaporacion.js
// Propósito: Definir la clase para el Baño Termostático y la Estufa de Secado
// ==========================================

class AparatoEvaporacion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, tipo) {
        // tipo: 'banio' o 'estufa'
        const texture = tipo === 'banio' ? 'Baño termostatico' : 'Estufa';
        super(scene, x, y, texture);
        
        this.tipo = tipo;
        this.scene.add.existing(this);
        
        this.setScale(0.55);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);
        
        this.input.dropZone = true;
        this.estado = 'APAGADO'; // APAGADO, PRENDIDO, CON_CAPSULA
        this.capsulaVinculada = null;

        this.on('pointerdown', this.onAparatoClick, this);
    }

    onAparatoClick(pointer, localX, localY) {
        // Permitir prender y apagar con clics
        const stepManager = this.scene.stepManager;
        
        if (this.tipo === 'banio') {
            // El baño termostático se enciende en el paso 42
            if (this.estado === 'APAGADO' && stepManager.pasoActual === 42) {
                stepManager.validarAccion('ENCENDER_BANIO', { banio: this });
            }
            // Se apaga en el paso 48
            else if (this.estado === 'CON_CAPSULA' && stepManager.pasoActual === 48) {
                stepManager.validarAccion('APAGAR_Y_GUARDAR_BANIO', { banio: this });
            }
        } else if (this.tipo === 'estufa') {
            // La estufa se enciende en el paso 45
            if (this.estado === 'APAGADO' && stepManager.pasoActual === 45) {
                stepManager.validarAccion('ENCENDER_ESTUFA', { estufa: this });
            }
            // Se apaga en el paso 49
            else if (this.estado === 'CON_CAPSULA' && stepManager.pasoActual === 49) {
                stepManager.validarAccion('APAGAR_Y_GUARDAR_ESTUFA', { estufa: this });
            }
        }
    }

    encender() {
        this.estado = 'PRENDIDO';
        if (this.tipo === 'banio') {
            this.setTexture('Baño termostatico prendido');
        } else {
            // La estufa no tiene textura especial de encendido sin cápsula en assets,
            // pero podemos loguearlo o cambiar opacidad levemente
            this.setTint(0xffe0b2); // Tinte cálido leve
        }
        console.log(`[AparatoEvaporacion] ${this.tipo} encendido.`);
    }

    colocarCapsula(capsula) {
        this.estado = 'CON_CAPSULA';
        this.capsulaVinculada = capsula;
        
        if (capsula) {
            capsula.setVisible(false); // Ocultar cápsula arrastrada para mostrar versión integrada
        }

        if (this.tipo === 'banio') {
            this.setTexture('Baño termostatico prendido + capsula');
        } else {
            this.clearTint();
            this.setTexture('Estufa + capsula');
        }
        console.log(`[AparatoEvaporacion] Cápsula colocada en ${this.tipo}.`);
    }

    apagar() {
        this.estado = 'APAGADO';
        this.clearTint();
        if (this.tipo === 'banio') {
            this.setTexture('Baño termostatico');
        } else {
            this.setTexture('Estufa');
        }
        console.log(`[AparatoEvaporacion] ${this.tipo} apagado.`);
    }
}
