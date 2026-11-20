// ==========================================
// ARCHIVO: js/objects/AparatoEvaporacion.js
// Propósito: Definir la clase para el Baño Termostático y la Estufa de Secado
// ==========================================

class AparatoEvaporacion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, tipo) {
        const texture = tipo === 'banio' ? 'Baño termostatico' : 'Estufa';
        super(scene, x, y, texture);

        this.tipo = tipo;
        this.scene.add.existing(this);

        this.setScale(0.55);
        this.setInteractive({ cursor: 'pointer' });
        scene.input.setDraggable(this);

        this.input.dropZone = true;
        this.estado = 'APAGADO'; // APAGADO, PRENDIDO, CON_CAPSULA
        this.capsulaVinculada = null;

        this.on('pointerdown', this.onAparatoClick, this);
    }

    onAparatoClick() {
        const stepManager = this.scene.stepManager;
        const paso = stepManager.pasoActual;

        if (this.tipo === 'banio') {
            if (this.estado === 'APAGADO' && paso === 42) {
                stepManager.validarAccion('ENCENDER_BANIO', { banio: this });
            } else if (paso === 48 && this.estado !== 'APAGADO') {
                this.apagar();
            }
        } else if (this.tipo === 'estufa') {
            if (this.estado === 'APAGADO' && paso === 45) {
                stepManager.validarAccion('ENCENDER_ESTUFA', { estufa: this });
            } else if (paso === 49 && this.estado !== 'APAGADO') {
                this.apagar();
            }
        }
    }

    encender() {
        this.estado = 'PRENDIDO';
        if (this.tipo === 'banio') {
            this.setTexture(TX.BANIO_PRENDIDO);
        } else {
            // Mostrar el visor de la estufa encendido a 110 °C
            this.setTexture(TX.ESTUFA_CAPSULA);
        }
        console.log(`[AparatoEvaporacion] ${this.tipo} encendido.`);
    }

    colocarCapsula(capsula) {
        this.estado = 'CON_CAPSULA';
        this.capsulaVinculada = capsula;

        if (capsula) {
            capsula.setVisible(false);
        }

        if (this.tipo === 'banio') {
            this.setTexture('Baño termostatico prendido + capsula');
        } else {
            this.clearTint();
            this.setTexture('Estufa + capsula');
        }
        console.log(`[AparatoEvaporacion] Cápsula colocada en ${this.tipo}.`);
    }

    retirarCapsulaAMesa(destX, destY) {
        const capsula = this.capsulaVinculada || this.scene.capsulaActiva;
        this.capsulaVinculada = null;
        this.estado = 'PRENDIDO';

        if (this.tipo === 'banio') {
            this.setTexture('Baño termostatico prendido');
        } else {
            this.setTexture('Estufa');
        }

        if (capsula && capsula.scene) {
            capsula.clearTint();
            capsula.setTexture(TX.CAPSULA);
            capsula.setVisible(true);
            capsula.x = this.x;
            capsula.y = this.y - 40;
            this.scene.children.bringToTop(capsula);

            this.scene.tweens.add({
                targets: capsula,
                x: destX,
                y: destY,
                duration: 450,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (capsula.input) capsula.input.draggable = true;
                }
            });
        }
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
