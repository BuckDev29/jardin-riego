# Jardín — registro de riego de plantas

Sistema simple para no olvidar regar tus plantas: agregas una planta con cada cuántos días necesita agua, y el sistema calcula cuándo le toca el próximo riego, mostrando su estado (al día, pronto o atrasada).

## Características

- Registro de plantas con nombre, icono y frecuencia de riego
- Cálculo automático de días restantes hasta el próximo riego
- Estados visuales: al día, pronto, atrasada
- Botón para marcar una planta como regada hoy
- Datos guardados en el navegador (localStorage), sin base de datos

## Uso

1. Completa el nombre, elige un icono y define cada cuántos días se riega.
2. Pulsa **Plantar** para agregarla al jardín.
3. Cuando la riegues, pulsa **Marcar como regada** para reiniciar el contador.

## Tecnologías

HTML, CSS y JavaScript puro.

## Cómo ejecutarlo

No requiere instalación ni servidor.

1. Clona o descarga este repositorio:
   ```
   git clone https://github.com/BuckDev29/jardin-riego.git
   ```
2. Entra a la carpeta del proyecto.
3. Abre el archivo `index.html` directamente en cualquier navegador (doble clic, o clic derecho → Abrir con).

Eso es todo: no necesita Node, dependencias ni configuración adicional.
