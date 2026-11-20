// ==========================================
// ARCHIVO: js/scenes/PreloadScene.js
// Propósito: Realizar la precarga de todos los recursos gráficos (con fondos transparentes
//            y estados compuestos exactos para cada paso del TP)
// ==========================================

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        progressBox.fillStyle(0x1a1a2e, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando Instrumentos...',
            style: {
                font: '16px "Courier New", monospace',
                fill: '#ffffff',
                fontWeight: 'bold'
            }
        }).setOrigin(0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '14px "Courier New", monospace',
                fill: '#00e5ff',
                fontWeight: 'bold'
            }
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x00e5ff, 1);
            progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 8);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        const dir = 'assets/icons/Dibujos sin fondo faltantes/';

        // --- 1. BALANZA, VASOS Y ESPÁTULA (todos sin fondo blanco) ---
        this.load.image('Balanza analítica', dir + 'balanza.png');
        this.load.image('Vaso de precipitados 250 ml', dir + 'Vaso P 250.png');
        this.load.image('Espatula de metal', dir + 'Espatula dibujo.png');
        this.load.image('Vaso con Mezcla', dir + 'Vaso Mezcla.png');
        this.load.image('Espatula llena', dir + 'Espatula 4.png');
        this.load.image('Vaso con sustancia', dir + 'Vaso 250 con sal.png');

        // --- 2. PISETA, VARILLA Y VASOS EN PROCESO ---
        this.load.image('Piseta', 'assets/icons/Piseta 1.png');
        this.load.image('Varilla de vidrio', dir + 'Vigilante.png');
        this.load.image('Vaso 250 agitado', dir + 'Vaso 250 agitado.png');
        this.load.image('Vaso 250 con sal + agua', dir + 'Vaso 250 con sal+agua.png');
        this.load.image('Vaso con arena humeda', dir + 'Vaso con arena humeda.png');
        this.load.image('Vaso con arena humeda + vigilante', dir + 'Vaso con arena humeda+vigilante.png');
        this.load.image('Vaso + solucion final', dir + 'Vaso+solucion final.png');

        // --- 3. PROBETA Y ERLENMEYER ---
        this.load.image('probeta', dir + 'Probeta 100 mL.png');
        this.load.image('probeta 40 mL', dir + 'probeta 40 mL.png');
        this.load.image('probeta 40 mL 2', 'assets/icons/probeta 40 mL 2.jpg');
        this.load.image('probeta 40 mL 3', 'assets/icons/probeta 40 mL 3.jpg');
        this.load.image('probeta 40 mL 4', 'assets/icons/probeta 40 mL 4.jpg');
        this.load.image('zoom 40 ml', dir + 'zoom 40 ml.png');
        this.load.image('Erlenmeyer', 'assets/icons/Erlenmeyer.png');
        this.load.image('Erlenmeyer+ 100 ml solucion 2', 'assets/icons/Erlenmeyer+ 100 ml solucion 2.png');
        this.load.image('Erlenmeyer+ 100 ml solucion 3', 'assets/icons/Erlenmeyer+ 100 ml solucion 3.png');
        this.load.image('Erlenmeyer+ 100 ml solucion 4', 'assets/icons/Erlenmeyer+ 100 ml solucion 4.png');

        // --- 4. SOPORTE DE FILTRACIÓN Y ELEMENTOS DE FILTRADO ---
        this.load.image('Soporte Universal (icono)', dir + 'Soporte Universal solo.png');
        this.load.image('Soporte para embudo', dir + 'Soporte para embudo.png');
        this.load.image('Embudo', 'assets/icons/Embudo.png');
        this.load.image('Embudo + filtro', dir + 'Embudo + filtro.png');
        this.load.image('Papel de filtro 1', dir + 'Papel de filtro 1.png');
        this.load.image('Papel de filtro 2', dir + 'Papel de filtro 2.png');
        this.load.image('Papel de filtro (icono)', 'assets/icons/Papel de filtro.png');
        this.load.image('Papel de filtro + arena', dir + 'Papel de filtro + arena.png');

        this.load.image('Soporte Universal + soporte embudo', dir + 'Soporte Universal + soporte embudo.png');
        this.load.image('Soporte Universal + soporte embudo + erlenmeyer', dir + 'Soporte Universal dibujo.png');
        this.load.image('Soporte Universal + soporte embudo + embudo', dir + 'Soporte Universal + soporte embudo+embudo.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro', dir + 'Soporte Universal + soporte embudo + embudo + filtro.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + vigilante', dir + 'Soporte Universal+soporte embudo+embudo+filtro+vigilante.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + vigilante + solucion', dir + 'Soporte Universal+soporte embudo+embudo+filtro+vigilante+solucion.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion', dir + 'Soporte Universal + soporte embudo + embudo + filtro + solucion.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (1)', dir + 'Soporte Universal+soporte embudo+embudo+filtro+solucion+arena (1).png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (2)', dir + 'Soporte Universal+soporte embudo+embudo+filtro+solucion+arena (2).png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion final (2)', dir + 'Soporte Universal+soporte embudo+embudo+filtro+solucion final (2).png');

        // --- 5. CALCINACIÓN ---
        this.load.image('Crisol', dir + 'Crisol.png');
        this.load.image('Crisol + filtro', dir + 'Crisol + filtro.png');
        this.load.image('Tripode', dir + 'Tripode.png');
        this.load.image('Triangulo refractario', dir + 'Triangulo refractario.png');
        this.load.image('Mechero', dir + 'Mechero.png');
        this.load.image('Pinza metalica', dir + 'Pinza metalica.png');
        this.load.image('Crisol + pinzas', dir + 'Crisol + pinzas.png');

        this.load.image('Tripode + triangulo', dir + 'Tripode+triangulo.png');
        this.load.image('Tripode + triangulo + crisol', dir + 'Tripode+triangulo+crisol.png');
        this.load.image('Tripode + triangulo + Mechero', dir + 'Tripode+triangulo+Mechero.png');
        this.load.image('Tripode + triangulo + Mechero + crisol', dir + 'Tripode+triangulo+Mechero+crisol.png');

        // --- 6. DESECADOR, CÁPSULA Y EVAPORACIÓN ---
        this.load.image('Desecador', dir + 'Desecador.png');
        this.load.image('Desecador + Crisol', dir + 'Desecador + Crisol.png');
        this.load.image('Desecador + Capsula', dir + 'Desecador + Capsula.png');
        this.load.image('Desecador + Crisol + Capsula', dir + 'Desecador + Crisol + Capsula.png');
        this.load.image('Capsula', dir + 'capsula.png');
        this.load.image('Capsula + solucion', dir + 'Capsula + solucion.png');

        this.load.image('Estufa', dir + 'Estufa.png');
        this.load.image('Estufa + capsula', dir + 'Estufa + capsula.png');
        this.load.image('Baño termostatico', dir + 'Baño termostatico.png');
        this.load.image('Baño termostatico prendido', dir + 'Baño termostatico prendido.png');
        this.load.image('Baño termostatico prendido + capsula', dir + 'Baño termostatico prendido + capsula.png');
        this.load.image('Foto capsulas', 'assets/images/Foto capsulas.jpg');
        this.load.image('Foto capsula+estufa', 'assets/images/Foto capsula+estufa.jpg');

        // --- 7. ELEMENTOS DE LA BARRA DE MATERIALES E ICONOS DE DESCARTE ---
        this.load.image('Ernlenmeyer', 'assets/images/Ernlenmeyer.png');
        this.load.image('Probeta graduada', 'assets/images/Probeta graduada.png');
        this.load.image('Crisol de metal', 'assets/images/Crisol de metal.png');
        this.load.image('Cápsula de porcelana', 'assets/images/Cápsula de porcelana.png');
        this.load.image('Soporte Universal', 'assets/images/Soporte Universal.png');
        this.load.image('Mechero bunsen', 'assets/images/Mechero bunsen.png');
        this.load.image('Pinza de metal', 'assets/images/Pinza de metal.png');
        this.load.image('Desecador de Silicagel', 'assets/images/Desecador de Silicagel.png');
        this.load.image('Baño Termostático', 'assets/images/Baño Termostático.png');
        this.load.image('Estufa de secado', 'assets/images/Estufa de secado.png');
        this.load.image('pileta_lavar', 'assets/images/pileta_lavar.png');
        this.load.image('estante_guardar', 'assets/images/estante_guardar.png');
    }

    create() {
        console.log("[PreloadScene] Recursos cargados. Iniciando LabScene...");
        this.scene.start('LabScene');
    }
}
