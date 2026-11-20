// ==========================================
// ARCHIVO: js/objects/EquipoCalentamiento.js
// Propósito: Definir la clase para el equipo de calcinación (Trípode, Triángulo, Crisol, Mechero)
// ==========================================

class EquipoCalentamiento extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, TX.TRIPODE);

        scene.add.existing(this);

        this.setScale(0.55);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);

        this.input.dropZone = true;

        // Estados:
        // 0: Trípode vacío (TX.TRIPODE)
        // 1: Trípode + Triángulo (TX.TRIPODE_TRIANGULO)
        // 2: Trípode + Triángulo + Crisol sin mechero (TX.TRIPODE_TRIANGULO_CRISOL)
        // 3: Trípode + Triángulo + Mechero + Crisol (TX.TRIPODE_COMPLETO)
        // 4: Calcinado
        this.estadoCalentamiento = 0;
        this.encendido = false;

        this.crisolVinculado = null;
        this.on('pointerdown', this.onCalentamientoClick, this);
    }

    agregarTriangulo() {
        this.estadoCalentamiento = 1;
        this.setTexture(TX.TRIPODE_TRIANGULO);
        console.log("[EquipoCalentamiento] Triángulo refractario colocado sobre trípode.");
    }

    agregarCrisol(crisol) {
        this.crisolVinculado = crisol;
        if (crisol) {
            crisol.setVisible(false);
        }
        // En el paso 29 aún no está el mechero bunsen debajo
        if (this.estadoCalentamiento >= 3) {
            this.setTexture(TX.TRIPODE_COMPLETO);
        } else {
            this.estadoCalentamiento = 2;
            this.setTexture(TX.TRIPODE_TRIANGULO_CRISOL);
        }
        console.log("[EquipoCalentamiento] Crisol colocado sobre el triángulo.");
    }

    agregarMechero() {
        this.estadoCalentamiento = 3;
        if (this.crisolVinculado) {
            this.setTexture(TX.TRIPODE_COMPLETO);
        } else {
            this.setTexture(TX.TRIPODE_TRIANGULO_MECHERO);
        }
        console.log("[EquipoCalentamiento] Mechero bunsen colocado debajo del trípode.");
    }

    onCalentamientoClick() {
        const paso = this.scene.stepManager.pasoActual;
        if (paso === 32) {
            this.scene.stepManager.validarAccion('CALCINAR_ARENA', { calentamiento: this });
        }
    }
}
