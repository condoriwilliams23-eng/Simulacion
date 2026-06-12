// ==========================================
// ARCHIVO: js/stepHandlers/steps21to30.js
// Propósito: Efectos visuales y de estado para los pasos 21 al 30
//            (Limpieza, crisol, pesaje, filtro en crisol, calcinación)
// ==========================================

function handleSteps21to30(idPaso, datos, sm) {
    switch (idPaso) {

        case 21: // Lavar vaso, varilla, guardar piseta
            {
                const vaso = sm.scene.children.list.find(o => o instanceof Vaso);
                const varilla = sm.scene.children.list.find(o => o.texture && o.texture.key === TX.VARILLA);
                const piseta = sm.scene.children.list.find(o => o.texture && o.texture.key === TX.PISETA);
                if (vaso) vaso.destroy();
                if (varilla) varilla.destroy();
                if (piseta) piseta.destroy();
            }
            break;

        case 22: // Retirar filtro con arena y lavar embudo
            if (datos.embudo) datos.embudo.destroy();
            break;

        case 23: // Quitar Erlenmeyer del soporte y devolverlo a la mesa
            if (sm.scene.erlenmeyerActivo) {
                sm.scene.erlenmeyerActivo.x = sm.scene.scale.width * 0.45;
                sm.scene.erlenmeyerActivo.y = sm.scene.scale.height * 0.50;
                sm.scene.erlenmeyerActivo.input.draggable = true;
            }
            break;

        case 24: // Guardar soporte de filtración
            {
                const soporte = datos.soporte || sm.scene.children.list.find(o => o instanceof SoporteFiltracion);
                if (soporte) soporte.destroy();
            }
            break;

        case 25: // Prender balanza para pesaje del crisol
            if (datos.balanza) datos.balanza.encender();
            break;

        case 26: // Pesar crisol vacío (34.1 g — Diapositiva 6)
            if (datos.balanza) {
                datos.balanza.setEstado('PESANDO');
                datos.balanza.actualizarPeso(34.1);
                sm.pasoActual--; // Esperar registro en tabla lateral
            }
            break;

        case 27: // Apagar balanza
            if (datos.balanza) datos.balanza.apagar();
            break;

        case 28: // Colocar filtro en crisol (con video — Diapositiva 6)
            if (datos.filtro) {
                datos.filtro.input.draggable = false;
                sm.mostrarVideoModal('Introducción del Filtro en Crisol', 2500, () => {
                    if (datos.filtro) datos.filtro.destroy();
                    if (datos.crisol) datos.crisol.conFiltro = true;
                    sm.avanzarPaso();
                });
                sm.pasoActual--;
            }
            break;

        case 29: // Montar trípode / triángulo / crisol (sub-acciones)
            {
                const calentamiento = datos.calentamiento || sm.scene.children.list.find(o => o instanceof EquipoCalentamiento);
                if (calentamiento) {
                    if (datos.subAccion === 'TRIANGULO') {
                        calentamiento.agregarTriangulo();
                        const triangulo = datos.triangulo || sm.scene.children.list.find(o => o.texture && o.texture.key === TX.TRIANGULO);
                        if (triangulo) triangulo.destroy();
                        sm.pasoActual--; // Esperar sub-acción CRISOL
                    } else if (datos.subAccion === 'CRISOL') {
                        const crisol = datos.crisol || sm.scene.children.list.find(o => o.texture && o.texture.key === TX.CRISOL);
                        calentamiento.agregarCrisol(crisol);
                    }
                } else {
                    console.error("[steps21to30.js] Paso 29: No se encontró equipo de calentamiento en escena.");
                }
            }
            break;

        case 30: // Montar mechero bunsen
            {
                const calentamiento = datos.calentamiento || sm.scene.children.list.find(o => o instanceof EquipoCalentamiento);
                const mechero = datos.mechero || sm.scene.children.list.find(o => o.texture && o.texture.key === TX.MECHERO);
                if (calentamiento) {
                    calentamiento.agregarMechero();
                    if (mechero) mechero.destroy();
                } else {
                    console.error("[steps21to30.js] Paso 30: No se encontró equipo de calentamiento en escena.");
                }
            }
            break;
    }
}
