import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Local by default; configure ARI_PUBLIC_ORIGIN and ARI_HOST for an HTTPS Node deployment.
const port = Number(process.env.PORT ?? process.env.ARI_PORT ?? 8001);
const bindHost = process.env.ARI_HOST || (process.env.ARI_PUBLIC_ORIGIN ? "0.0.0.0" : "127.0.0.1");
const publicOrigin = process.env.ARI_PUBLIC_ORIGIN?.replace(/\/$/, "") || null;
if (publicOrigin && (!/^https:\/\//i.test(publicOrigin) || new URL(publicOrigin).pathname !== "/")) {
  throw new Error("ARI_PUBLIC_ORIGIN debe ser una URL HTTPS sin ruta, por ejemplo https://ari.ejemplo.com");
}
const publicHost = publicOrigin ? new URL(publicOrigin).host : null;
const candidateKey = process.env.GEMINI_API_KEY?.trim();
const key = candidateKey && !/(?:^TU_CLAVE|^PEGA_)/i.test(candidateKey) ? candidateKey : null;
const model = process.env.ARI_GEMINI_MODEL || "gemini-3.8-live";
const dir = fileURLToPath(new URL(".", import.meta.url));
const mime = {
  "index.html": "text/html; charset=utf-8", "style.css": "text/css; charset=utf-8",
  "script.js": "application/javascript; charset=utf-8", "references.js": "application/javascript; charset=utf-8", "realtime.js": "application/javascript; charset=utf-8",
  "sw.js": "application/javascript; charset=utf-8",
  "ari-experience.css": "text/css; charset=utf-8", "ari-experience.js": "application/javascript; charset=utf-8",
  "habitat.css": "text/css; charset=utf-8", "habitat.js": "application/javascript; charset=utf-8"
};
const hosts = new Set(["localhost:" + port, "127.0.0.1:" + port, ...(publicHost ? [publicHost] : [])]);
let connecting = false;
const limits = new Map();
function rateLimited(req) {
  const id = req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  for (const [ip, row] of limits) if (now - row.start > 60_000) limits.delete(ip);
  const row = limits.get(id) ?? {start:now,count:0};
  if (now - row.start > 60_000) {row.start=now;row.count=0;}
  row.count++;
  limits.set(id,row);
  return row.count > 6; // 6 attempts/min/IP. Does not prevent all abuse on a public URL.
}

function send(res, status, type, body) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

function json(res, status, body) {
  send(res, status, "application/json; charset=utf-8", JSON.stringify(body));
}

async function createToken(req, res) {
  const allowed = new Set(["http://localhost:"+port,"http://127.0.0.1:"+port,...(publicOrigin ? [publicOrigin] : [])]);
  if (!allowed.has(req.headers.origin)) {
    return json(res, 403, { error: "Iniciá Gemini Live desde el origen permitido de ARI." });
  }
  if (rateLimited(req)) return json(res, 429, { error: "Demasiadas conexiones en un minuto. Volvé a intentarlo más tarde." });
  if (!key) return json(res, 503, { error: "Configurá GEMINI_API_KEY en el servidor para habilitar voz Gemini." });
  if (connecting) return json(res, 429, { error: "ARI ya está abriendo una sesión." });
  connecting = true;
  try {
    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        uses: 1,
        newSessionExpireTime: new Date(Date.now() + 60000).toISOString(),
        expireTime: new Date(Date.now() + 600000).toISOString()
      }),
      signal: AbortSignal.timeout(15000)
    });
    const body = await upstream.json();
    if (upstream.ok && typeof body.name === "string") return json(res, 200, { token: body.name, model });
    const code = body.error?.details?.find((info) => typeof info.reason === "string")?.reason;
    const invalidKey = code === "API_KEY_INVALID" || upstream.status === 401;
    const reason = invalidKey ? "Google rechazó la clave de Gemini." : {
      403: "Google denegó el acceso. Revisá el proyecto y la disponibilidad de Gemini Live.",
      429: "Se alcanzó el límite del proyecto. Revisá la cuota gratuita en Google AI Studio."
    }[upstream.status] ?? "Google no pudo crear una sesión de voz.";
    return json(res, 502, { error: reason + " (" + upstream.status + ")" });
  } finally {
    connecting = false;
  }
}

const server = createServer(async (req,res) => {
  try {
    if (!hosts.has(req.headers.host)) return json(res, 403, { error: "Usá localhost." });
    const path = new URL(req.url, "http://localhost").pathname;
    if (req.method === "POST" && path === "/api/gemini/token") return await createToken(req,res);
    if (req.method === "GET" && path === "/api/config") return json(res,200,{ service:"ari-gemini", realtime: Boolean(key) });
    const prefix = path.startsWith("/ARI/") ? "/ARI/" : "/";
    const name = path === prefix ? "index.html" : path.slice(prefix.length);
    if (req.method !== "GET" || !Object.hasOwn(mime,name)) return json(res,404,{ error:"Archivo no encontrado." });
    send(res,200,mime[name],await readFile(resolve(dir,name)));
  } catch (error) {
    console.error("Servidor ARI:", error.name);
    if (!res.headersSent && !res.destroyed) json(res,502,{ error:"El servidor no pudo completar la conexión. Revisá internet e intentá de nuevo." });
  }
});

server.listen(port,bindHost,() =>
  console.log("ARI iniciado en " + bindHost + ":" + port +
    " · Gemini Live " + (key ? "configurado" : "requiere GEMINI_API_KEY") +
    (publicOrigin ? " · Origen público autorizado: "+publicOrigin : " · Solo acceso local") + "."));
