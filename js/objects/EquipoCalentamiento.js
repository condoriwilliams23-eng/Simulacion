// ==========================================
// ARCHIVO: js/objects/EquipoCalentamiento.js
// Propósito: Definir la clase para el equipo de calcinación (Trípode, Triángulo, Mechero, Crisol)
// ==========================================

class EquipoCalentamiento extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Tripode');
        
        // Agregar a la escena
        scene.add.existing(this);
        
        // Configurar escala e interactividad
        this.setScale(0.55);
        this.setInteractive({ cursor: 'grab' });
        scene.input.setDraggable(this);
        
        // Habilitar como dropZone para recibir triángulo, mechero y crisol
        this.input.dropZone = true;
        
        // Estados:
        // 0: Trípode vacío
        // 1: Trípode + Triángulo
        // 2: Trípode + Triángulo + Mechero
        // 3: Trípode + Triángulo + Mechero + Crisol (Listo para calcinar)
        // 4: Calcinado (Mechero apagado, cenizas listas)
        this.estadoCalentamiento = 0;
        this.encendido = false;
        
        this.crisolVinculado = null;
        this.on('pointerdown', this.onCalentamientoClick, this);
    }

    agregarTriangulo() {
        this.estadoCalentamiento = 1;
        this.setTexture('Tripode + triangulo');
        console.log("[EquipoCalentamiento] Triángulo refractario colocado sobre trípode.");
    }

    agregarMechero() {
        this.estadoCalentamiento = 2;
        this.setTexture('Tripode + triangulo + Mechero + crisol');
        console.log("[EquipoCalentamiento] Mechero bunsen colocado debajo.");
    }

    agregarCrisol(crisol) {
        this.estadoCalentamiento = 3;
        this.crisolVinculado = crisol;
        this.setTexture('Tripode + triangulo + Mechero + crisol');
        
        if (crisol) {
            crisol.setVisible(false); // Ocultar el crisol arrastrado ya que se dibuja en la textura compuesta
        }
        console.log("[EquipoCalentamiento] Crisol colocado sobre el triángulo.");
    }

    encenderMechero() {
        if (this.estadoCalentamiento !== 3) return;
        
        this.encendido = true;
        console.log("[EquipoCalentamiento] Mechero encendido. Iniciando calcinación del papel...");
        
        // Simular calcinación con humo u ocultar las cenizas
        // Transcurrido un tiempo, la calcinación termina
        this.scene.time.delayedCall(3000, () => {
            this.encendido = false;
            this.estadoCalentamiento = 4;
            
            if (this.crisolVinculado) {
                this.crisolVinculado.conArenaSeca = true; // El crisol ahora contiene arena seca
            }
            console.log("[EquipoCalentamiento] Calcinación finalizada. Papel convertido en gases. Solo queda arena blanca.");
        });
    }

    onCalentamientoClick() {
        const paso = this.scene.stepManager.pasoActual;
        if (paso === 32) {
            this.scene.stepManager.validarAccion('CALCINAR_ARENA', { calentamiento: this });
        }
    }
}
