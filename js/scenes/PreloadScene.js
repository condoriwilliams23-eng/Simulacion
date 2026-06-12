// ==========================================
// ARCHIVO: js/scenes/PreloadScene.js
// Propósito: Realizar la precarga de todos los recursos gráficos (incluyendo texturas compuestas)
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

        // --- 1. CARGA DE IMÁGENES CLAVE PARA LA MESA DE TRABAJO (De assets/icons/) ---
        this.load.image('Balanza analítica', 'assets/icons/balanza.jpg');
        this.load.image('Vaso de precipitados 250 ml', 'assets/icons/Dibujos sin fondo faltantes/Vaso P 250.png');
        this.load.image('Espatula de metal', 'assets/icons/Espatula dibujo.jpg');
        this.load.image('Vaso con Mezcla', 'assets/icons/Vaso Mezcla.jpg');
        this.load.image('Espatula llena', 'assets/icons/Espatula 4.jpg');
        this.load.image('Vaso con sustancia', 'assets/icons/Vaso 250 con sal.jpg');

        // --- 2. CARGA DE IMÁGENES COMPUESTAS Y ENSAMBLADOS (De assets/icons/) ---
        // Piseta y Agitación
        this.load.image('Piseta', 'assets/icons/Piseta 1.jpg');
        this.load.image('Varilla de vidrio', 'assets/icons/Dibujos sin fondo faltantes/Vigilante.png');
        this.load.image('Vaso 250 agitado', 'assets/icons/Dibujos sin fondo faltantes/Vaso 250 agitado.png');
        this.load.image('Vaso 250 con sal + agua', 'assets/icons/Dibujos sin fondo faltantes/Vaso 250 con sal+agua.png');
        this.load.image('Vaso con arena humeda', 'assets/icons/Dibujos sin fondo faltantes/Vaso con arena humeda.png');
        this.load.image('Vaso con arena humeda + vigilante', 'assets/icons/Dibujos sin fondo faltantes/Vaso con arena humeda+vigilante.png');
        this.load.image('Vaso + solucion final', 'assets/icons/Dibujos sin fondo faltantes/Vaso+solucion final.png');
        this.load.image('Papel de filtro + arena', 'assets/icons/Papel de filtro + arena.jpg');

        // Probeta y Erlenmeyer
        this.load.image('probeta', 'assets/icons/Dibujos sin fondo faltantes/Probeta 100 mL.png');
        this.load.image('probeta 40 mL', 'assets/icons/probeta 40 mL.jpg');
        this.load.image('probeta 40 mL 2', 'assets/icons/probeta 40 mL 2.jpg');
        this.load.image('probeta 40 mL 3', 'assets/icons/probeta 40 mL 3.jpg');
        this.load.image('probeta 40 mL 4', 'assets/icons/probeta 40 mL 4.jpg');
        this.load.image('zoom 40 ml', 'assets/icons/Dibujos sin fondo faltantes/zoom 40 ml.png');
        this.load.image('Erlenmeyer', 'assets/icons/Erlenmeyer.jpg');
        this.load.image('Erlenmeyer+ 100 ml solucion 2', 'assets/icons/Erlenmeyer+ 100 ml solucion 2.jpg');
        this.load.image('Erlenmeyer+ 100 ml solucion 3', 'assets/icons/Erlenmeyer+ 100 ml solucion 3.jpg');
        this.load.image('Erlenmeyer+ 100 ml solucion 4', 'assets/icons/Erlenmeyer+ 100 ml solucion 4.jpg');

        // Soporte de Filtración
        this.load.image('Soporte Universal (icono)', 'assets/icons/Soporte Universal + soporte embudo.jpg');
        this.load.image('Soporte para embudo', 'assets/icons/Dibujos sin fondo faltantes/Soporte para embudo.png');
        this.load.image('Embudo', 'assets/icons/Embudo.jpg');
        this.load.image('Papel de filtro (icono)', 'assets/icons/Papel de filtro.jpg');
        
        this.load.image('Soporte Universal + soporte embudo', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal + soporte embudo.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion final (2) (JPG)', 'assets/icons/Soporte Universal + soporte embudo + embudo + filtro + solucion final (2).jpg');
        this.load.image('Soporte Universal + soporte embudo + embudo', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal + soporte embudo+embudo.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal + soporte embudo + embudo + filtro.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + vigilante', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal+soporte embudo+embudo+filtro+vigilante.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + vigilante + solucion', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal+soporte embudo+embudo+filtro+vigilante+solucion.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal + soporte embudo + embudo + filtro + solucion.png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (1)', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal+soporte embudo+embudo+filtro+solucion+arena (1).png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion + arena  (2)', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal+soporte embudo+embudo+filtro+solucion+arena (2).png');
        this.load.image('Soporte Universal + soporte embudo + embudo + filtro + solucion final (2)', 'assets/icons/Dibujos sin fondo faltantes/Soporte Universal+soporte embudo+embudo+filtro+solucion final (2).png');

        // Calcinación
        this.load.image('Crisol', 'assets/icons/Crisol.jpg');
        this.load.image('Tripode', 'assets/icons/Dibujos sin fondo faltantes/Tripode.png');
        this.load.image('Triangulo refractario', 'assets/icons/Dibujos sin fondo faltantes/Triangulo refractario.png');
        this.load.image('Mechero', 'assets/icons/Mechero.jpg');
        this.load.image('Pinza metalica', 'assets/icons/Pinza metalica.jpg');
        this.load.image('Crisol + pinzas', 'assets/icons/Crisol + pinzas.jpg');
        
        this.load.image('Tripode + triangulo', 'assets/icons/Dibujos sin fondo faltantes/Tripode+triangulo.png');
        this.load.image('Tripode + triangulo + Mechero', 'assets/icons/Dibujos sin fondo faltantes/Tripode+triangulo+Mechero.png');
        this.load.image('Tripode + triangulo + Mechero + crisol', 'assets/icons/Tripode + triangulo + Mechero + crisol.jpg');

        // Desecador y Evaporación
        this.load.image('Desecador', 'assets/icons/Desecador.jpg');
        this.load.image('Desecador + Crisol', 'assets/icons/Desecador + Crisol.jpg');
        this.load.image('Desecador + Capsula', 'assets/icons/Desecador + Capsula.jpg');
        this.load.image('Desecador + Crisol + Capsula', 'assets/icons/Desecador + Crisol + Capsula.jpg');
        this.load.image('Capsula', 'assets/icons/capsula.jpg');
        
        this.load.image('Estufa', 'assets/icons/Estufa.jpg');
        this.load.image('Estufa + capsula', 'assets/icons/Estufa + capsula.jpg');
        this.load.image('Baño termostatico', 'assets/icons/Baño termostatico.jpg');
        this.load.image('Baño termostatico prendido', 'assets/icons/Baño termostatico prendido.jpg');
        this.load.image('Baño termostatico prendido + capsula', 'assets/icons/Baño termostatico prendido + capsula.jpg');

        // --- 3. CARGA DE OTROS ELEMENTOS DE LA BARRA DE MATERIALES (De assets/images/ para los botones) ---
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
