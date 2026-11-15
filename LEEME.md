# ARI Cosmos — Edición final NASA Space Apps 2026 (v27)

**Proyecto:** ARI · Asistente de seguimiento de salud y bienestar de tripulaciones en misiones espaciales.
**Reto elegido:** Create Health Monitoring Software for Astronauts on Space Missions.
**Equipo:** Elaris Development.

## ¿Qué hace ARI?

- Conversa en español con Gemini Live y transcribe lo escuchado y respondido. El micrófono necesita permiso del navegador e internet para Gemini.
- Mantiene **perfiles independientes** para una tripulación de 2 a 12 personas (el mínimo de dos es una regla de diseño del prototipo, no una norma universal de NASA).
- Registra por voz o, de forma opcional, manualmente, los chequeos a las **09:00 y 16:00**; guarda historial por fecha y por tripulante.
- Muestra indicadores autorreportados de dolor de cabeza, mareo, cansancio, estrés, sueño, ánimo y otros datos cuando se registran. No incluye mediciones automáticas de sensores biomédicos.
- Compara fechas y puede calcular **una extrapolación ilustrativa** cuando hay tres días consecutivos con datos comparables; no predice enfermedades.
- Explica señales mediante **reglas de demostración**, propone seguimiento prudentemente y ofrece referencias **solo NASA**. No son protocolos ni umbrales clínicos oficiales.
- Simula el envío de informes a Tierra y su recuperación cuando se restaura el enlace.
- Incluye un constructor de hábitats 3D, escenarios de riesgos y reporte JSON; todo es ilustrativo, sin simulación física certificada.

## Instalar en Windows (sin cambiar la clave)

1. Conservá una **copia** de tu versión anterior de ARI. Descomprimí esta nueva carpeta `ARI` y reemplazá los archivos de la anterior, pero **no borres los datos del navegador**: el historial local usa la misma clave de almacenamiento (`ari.crew-mission.v1`). Los datos pueden depender del origen (`localhost` y `127.0.0.1` se consideran distintos).
2. Instalá Node.js 22 o posterior.
3. Abrí una terminal **CMD** en la carpeta donde está `server.mjs`.
4. Introducí la clave **solo en CMD** (nunca en `index.html`, GitHub ni capturas):

```cmd
set "GEMINI_API_KEY=PEGA_AQUI_TU_CLAVE"
set "ARI_PORT=8001"
node server.mjs
```

5. Abrí el mismo origen que usabas antes: **http://localhost:8001/?v=27** o `http://127.0.0.1:8001/?v=27` (NO son intercambiables si querés conservar historial). Si queda caché anterior, pulsá **Ctrl + Shift + R**.
6. Tocá el núcleo azul para iniciar Gemini y permití el micrófono. La activación opcional por «Hola, ARI» usa **SpeechRecognition de Chrome**, por lo que puede fallar aunque Gemini Live funcione al tocar el núcleo.

## Prueba de 5 minutos

1. Elegí el perfil correcto y comprobá que **Historial** muestra las fechas y valores que registraste.
2. Hablá con ARI: «Compará mi dolor de cabeza de los últimos tres días». Debe señalar las fechas faltantes sin inventarlas.
3. Preguntá «¿Qué documentación de NASA se relaciona con mareo y mal descanso?». Debe mostrar fuentes NASA con enlaces y distinguir la sugerencia de ARI de lo que dice NASA.
4. Probá el enlace simulado: cortá, registrá, comprobá «Pendiente» y restaurá.
5. En Hábitat, probá evento solar sin refugio y con refugio. Debe cambiar el diagnóstico *del escenario*, no emitir garantías de ingeniería.
6. Ejecutá `node tests/validacion.mjs` para las comprobaciones automáticas de historial y reglas.

## Qué se añadió en v27

- Biblioteca científica **exclusivamente NASA**, incluyendo los tres recursos HRP: *Five Hazards*, *Risks*, *Ongoing HRP Research* utilizados como recursos del reto.
- Seguimiento explicable de cambios visuales, síntomas con evolución registrada y bienestar emocional declarado; cada regla identifica su naturaleza de **ensayo**.
- Ficha de seguimiento en la interfaz de ARI con enlaces NASA; información de seguimiento en el informe para Tierra.
- Herramienta `consultar_evaluacion` para que Gemini recupere la evaluación calculada de los registros, sin inventar valores.
- Mejoras para despliegue con Node.js en HTTPS usando `ARI_PUBLIC_ORIGIN`, `ARI_HOST` y `PORT` o `ARI_PORT`; la clave permanece en el servidor. El endpoint de voz tiene un límite básico de solicitudes.
- Pruebas repetibles, catálogo de fuentes NASA, guía de entrega y guion de demostración.

## Límites importantes

- **Solo datos ficticios.** ARI NO está validado como dispositivo médico, no diagnostica ni prescribe, no mide radiación real y no sustituye al equipo médico de vuelo.
- Las referencias NASA son **resúmenes curados localmente con enlaces**. La aplicación no busca en tiempo real todas las publicaciones de NASA. Gemini puede equivocarse; verificá toda cita en el enlace oficial.
- El «pronóstico» de síntomas es una **extrapolación condicional de valores declarados**, NO una predicción médica.
- «Control en Tierra» y el corte/restauración de enlace son una simulación **dentro del navegador**: no transmiten a NASA ni a una estación real.
- El navegador guarda los datos en `localStorage`, sin cifrado ni sincronización entre dispositivos. No es adecuado para datos de salud reales o despliegue clínico.
- El modo Gemini Live necesita una clave y conexión con Google; «Hola, ARI» y el sonido automático pueden tener limitaciones de permisos.
- El constructor de hábitats verifica reglas funcionales didácticas; no calcula blindajes reales, supervivencia, dosis médicas ni ingeniería estructural validada.

Ver [CITAS_NASA.md](CITAS_NASA.md), [PRUEBAS_FINALES.md](PRUEBAS_FINALES.md), [ENTREGA_Y_PUBLICACION.md](ENTREGA_Y_PUBLICACION.md) y [PITCH_ARI.md](PITCH_ARI.md).
