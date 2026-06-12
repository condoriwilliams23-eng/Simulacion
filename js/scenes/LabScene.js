// ==========================================
// ARCHIVO: js/scenes/LabScene.js
// Propósito: Definir la escena principal e instanciar los objetos modulares al crearlos en el tablero
// ==========================================

class LabScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LabScene' });
    }

    create() {
        console.log("[LabScene] Escena de laboratorio iniciada.");

        // Registrar escena globalmente para interactuar con la toolbar HTML en main.js
        window.escenaLaboratorio = this;

        // Inicializar managers principales
        this.stepManager = new StepManager(this);
        this.dragManager = new DragManager(this, this.stepManager);

        // Variables de referencias
        this.balanzaActiva = null;
        this.espatulaActiva = null;
        this.mezclaContainer = null;
        this.erlenmeyerActivo = null;
        this.crisolActivo = null;
        this.capsulaActiva = null;
        this.filtroConArena = null;

        // Agregar figuras de descarte (Lavar y Guardar)
        const width = this.scale.width;

        // Lavar (Pileta)
        this.sinkSprite = this.add.sprite(width - 230, 75, 'pileta_lavar').setScale(0.18);
        this.sinkText = this.add.text(width - 230, 140, 'LAVAR', {
            fontFamily: '"Courier New", monospace',
            fontSize: '15px',
            color: '#00e5ff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Guardar (Estante)
        this.cabinetSprite = this.add.sprite(width - 80, 75, 'estante_guardar').setScale(0.18);
        this.cabinetText = this.add.text(width - 80, 140, 'GUARDAR', {
            fontFamily: '"Courier New", monospace',
            fontSize: '15px',
            color: '#ff007f',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }

    aparecerObjeto(claveImagen) {
        console.log("[LabScene] Spawning en mesa: " + claveImagen);

        let nuevoObjeto;

        switch (claveImagen) {
            case 'Balanza analítica':
                nuevoObjeto = new Balanza(
                    this,
                    this.scale.width * 0.82,
                    this.scale.height * 0.80
                );
                this.balanzaActiva = nuevoObjeto;
                break;

            case 'Vaso de precipitados 250 ml':
                nuevoObjeto = new Vaso(
                    this,
                    this.scale.width * 0.25,
                    this.scale.height * 0.55
                );
                break;

            case 'Espatula de metal':
                nuevoObjeto = new Espatula(
                    this,
                    this.scale.width * 0.35,
                    this.scale.height * 0.55
                );
                this.espatulaActiva = nuevoObjeto;
                break;

            case 'Vaso con Mezcla':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    claveImagen
                ).setScale(0.3).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true;
                this.mezclaContainer = nuevoObjeto;

                // Si es el paso 3, este spawn valida el paso
                if (this.stepManager.pasoActual === 3) {
                    this.stepManager.validarAccion('SPAWN_MEZCLA_CONTAINER', { vasoMezcla: nuevoObjeto });
                }
                break;

            // NUEVOS ELEMENTOS DEL PROCEDIMIENTO EXTENDIDO:
            case 'Probeta graduada':
                nuevoObjeto = new Probeta(
                    this,
                    this.scale.width * 0.30,
                    this.scale.height * 0.55
                );
                break;

            case 'Varilla de vidrio':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.40,
                    this.scale.height * 0.55,
                    'Varilla de vidrio'
                ).setScale(0.25).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true; // Para ser lavada
                break;

            case 'Soporte Universal':
                nuevoObjeto = new SoporteFiltracion(
                    this,
                    this.scale.width * 0.11,
                    this.scale.height * 0.7
                );
                break;

            case 'Soporte y Embudo': // Es el Aro del embudo en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.25,
                    this.scale.height * 0.55,
                    'Soporte para embudo'
                ).setScale(0.25).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Erlenmeyer':
            case 'Ernlenmeyer':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.45,
                    this.scale.height * 0.55,
                    'Erlenmeyer'
                ).setScale(0.35).setInteractive({ cursor: 'pointer' });
                this.input.setDraggable(nuevoObjeto);

                // Habilitar clic para retirar en el paso 23
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 23) {
                        this.stepManager.validarAccion('RETIRAR_ERLENMEYER', { erlenmeyer: nuevoObjeto });
                    }
                });

                this.erlenmeyerActivo = nuevoObjeto;
                break;

            case 'Papel de filtro':
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.50,
                    this.scale.height * 0.55,
                    'Papel de filtro (icono)'
                ).setScale(0.30).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Soporte universal y embudo': // En el HTML es el Embudo de vidrio
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    'Embudo'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                nuevoObjeto.input.dropZone = true;
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Piseta con agua': // Piseta en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.42,
                    this.scale.height * 0.55,
                    'Piseta'
                ).setScale(0.15).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;

            case 'Crisol de metal': // Crisol en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.28,
                    this.scale.height * 0.55,
                    'Crisol'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                nuevoObjeto.input.dropZone = true; // Recibe el papel filtro
                this.crisolActivo = nuevoObjeto;
                break;

            case 'Mechero y Trípode': // Es el Trípode de calcinación en el HTML
                nuevoObjeto = new EquipoCalentamiento(
                    this,
                    this.scale.width * 0.60,
                    this.scale.height * 0.55
                );
                break;

            case 'Mechero bunsen': // Mechero en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.38,
                    this.scale.height * 0.55,
                    'Mechero'
                ).setScale(0.35).setInteractive({ cursor: 'pointer' });
                this.input.setDraggable(nuevoObjeto);

                // Permitir encendido si ya está montado
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 32) {
                        const calentamiento = this.children.list.find(c => c instanceof EquipoCalentamiento);
                        if (calentamiento) {
                            this.stepManager.validarAccion('CALCINAR_ARENA', { calentamiento: calentamiento });
                        }
                    }
                });
                break;

            case 'Pinza de metal': // Pinzas en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.48,
                    this.scale.height * 0.55,
                    'Pinza metalica'
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);

                // Si es el paso 31, este spawn valida el paso
                if (this.stepManager.pasoActual === 31) {
                    this.stepManager.validarAccion('SPAWN_PINZAS', { pinza: nuevoObjeto });
                }
                break;

            case 'Desecador de Silicagel': // Desecador en el HTML
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.70,
                    this.scale.height * 0.48,
                    'Desecador'
                ).setScale(0.55).setInteractive();
                nuevoObjeto.input.dropZone = true;
                nuevoObjeto.tieneCrisol = false;
                nuevoObjeto.tieneCapsula = false;

                // Detectar clics para retirar crisol (paso 51) o cápsula (paso 55)
                nuevoObjeto.on('pointerdown', () => {
                    const paso = this.stepManager.pasoActual;
                    if (paso === 51 && nuevoObjeto.tieneCrisol) {
                        this.stepManager.validarAccion('RETIRAR_CRISOL_DESECADOR', {
                            desecador: nuevoObjeto,
                            balanza: this.balanzaActiva
                        });
                    } else if (paso === 55 && nuevoObjeto.tieneCapsula) {
                        this.stepManager.validarAccion('RETIRAR_CAPSULA_DESECADOR', {
                            desecador: nuevoObjeto,
                            balanza: this.balanzaActiva
                        });
                    }
                });

                // Si es el paso 34, este spawn valida el paso
                if (this.stepManager.pasoActual === 34) {
                    this.stepManager.validarAccion('SPAWN_DESECADOR', { desecador: nuevoObjeto });
                }
                break;

            case 'Cápsula de porcelana': // Cápsula en el HTML
                nuevoObjeto = new Capsula(
                    this,
                    this.scale.width * 0.32,
                    this.scale.height * 0.55
                );
                break;

            case 'Baño Termostático':
                nuevoObjeto = new AparatoEvaporacion(
                    this,
                    this.scale.width * 0.55,
                    this.scale.height * 0.55,
                    'banio'
                );
                break;

            case 'Estufa de secado':
                nuevoObjeto = new AparatoEvaporacion(
                    this,
                    this.scale.width * 0.72,
                    this.scale.height * 0.50,
                    'estufa'
                );
                break;

            default:
                // Fallback genérico para otros materiales
                nuevoObjeto = this.add.sprite(
                    this.scale.width * 0.40,
                    this.scale.height * 0.55,
                    claveImagen
                ).setScale(0.35).setInteractive({ cursor: 'grab' });
                this.input.setDraggable(nuevoObjeto);
                break;
        }

        return nuevoObjeto;
    }

    aparecerObjetoPorAlt(alt) {
        const mappingAltAClave = {
            'Vaso de precipitados': 'Vaso de precipitados 250 ml',
            'Espátula': 'Espatula de metal',
            'Mezcla': 'Vaso con Mezcla',
            'Desecador': 'Desecador de Silicagel',
            'Soporte para embudo': 'Soporte y Embudo',
            'Embudo': 'Soporte universal y embudo',
            'Trípode de hierro': 'Mechero y Trípode',
            'Triángulo refractario': 'Triangulo refractario'
        };

        let claveObjeto = mappingAltAClave[alt] || alt;

        this.aparecerObjeto(claveObjeto);
    }
}
