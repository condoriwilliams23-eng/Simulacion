// ==========================================
// ARCHIVO: js/main.js
// PROPÓSITO: Manejar el menú HTML y arrancar el motor Phaser
// ==========================================

// --- 1. LÓGICA DE LAS PESTAÑAS HTML ---
// Se ejecuta apenas carga el texto de la página
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const categories = document.querySelectorAll('.item-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Oculta todas las pestañas y muestra la que tocaste
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Muestra los materiales de esa pestaña
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// --- 2. ARRANQUE DEL MOTOR PHASER ---
// Se ejecuta cuando ya cargaron todas las imágenes, CSS y la clase LabScene
window.onload = function() {
    
    // Configuramos el "lienzo" transparente
    const config = {
        type: Phaser.AUTO,
        parent: 'game-canvas', // El ID del div en tu HTML
        width: '100%',
        height: '100%',
        transparent: true,
        scene: [PreloadScene, LabScene] // Escenas de carga y laboratorio
    };
    
    // Encendemos el juego
    window.game = new Phaser.Game(config);

    // --- 3. CONEXIÓN DEL MENÚ HTML CON PHASER ---
    // Le damos un pequeño retraso de 500ms para asegurar que Phaser terminó de crearse
    setTimeout(() => {
        const iconosHerramientas = document.querySelectorAll('.item-category img');
        
        // Le ponemos un "escuchador de clics" a cada ícono de tu barra superior
        iconosHerramientas.forEach(icono => {
            icono.addEventListener('click', function() {
                // Si el item está desactivado para el paso actual, ignorar clic
                if (this.classList.contains('disabled-item')) return;
                
                const alt = this.getAttribute('alt');
                
                // Llamamos a la función de la escena para que dibuje el objeto mapeado
                if (window.escenaLaboratorio) {
                    window.escenaLaboratorio.aparecerObjetoPorAlt(alt);
                } else {
                    console.error("Error: Phaser aún no inicializó la escena.");
                }
            });
        });
    }, 500); 
};