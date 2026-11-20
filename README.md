# Simulador de Laboratorio — TP N° 2: Separación de Fases

Simulador interactivo desarrollado con **HTML5, CSS3 y Phaser 3** para la cátedra de **Química General** de la **Universidad Tecnológica Nacional — Facultad Regional Santa Fe (UTN - FRSF)**.

---

## Objetivo del Trabajo Práctico

Separar los componentes de una mezcla sólida heterogénea compuesta por **arena** y **sulfato de cobre ($\text{CuSO}_4$)** aplicando métodos físicos de fraccionamiento de fases:

1. **Pesaje inicial y disolución**: Tarado en balanza analítica, trasvase de $5{,}0\text{ g}$ de mezcla y disolución selectiva de la sal soluble con $40\text{ mL}$ de agua destilada.
2. **Filtración por gravedad**: Montaje del soporte universal, aro, erlenmeyer, embudo y papel de filtro; decantación con varilla vigilante y lavado cuantitativo del residuo sólido.
3. **Recuperación de la arena (Calcinación)**: Plegado del papel de filtro en crisol de metal previamente tarado, calcinación sobre trípode y triángulo refractario con mechero Bunsen, enfriamiento en desecador de sílica gel y pesaje final.
4. **Recuperación del $\text{CuSO}_4$ (Evaporación y secado)**: Trasvase del líquido filtrado a una cápsula de porcelana tarada, concentración en baño termostático a $90\ ^\circ\text{C}$, secado en estufa a $110\ ^\circ\text{C}$, enfriamiento en desecador y pesaje final.
5. **Cálculos y rendimiento**: Registro de masas en la tabla lateral y verificación de masas recuperadas ($x_1$, $x_2$, $X_T$), composición porcentual ($x_3\%$, $x_4\%$) y rendimiento porcentual ($\eta\%$) del procedimiento.

---

## Características Principales

- **Procedimiento guiado de 59 pasos**: Panel de instrucciones paso a paso con habilitación contextual de materiales, sustancias y equipamiento en la barra superior.
- **Interacciones con movimiento físico y efecto de volque**:
  - Detección con margen amplio de ubicación alrededor del **borde de la boca** y cuerpo de los recipientes, con indicador visual luminoso al acercar un instrumento.
  - Animación de **volcado apoyado sobre el borde de la boca** (probeta a vaso de precipitados, vaso a embudo con varilla vigilante, erlenmeyer a cápsula de porcelana, piseta y espátula) con flujo animado de líquidos y sólidos.
  - Animaciones de agitación con varilla, plegado de papel de filtro, llama oxidante y humo durante la calcinación, lavado en pileta y guardado en estante.
- **Tabla de datos interactiva y panel de evaluación**: Registro directo haciendo clic en cada celda tras cada pesaje en la balanza analítica y formulario final de validación de resultados.

---

## Estructura del Proyecto

```text
├── index.html                  # Interfaz principal, barra de materiales y tabla de datos
├── css/
│   └── style.css               # Estilos de la interfaz, modales y tabla de resultados
├── assets/
│   ├── images/                 # Íconos de la barra de herramientas y fotografías de laboratorio
│   └── icons/                  # Sprites transparentes e imágenes compuestas del instrumental
└── js/
    ├── main.js                 # Inicialización de pestañas HTML y configuración de Phaser 3
    ├── constants/
    │   └── TEXTURES.js         # Catálogo centralizado de claves de texturas (TX)
    ├── data/
    │   ├── steps.js            # Definición declarativa de los 59 pasos del TP
    │   ├── dropRules.js        # Reglas de interacción entre instrumentos y márgenes
    │   ├── discardRules.js     # Reglas de lavado (Pileta) y guardado (Estante)
    │   └── fallbackRules.js    # Reglas auxiliares de proximidad
    ├── managers/
    │   ├── StepManager.js      # Control de flujo de pasos, tabla interactiva, zooms y cálculos
    │   └── DragManager.js      # Motor de arrastre, detección de borde de boca y animaciones
    ├── objects/                # Clases de instrumentos de laboratorio (Balanza, Vaso, Probeta, etc.)
    ├── scenes/
    │   ├── PreloadScene.js     # Precarga de recursos gráficos
    │   └── LabScene.js         # Escena principal de la mesada y animaciones físicas
    └── stepHandlers/           # Lógica y efectos visuales segmentados del paso 1 al 59
```

---

## Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/condoriwilliams23-eng/Simulacion.git
   cd Simulacion
   ```
2. Servir la carpeta con cualquier servidor HTTP estático (por ejemplo, la extensión **Live Server** de VS Code o Python):
   ```bash
   python3 -m http.server 8000
   ```
3. Abrir en el navegador: `http://localhost:8000`
