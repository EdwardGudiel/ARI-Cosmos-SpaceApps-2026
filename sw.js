"use strict";

const CACHE = "ari-app-v27";
const FILES = ["./", "./index.html", "./ari-experience.css", "./ari-experience.js", "./habitat.css", "./habitat.js"];
const PAGE = new URL("./index.html", self.registration.scope);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(
    FILES.map((file) => new Request(file, { cache: "reload" }))
  )).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("ari-app-") && key !== CACHE).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate" && (url.pathname === PAGE.pathname || url.pathname === new URL(self.registration.scope).pathname)) {
    event.respondWith(fetch(request).catch(() => caches.match(PAGE)));
    return;
  }
  if (FILES.some((file) => new URL(file, self.registration.scope).href === url.href)) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  }
});
