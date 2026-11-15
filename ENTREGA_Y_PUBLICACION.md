# Subida y entrega · NASA Space Apps 2026

## Fecha límite

La página oficial de NASA Space Apps 2026 indica que la ventana de entrega empieza el **14 de noviembre de 2026 a las 09:00** y termina el **15 de noviembre de 2026 a las 23:59, hora local del equipo**. Comprobar el horario en la página de tu equipo y el Project Submission Guide antes de enviar.

https://www.spaceappschallenge.org/2026/

## Orden recomendado

1. Guardar copia local final y ejecutar `node tests/validacion.mjs`.
2. **GitHub público:** subir la carpeta `ARI` con `LEEME.md`, `CITAS_NASA.md`, `PITCH_ARI.md`, `LICENSE` y fuentes. **No subir jamás la clave GEMINI_API_KEY, `.env`, registros de salud reales, capturas con claves ni archivos privados.**
3. **Demo accesible:** publicar la web en un proveedor que soporte **Node.js con HTTPS**, porque Gemini requiere un endpoint de servidor `/api/gemini/token`. Subir solo HTML a hosting estático permite visitar la interfaz, pero NO habilita Gemini Live. El proyecto no necesita base de datos ni paquetes npm externos.
4. Para un despliegue Node, configurar en el proveedor las variables de entorno `GEMINI_API_KEY` y `ARI_PUBLIC_ORIGIN=https://TU-DOMINIO`; usar `node server.mjs` como comando de inicio. `PORT` asignado por el proveedor es compatible. `ARI_HOST=0.0.0.0` se configura automáticamente si hay `ARI_PUBLIC_ORIGIN`. **No pegar la clave en el repositorio**.
5. Revisar que la URL pública funcione en incógnito sin cuenta. El endpoint limita 6 intentos/minuto por dirección IP, pero esto no elimina el riesgo de consumo de cuota en una demo pública. Controlar la cuota y deshabilitar la clave al terminar si fuera necesario.
6. Grabar una demostración breve y preparar una descripción clara del reto, uso de NASA HRP y límites científicos. **Comprobar el formato exacto permitido del video o de las diapositivas en la guía oficial actualizada.**
7. En la plataforma NASA Space Apps, abrir **Team → Project** y completar los campos de título, resumen, descripción, enlaces (demo/repo), fuentes NASA, tecnologías y herramientas IA utilizadas, además de las declaraciones y términos aplicables. Confirmar los campos reales de la interfaz antes de enviarla.

## NASA y terceros

La página oficial del concurso exige usar al menos un recurso de NASA listado en el reto para aspirar a premios globales. ARI documenta explícitamente tres recursos NASA HRP en `CITAS_NASA.md`.

Otros proveedores como Gemini no son *fuentes científicas* de ARI, pero **sí deben declararse** como herramientas tecnológicas o uso de IA. Las normas del concurso admiten materiales de terceros con licencias y atribución apropiadas.

## Riesgos que no conviene ocultar

- Esta versión es un **prototipo para demostración con datos sintéticos**. No recoge información clínica real, no sustituye al equipo médico y sus reglas no tienen validez diagnóstica.
- El almacenamiento está en `localStorage`; si abrís el sitio en un dominio nuevo aparecerán perfiles vacíos. Para la presentación usá el mismo origen del navegador con datos demo o creá nuevos perfiles de prueba.
- La voz Gemini depende de internet, permisos del navegador, región, modelo y cuota. La interacción por palabra clave depende de Chrome y puede fallar aunque el botón del núcleo funcione.
- La estación en Tierra es **simulada dentro del navegador** y no almacena datos en un servidor externo.

## Enlaces oficiales de referencia

- Reto: https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/
- Evento y cierre: https://www.spaceappschallenge.org/2026/
- Condiciones y materiales de terceros: https://www.spaceappschallenge.org/legal/
- Guía de envío: https://www.spaceappschallenge.org/resources/project-submission-guide/
- Guía de evaluación: https://www.spaceappschallenge.org/resources/judging-awards-guide/
