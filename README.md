# ARI Cosmos — AI-Powered Astronaut Health Monitoring

**Team Elaris Orbit | NASA Space Apps Challenge 2026**  
**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions

ARI Cosmos is a **voice-first astronaut health-monitoring prototype** designed to help mission crews monitor physical and emotional well-being, recognize changes in self-reported symptoms, and review NASA-grounded reference material during simulated long-duration missions.

![Demo / prototype](https://img.shields.io/badge/status-educational%20prototype-76cfff?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)

## What ARI does

- Real-time voice conversations through Google Gemini Live, with visible speech and responses.
- Scheduled 09:00 and 16:00 health check-ins recording self-reported headache, dizziness, fatigue, stress, sleep, mood and other habits when supplied.
- Independent crew profiles, dated history, comparisons and explainable demonstration alerts.
- Illustrative mathematical symptom-trend extrapolations, **not medical forecasts**.
- Curated links to NASA Human Research Program (HRP) resources; ARI-generated suggestions are not official NASA medical guidance.
- Simulated Earth communication, with queued reports when the simulated link is interrupted.
- Interactive conceptual 3D habitat editor for Earth orbit, Moon and Mars scenarios, including solar-event, energy, water and communication simulations.

## Quick start (local demo)

**Requirements:** Node.js 22+; modern Chromium-based browser. A Gemini API key is needed for live voice (the interface and local simulations can run without one).

On Windows CMD:

```cmd
set "GEMINI_API_KEY=YOUR_GOOGLE_API_KEY"
set "ARI_PORT=8001"
node server.mjs
```

Open **http://localhost:8001/** and grant microphone permission when prompted. Keep your API key in the terminal or secure host environment variables: **never commit it to this repository**.

`localhost` and `127.0.0.1` keep separate browser storage. Use the same origin for a continuing demo.

For an HTTPS deployment with Node.js, see [ENTREGA_Y_PUBLICACION.md](ENTREGA_Y_PUBLICACION.md). GitHub Pages alone cannot provide the Gemini token endpoint used by this app.

## Validation and limitations

The project includes a deterministic test script:

```bash
node tests/validacion.mjs
```

Conversational test cases have been exercised manually with fictitious health data: historical comparisons, NASA references, emotional support, symptom trend explanation, crew identification, and scientific uncertainty. The 3D habitat and Earth-link behavior are educational simulations, not engineering or clinical validation.

**No real medical measurements are automatically captured.** Stored demonstration records are local to the browser. ARI is not a medical device, does not diagnose conditions, and is not certified for crew operational use.

## Sources and attribution

- [NASA HRP — Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)
- [NASA HRP — Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)
- [NASA HRP — Ongoing Research](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- Full list: [CITAS_NASA.md](CITAS_NASA.md)

**AI use disclosure:** Google Gemini Live powers conversational responses and generated voice. ChatGPT assisted with code development, interface concepts, debugging, testing and documentation. The team directed and tested the implementation. NASA is a source of cited research material, not a sponsor or operator of ARI.

## Documents

- [Spanish project guide](LEEME.md)
- [NASA source references](CITAS_NASA.md)
- [Pitch and submission notes](PITCH_ARI.md)
- [Final test checklist](PRUEBAS_FINALES.md)
- [Publishing instructions](ENTREGA_Y_PUBLICACION.md)

Released under the [MIT License](LICENSE) for the team's original source code. Third-party trademarks, services and referenced NASA content retain their respective terms.
