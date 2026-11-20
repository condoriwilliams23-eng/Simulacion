// ==========================================
// ARCHIVO: js/objects/Balanza.js
// Propósito: Definir el comportamiento y estado de la balanza analítica para todos los pasos de pesaje
// ==========================================

class Balanza extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Balanza analítica');

        scene.add.existing(this);
        this.setScale(1.3);
        this.setInteractive({ cursor: 'pointer' });
        scene.input.setDraggable(this);

        this.input.dropZone = true;

        this.visorDigital = scene.add.text(this.x + 60, this.y - 3, '', {
            fontFamily: 'monospace',
            fontSize: '23px',
            color: '#000000'
        }).setOrigin(0.5);

        this.estado = 'APAGADA'; // APAGADA, PRENDIDA, PESANDO, TARADA

        this.on('pointerdown', this.onBalanzaClick, this);
    }

    onBalanzaClick(pointer, localX, localY) {
        let tocoBotonRojo = (localX > 15 && localX < 45 && localY > 19 && localY < 30);
        let tocoBotonVerde = (localX > 50 && localX < 80 && localY > 19 && localY < 30);

        if (tocoBotonRojo) {
            this.manejarBotonRojo();
        } else if (tocoBotonVerde) {
            this.manejarBotonVerde();
        }
    }

    manejarBotonRojo() {
        const stepManager = this.scene.stepManager;
        const paso = stepManager.pasoActual;

        if (paso === 1 && this.estado === 'APAGADA') {
            stepManager.validarAccion('ENCENDER_BALANZA_1', { balanza: this });
        } else if (paso === 6 && this.estado === 'TARADA') {
            stepManager.validarAccion('APAGAR_BALANZA_1', { balanza: this });
        } else if (paso === 25 && this.estado === 'APAGADA') {
            stepManager.validarAccion('ENCENDER_BALANZA_2', { balanza: this });
        } else if (paso === 27 && this.estado === 'PESANDO') {
            stepManager.validarAccion('APAGAR_BALANZA_2', { balanza: this });
        } else if (paso === 37 && this.estado === 'APAGADA') {
            stepManager.validarAccion('ENCENDER_BALANZA_3', { balanza: this });
        } else if (paso === 39 && this.estado === 'PESANDO') {
            stepManager.validarAccion('APAGAR_BALANZA_3', { balanza: this });
        } else if (paso === 51) {
            const desecador = this.scene.children.list.find(o => o.tieneCrisol !== undefined);
            stepManager.validarAccion('RETIRAR_CRISOL_DESECADOR', { balanza: this, desecador });
        } else if (paso === 53 && this.estado === 'PESANDO') {
            stepManager.validarAccion('APAGAR_BALANZA_4', { balanza: this });
        } else if (paso === 55) {
            const desecador = this.scene.children.list.find(o => o.tieneCapsula !== undefined);
            stepManager.validarAccion('RETIRAR_CAPSULA_DESECADOR', { balanza: this, desecador });
        } else if (paso === 57 && this.estado === 'PESANDO') {
            stepManager.validarAccion('APAGAR_BALANZA_5', { balanza: this });
        }
    }

    manejarBotonVerde() {
        const stepManager = this.scene.stepManager;
        const paso = stepManager.pasoActual;

        // Tarar en el paso 2
        if (paso === 2 && this.estado === 'PESANDO') {
            stepManager.validarAccion('COLOCAR_Y_TARAR_VASO', { balanza: this, subAccion: 'TARAR' });
        }
    }

    encender() {
        this.estado = 'PRENDIDA';
        this.visorDigital.setText('0.0 g');
        console.log("[Balanza] Encendida.");
    }

    apagar() {
        this.estado = 'APAGADA';
        this.visorDigital.setText('');
        console.log("[Balanza] Apagada.");
    }

    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    actualizarPeso(peso, esTara = false) {
        if (this.estado === 'APAGADA') return;

        if (esTara) {
            this.visorDigital.setText('00.0 g');
        } else {
            this.visorDigital.setText(`${peso.toFixed(1).padStart(4, ' ')} g`);
        }
        console.log(`[Balanza] Peso actualizado: ${this.visorDigital.text}`);
    }

    destroy(fromScene) {
        if (this.visorDigital) {
            this.visorDigital.destroy();
        }
        super.destroy(fromScene);
    }
}
