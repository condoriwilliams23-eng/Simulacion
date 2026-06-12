// ==========================================
// ARCHIVO: js/managers/StepManager.js
// Propósito: Controlar el flujo de los 59 pasos del TP.
//            Los efectos de cada paso están en js/stepHandlers/.
//            La UI de la tabla y los videos también viven aquí.
// ==========================================

class StepManager {
    constructor(scene) {
        this.scene      = scene;
        this.pasoActual = 1;
        this.steps      = window.STEPS || [];
        this.aroColocadoEnSoporte = false;
        this.actualizarUI();
        this.inicializarTablaInteractiva();
    }

    // ── TABLA LATERAL INTERACTIVA ───────────────────────────────────────────
    inicializarTablaInteractiva() {
        const celdas = {
            'masa-mezcla':      { paso: 5,  valor: '5.0',  action: 'REGISTRAR_MASA_MEZCLA' },
            'masa-crisol':      { paso: 26, valor: '34.1' },
            'masa-capsula':     { paso: 38, valor: '55.5' },
            'masa-crisol-arena':{ paso: 52, valor: '37.3' },
            'masa-capsula-sal': { paso: 56, valor: '56.8' }
        };

        for (const [idCelda, info] of Object.entries(celdas)) {
            const celda = document.getElementById(idCelda);
            if (!celda) continue;

            celda.style.cursor = 'pointer';
            celda.addEventListener('click', () => {
                if (this.pasoActual !== info.paso) return;

                if (info.action) {
                    this.validarAccion(info.action);
                } else if (this.scene.balanzaActiva &&
                           this.scene.balanzaActiva.visorDigital.text.trim().startsWith(info.valor)) {
                    this.registrarMasa(idCelda, info.valor);
                    this.avanzarPaso();
                } else {
                    console.warn(`[StepManager] Debe realizar el pesaje primero.`);
                    this.mostrarFeedbackError();
                }
            });
        }
    }

    // ── NAVEGACIÓN DE PASOS ────────────────────────────────────────────────
    obtenerPasoActual() {
        return this.steps.find(s => s.id === this.pasoActual);
    }

    avanzarPaso() {
        if (this.pasoActual < this.steps.length) {
            this.pasoActual++;
            this.actualizarUI();
        } else {
            console.log('[StepManager] ¡Simulación finalizada!');
        }
    }

    // ── VALIDACIÓN Y EJECUCIÓN ─────────────────────────────────────────────
    validarAccion(accionRealizada, datos = {}) {
        const pasoObj = this.obtenerPasoActual();
        if (!pasoObj) return false;

        if (pasoObj.actionExpected === accionRealizada) {
            this.ejecutarEfectoPaso(this.pasoActual, datos);
            this.avanzarPaso();
            return true;
        }

        console.warn(`[StepManager] Acción inválida. Esperada: ${pasoObj.actionExpected}, Recibida: ${accionRealizada}`);
        this.mostrarFeedbackError();
        return false;
    }

    // Delega el efecto de cada paso al handler correspondiente
    ejecutarEfectoPaso(idPaso, datos) {
        if      (idPaso <= 10) handleSteps01to10(idPaso, datos, this);
        else if (idPaso <= 20) handleSteps11to20(idPaso, datos, this);
        else if (idPaso <= 30) handleSteps21to30(idPaso, datos, this);
        else if (idPaso <= 40) handleSteps31to40(idPaso, datos, this);
        else if (idPaso <= 50) handleSteps41to50(idPaso, datos, this);
        else                   handleSteps51to59(idPaso, datos, this);
    }

    // ── ACTUALIZACIÓN DE UI ───────────────────────────────────────────────
    actualizarUI() {
        const pasoObj = this.obtenerPasoActual();
        if (!pasoObj) return;

        const textoInstruccion = document.getElementById('texto-instruccion');
        if (textoInstruccion) textoInstruccion.innerText = pasoObj.description;

        const indicadorPaso = document.getElementById('paso-actual');
        if (indicadorPaso) indicadorPaso.innerText = this.pasoActual;

        // Salvador/Fail-safe: Desbloquear el vaso si ya pasamos el paso 6
        if (this.pasoActual > 6 && this.scene) {
            const vasoObj = this.scene.children.list.find(o => o instanceof Vaso);
            if (vasoObj && vasoObj.bloqueado) {
                vasoObj.desbloquearDeBalanza();
            }
        }

        // Desarmar el Aro del soporte al comenzar el paso 24
        if (this.pasoActual === 24 && this.scene) {
            const soporte = this.scene.children.list.find(o => o instanceof SoporteFiltracion);
            if (soporte && (soporte.estadoEnsamble === 1 || soporte.texture.key === 'Soporte Universal + soporte embudo')) {
                soporte.setTexture('Soporte Universal (icono)'); // Cambiar a la imagen del soporte vacío
                soporte.estadoEnsamble = 0;

                // Crear el Aro suelto en la mesa
                const aroSuelto = this.scene.add.sprite(
                    soporte.x + 85,
                    soporte.y + 100,
                    'Soporte para embudo'
                ).setScale(0.25).setInteractive({ cursor: 'grab' });
                this.scene.input.setDraggable(aroSuelto);
                console.log("[StepManager] Soporte desarmado: Aro colocado suelto en la mesa.");
            }
        }

        console.log(`[StepManager] Paso ${this.pasoActual}: ${pasoObj.title}`);
        this.actualizarToolbarInteractiva();
    }

    actualizarToolbarInteractiva() {
        const allowedAlts = this.obtenerAllowedAlts(this.pasoActual);
        document.querySelectorAll('.item-category img').forEach(icono => {
            const alt = icono.getAttribute('alt');
            if (allowedAlts === null) {
                icono.classList.remove('active-item');
                icono.classList.add('disabled-item');
            } else if (allowedAlts.includes(alt)) {
                icono.classList.remove('disabled-item');
                icono.classList.add('active-item');
            } else {
                icono.classList.remove('active-item');
                icono.classList.add('disabled-item');
            }
        });

        if (allowedAlts && allowedAlts.length > 0) this.autoSeleccionarTab(allowedAlts);
    }

    obtenerAllowedAlts(paso) {
        const ALLOWED = {
            1:  ['Balanza analítica'],
            2:  ['Vaso de precipitados'],
            3:  ['Mezcla'],
            4:  ['Espátula'],
            8:  ['Probeta graduada', 'Piseta con agua'],
            11: ['Varilla de vidrio'],
            12: ['Soporte Universal', 'Soporte para embudo'],
            13: ['Erlenmeyer'],
            14: ['Papel de filtro', 'Embudo'],
            26: ['Crisol de metal'],
            29: ['Trípode de hierro', 'Triángulo refractario'],
            30: ['Mechero bunsen'],
            31: ['Pinza de metal'],
            34: ['Desecador'],
            38: ['Cápsula de porcelana'],
            42: ['Baño termostático'],
            45: ['Estufa de secado'],
        };
        return ALLOWED[paso] || [];
    }

    autoSeleccionarTab(allowedAlts) {
        if (!allowedAlts || allowedAlts.length === 0) return;

        const activeCategory = document.querySelector('.item-category.active');
        if (activeCategory) {
            const tieneItemActivo = Array.from(activeCategory.querySelectorAll('img'))
                .some(img => allowedAlts.includes(img.getAttribute('alt')));
            if (tieneItemActivo) return;
        }

        document.querySelectorAll('.item-category').forEach(cat => {
            const tieneItem = Array.from(cat.querySelectorAll('img'))
                .some(img => allowedAlts.includes(img.getAttribute('alt')));
            if (tieneItem) {
                const tab = document.querySelector(`.tab[data-target="${cat.getAttribute('id')}"]`);
                if (tab) tab.click();
            }
        });
    }

    // ── HELPERS DE UI ────────────────────────────────────────────────────
    registrarMasa(idCelda, valor) {
        const celda = document.getElementById(idCelda);
        if (!celda) return;
        celda.innerText = valor;
        celda.style.backgroundColor = '#d4edda';
        this.scene.time.delayedCall(1000, () => { celda.style.backgroundColor = ''; });
        console.log(`[StepManager] Masa registrada: ${idCelda} = ${valor} g`);
    }

    mostrarFeedbackError() {
        const el = document.getElementById('texto-instruccion');
        if (!el) return;
        el.style.color = '#ff3333';
        el.style.fontWeight = 'bold';
        this.scene.time.delayedCall(1500, () => {
            el.style.color = '';
            el.style.fontWeight = '';
        });
    }

    mostrarZoomImagen(textureKey) {
        const { width, height } = this.scene.cameras.main;
        const overlay  = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, width, height);

        const zoomImg   = this.scene.add.image(width / 2, height / 2, textureKey).setScale(0.85);
        const closeText = this.scene.add.text(width / 2 + 180, height / 2 - 200, 'X', {
            fontFamily: 'Arial, sans-serif', fontSize: '32px', color: '#ff3333', fontStyle: 'bold'
        }).setInteractive({ cursor: 'pointer' });

        closeText.on('pointerdown', () => {
            overlay.destroy();
            zoomImg.destroy();
            closeText.destroy();
            this.avanzarPaso();
        });
    }

    mostrarVideoModal(titulo, duracionMs, callback) {
        const container = document.getElementById('simulador-container');
        if (!container) return;

        const videoOverlay = document.createElement('div');
        videoOverlay.id = 'video-overlay';
        videoOverlay.innerHTML = `
            <div class="video-container">
                <div class="video-header"><h3>Demostración Práctica: ${titulo}</h3></div>
                <div class="video-screen">
                    <div class="video-placeholder-icon">🎥</div>
                    <div class="video-status-text">Reproduciendo procedimiento...</div>
                </div>
                <div class="video-controls">
                    <button id="btn-skip-video">Saltar Video</button>
                    <div class="video-progress-bar-container"><div id="video-progress-bar"></div></div>
                    <span id="video-time">0:00 / 0:00</span>
                </div>
            </div>
        `;
        container.appendChild(videoOverlay);

        let elapsed = 0;
        const bar      = document.getElementById('video-progress-bar');
        const timeSpan = document.getElementById('video-time');

        const cleanup = () => {
            clearInterval(interval);
            if (videoOverlay.parentNode) videoOverlay.parentNode.removeChild(videoOverlay);
            if (callback) callback();
        };

        const interval = setInterval(() => {
            elapsed += 100;
            const pct = (elapsed / duracionMs) * 100;
            if (bar) bar.style.width = `${pct}%`;
            if (timeSpan) {
                const s = (elapsed / 1000).toFixed(1);
                const t = (duracionMs / 1000).toFixed(1);
                timeSpan.innerText = `0:${s.padStart(4, '0')} / 0:${t}`;
            }
            if (elapsed >= duracionMs) cleanup();
        }, 100);

        document.getElementById('btn-skip-video').addEventListener('click', cleanup);
    }

    activarPanelCalculos() {
        const container = document.getElementById('simulador-container');
        if (!container) return;

        const overlay = document.createElement('div');
        overlay.id = 'calculos-overlay';
        overlay.innerHTML = `
            <div class="calculos-box">
                <h2>Cálculos y Resultados Finales</h2>
                <p>Completa los campos en base a las masas registradas en la tabla lateral:</p>
                <form id="form-calculos">
                    <div class="input-group"><label><b>x1:</b> Masa de arena recuperada (g):</label>
                        <input type="number" step="0.1" id="calc-x1" required placeholder="crisol+arena - crisol"></div>
                    <div class="input-group"><label><b>x2:</b> Masa de CuSO4 recuperado (g):</label>
                        <input type="number" step="0.1" id="calc-x2" required placeholder="capsula+sal - capsula"></div>
                    <div class="input-group"><label><b>XT:</b> Masa total recuperada (g):</label>
                        <input type="number" step="0.1" id="calc-xt" required placeholder="x1 + x2"></div>
                    <div class="input-group"><label><b>x3 %:</b> Porcentaje de arena (%):</label>
                        <input type="number" step="0.1" id="calc-x3" required placeholder="(x1 * 100) / XT"></div>
                    <div class="input-group"><label><b>x4 %:</b> Porcentaje de CuSO4 (%):</label>
                        <input type="number" step="0.1" id="calc-x4" required placeholder="(x2 * 100) / XT"></div>
                    <div class="input-group"><label><b>η %:</b> Rendimiento porcentual (%):</label>
                        <input type="number" step="0.1" id="calc-eta" required placeholder="(XT / 5.0) * 100"></div>
                    <button type="button" id="btn-verificar-calculos">Verificar Resultados</button>
                    <div id="calculos-feedback"></div>
                </form>
            </div>
        `;
        container.appendChild(overlay);

        document.getElementById('btn-verificar-calculos').addEventListener('click', () => {
            const v = (id) => parseFloat(document.getElementById(id).value);
            const [x1, x2, xt, x3, x4, eta] = ['calc-x1','calc-x2','calc-xt','calc-x3','calc-x4','calc-eta'].map(v);
            const tol = 0.15;
            const feedback = document.getElementById('calculos-feedback');

            const ok =
                Math.abs(x1 - 3.2)  < tol &&
                Math.abs(x2 - 1.3)  < tol &&
                Math.abs(xt - 4.5)  < tol &&
                Math.abs(x3 - 71.1) < tol &&
                Math.abs(x4 - 28.9) < tol &&
                Math.abs(eta - 90.0) < tol;

            feedback.innerHTML = ok
                ? `<span style="color:#155724;font-weight:bold;background:#d4edda;padding:10px;border-radius:5px;display:block;margin-top:15px;">
                       ¡Excelente! Los cálculos son correctos. Rendimiento del 90.0%. TP aprobado.
                   </span>`
                : `<span style="color:#721c24;font-weight:bold;background:#f8d7da;padding:10px;border-radius:5px;display:block;margin-top:15px;">
                       Los cálculos no coinciden. Revisá las restas y porcentajes (x1=3.2, x2=1.3, XT=4.5).
                   </span>`;
        });
    }
}