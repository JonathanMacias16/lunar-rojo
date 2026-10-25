// Busca la foto principal de un personaje en Wikipedia o en un wiki de Fandom.
// La usan la página (/adivina-quien/foto/<id>) y scripts/fotos-adivina-quien.mjs.
//
// Una fuente puede ser:
//   "wiki:Título exacto"           → la foto principal de esa página
//   "wiki?texto a buscar"          → la foto principal de la primera página que encuentre
//   "wiki:Título#palabra|otra"     → de las imágenes de esa página, la primera cuyo nombre
//                                    tenga alguna de esas palabras (para páginas sin foto principal)
// "wiki" es uno de los de abajo o "f.<nombre>" para el wiki <nombre>.fandom.com

// Dirección de la API de cada wiki
const WIKIS = {
    w: "https://en.wikipedia.org/w/api.php",
    es: "https://es.wikipedia.org/w/api.php",
    villanos: "https://villains.fandom.com/api.php",
    heroes: "https://hero.fandom.com/api.php",
    disney: "https://disney.fandom.com/api.php",
    simpson: "https://simpsons.fandom.com/api.php",
}

// Solo se aceptan fotos de los servidores de Wikipedia y Fandom
const SERVIDORES_DE_FOTOS = ["wikimedia.org", "nocookie.net"]
/** @param {string} url */
const servidorConfiable = (url) => {
    const servidor = new URL(url).hostname
    return SERVIDORES_DE_FOTOS.some((s) => servidor === s || servidor.endsWith(`.${s}`))
}

export const AGENTE = "LunarRojoAdivinaQuien/1.0 (https://lunar-rojo.vercel.app/adivina-quien)"

// Un error que puede no repetirse (el wiki tardó, se cayó o pidió esperar).
// Con estos no hay que recordar que el personaje no tiene foto.
export class FallaPasajera extends Error {}

/** @param {string} api @param {URLSearchParams} p */
const consultar = async (api, p) => {
    p.set("format", "json")
    p.set("formatversion", "2")
    const servidor = new URL(api).hostname
    let r
    try {
        r = await fetch(`${api}?${p}`, { headers: { "User-Agent": AGENTE }, signal: AbortSignal.timeout(8000) })
    } catch (e) {
        throw new FallaPasajera(`no respondió ${servidor} (${e instanceof Error ? e.name : e})`)
    }
    if (r.status === 429 || r.status >= 500) throw new FallaPasajera(`${r.status} en ${servidor}`)
    if (!r.ok) throw new Error(`${r.status} en ${servidor}`)
    try {
        return await r.json()
    } catch {
        throw new FallaPasajera(`respuesta cortada de ${servidor}`)
    }
}

// Imágenes que no son el personaje (logos, íconos, banderitas…)
const ES_ADORNO = /(\.svg$|logo|icon|ícono|flag|bandera|signature|firma|stub|wiki|placeholder|banner|navbox|disambig)/i

// De las imágenes de una página, la primera cuyo nombre tenga alguna de las palabras (en ese orden)
/** @param {string} api @param {string} titulo @param {string} palabras @param {number} ancho */
const imagenConPalabra = async (api, titulo, palabras, ancho) => {
    const datos = await consultar(api, new URLSearchParams({ action: "parse", page: titulo, prop: "images", redirects: "1" }))
    /** @type {string[]} */
    const imagenes = datos.parse?.images ?? []
    const nombres = imagenes.filter((x) => !ES_ADORNO.test(x))
    const normal = (/** @type {string} */ x) => x.toLowerCase().replace(/_/g, " ")
    // La primera palabra manda: solo si ninguna imagen la tiene se prueba la siguiente
    let archivo
    for (const palabra of palabras.toLowerCase().split("|").filter(Boolean)) {
        archivo = nombres.find((x) => normal(x).includes(palabra))
        if (archivo) break
    }
    if (!archivo) return null
    const info = await consultar(
        api,
        new URLSearchParams({ action: "query", titles: `File:${archivo}`, prop: "imageinfo", iiprop: "url", iiurlwidth: String(ancho) })
    )
    const url = info.query?.pages?.[0]?.imageinfo?.[0]?.thumburl
    return url ? { url, archivo } : null
}

/**
 * @param {string} fuente
 * @param {number} ancho ancho de la foto en píxeles (Wikipedia prefiere 250, 330, 500 o 960)
 * @returns {Promise<{ url: string, archivo: string, pagina: string, enlace: string }>}
 * Si no hay foto, lanza un error que dice por qué.
 */
export async function buscarFoto(fuente, ancho) {
    const exacta = fuente.match(/^([\w.-]+):(.+)$/)
    const busqueda = fuente.match(/^([\w.-]+)\?(.+)$/)
    const [, wiki = "", resto = ""] = exacta ?? busqueda ?? []
    const fandom = wiki.match(/^f\.([a-z0-9-]+)$/)
    const api = fandom ? `https://${fandom[1]}.fandom.com/api.php` : WIKIS[/** @type {keyof typeof WIKIS} */ (wiki)]
    if (!api) throw new Error(`Fuente mal escrita: ${fuente}`)
    const [texto, palabras] = exacta ? resto.split("#") : [resto]

    const p = new URLSearchParams({
        action: "query",
        redirects: "1",
        prop: "pageimages|info",
        inprop: "url",
        piprop: "thumbnail|name",
        pithumbsize: String(ancho),
        pilicense: "any",
    })
    if (exacta) p.set("titles", texto)
    else {
        p.set("generator", "search")
        p.set("gsrsearch", texto)
        p.set("gsrlimit", "1")
        p.set("gsrnamespace", "0")
    }

    const datos = await consultar(api, p)
    /** @type {{ title: string, fullurl: string, missing?: boolean, pageimage?: string, thumbnail?: { source: string } } | undefined} */
    const pagina = datos.query?.pages?.find((/** @type {any} */ x) => !x.missing)
    if (!pagina) throw new Error(exacta ? "no existe la página" : "la búsqueda no encontró nada")

    const foto = palabras
        ? await imagenConPalabra(api, pagina.title, palabras, ancho)
        : pagina.thumbnail && !ES_ADORNO.test(pagina.pageimage ?? "")
            ? { url: pagina.thumbnail.source, archivo: pagina.pageimage ?? "" }
            : null
    if (!foto) {
        throw new Error(
            palabras ? `«${pagina.title}» no tiene imágenes con esas palabras` : `«${pagina.title}» no tiene foto principal`
        )
    }
    if (!servidorConfiable(foto.url)) throw new Error(`foto en otro servidor: ${foto.url}`)
    return { ...foto, pagina: pagina.title, enlace: pagina.fullurl }
}
