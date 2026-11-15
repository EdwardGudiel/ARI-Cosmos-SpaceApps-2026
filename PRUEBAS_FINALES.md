# Plan de pruebas final · ARI v27

## Automatizadas (sin internet ni clave Gemini)

En CMD, desde la carpeta `ARI`:

```cmd
node tests/validacion.mjs
```

Verifica: recursos NASA HRP, exclusión de OMS, datos históricos de tres días, valores 0 vs. datos faltantes, señal visual, referencias NASA y separación entre tripulantes.

## Manuales antes de grabar la demostración

Marcar solo cuando se haya comprobado en el equipo de presentación:

- [ ] Abrir en la misma dirección del navegador usada anteriormente (`localhost` o `127.0.0.1`) sin perder el historial.
- [ ] Conectar Gemini Live y autorizar micrófono; hablar por voz y ver texto en pantalla.
- [ ] Comparar tres días del **mismo** astronauta: 2 → 4 → 6; señalar la fecha sin registro, si existe.
- [ ] Probar un segundo tripulante; confirmar que sus valores no se mezclan con los del primero.
- [ ] Guardar un chequeo con síntomas ficticios; comprobar señal explicada y enlace NASA, sin diagnóstico.
- [ ] Preguntar por sueño/mareo/aislamiento; comprobar que el enlace de la fuente lleva a NASA y que ARI distingue su sugerencia del estudio.
- [ ] Simular 08:59:55 y 15:59:55; escuchar aviso y completar chequeo por voz.
- [ ] Cortar enlace con Tierra, guardar un informe, recargar y comprobar pendiente; restaurar enlace y comprobar recepción.
- [ ] Construir hábitat simple, ejecutar evento solar sin refugio, añadir RAD, repetir y descargar reporte.
- [ ] Verificar que el reporte de Tierra indica fecha del chequeo y hora de recepción (si difieren, aclarar que es reloj simulado).
- [ ] Probar el sistema sin clave: el servidor y la interfaz abren, la voz Gemini muestra error comprensible, los datos locales se conservan.

## Resultado reproducible y honesto

**Confirmado por pruebas de código:** la biblioteca del prototipo no contiene referencias OMS; la lógica de alertas, tres fechas y perfil aislado se puede comprobar automáticamente.

**Pendiente de confirmación manual:** calidad del audio Gemini, acceso a micrófono del navegador, cuotas reales de la API, compatibilidad al desplegar, rendimiento 3D y conexión después de publicar.

No presentar el proyecto como solución médica validada. Usar solo perfiles y síntomas de demostración.
