// Service worker de "¿Es mexicano?".
// Deja usar el buscador sin internet después de la primera visita
// (dentro del súper casi nunca hay señal) y permite instalarla como app.
const CACHE = "hecho-en-mexico-v1"
const PAGINA = "/hecho-en-mexico"

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        (async () => {
            const nombres = await caches.keys()
            await Promise.all(
                nombres
                    .filter((nombre) => nombre.startsWith("hecho-en-mexico-") && nombre !== CACHE)
                    .map((nombre) => caches.delete(nombre))
            )
            await self.clients.claim()
        })()
    )
})

// Archivos que nunca cambian (Next les pone un hash en el nombre)
const esArchivoFijo = (url) =>
    url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/hecho-en-mexico-")

self.addEventListener("fetch", (evento) => {
    const { request } = evento
    if (request.method !== "GET") return
    const url = new URL(request.url)
    if (url.origin !== self.location.origin) return

    // La página: primero de internet; si no hay conexión, la copia guardada
    if (request.mode === "navigate") {
        evento.respondWith(
            (async () => {
                try {
                    const respuesta = await fetch(request)
                    if (respuesta.ok && url.pathname === PAGINA) {
                        const cache = await caches.open(CACHE)
                        await cache.put(PAGINA, respuesta.clone())
                    }
                    return respuesta
                } catch {
                    return (await caches.match(PAGINA)) ?? Response.error()
                }
            })()
        )
        return
    }

    // Archivos fijos: primero la copia guardada
    if (esArchivoFijo(url)) {
        evento.respondWith(
            (async () => {
                const guardada = await caches.match(request)
                if (guardada) return guardada
                const respuesta = await fetch(request)
                if (respuesta.ok) {
                    const cache = await caches.open(CACHE)
                    await cache.put(request, respuesta.clone())
                }
                return respuesta
            })()
        )
    }
})
