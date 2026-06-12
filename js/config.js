const config = {
    type: Phaser.AUTO,
    parent: 'game-canvas', // Se ancla al área con cuadrícula
    width: '100%',
    height: '100%',
    transparent: true, // Crucial para que se vea el CSS de fondo
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [PreloadScene, LabScene] // Aquí agregarías MenuScene después
};