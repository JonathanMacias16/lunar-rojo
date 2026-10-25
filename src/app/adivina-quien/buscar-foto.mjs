// Busca la foto principal de un personaje en Wikipedia o en un wiki de Fandom.
// La usan la página (/adivina-quien/foto/<id>) y scripts/fotos-adivina-quien.mjs.
//
// Una fuente puede ser:
//   "wiki:Título exacto"           → la foto principal de esa página
//   "wiki?texto a buscar"          → la foto principal de la primera página que encuentre
//   "wiki:Título#palabra|otra"     → de las imágenes de esa página, la primera cuyo nombre
//                                    tenga alguna de esas palabras (para páginas sin foto principal)

// Dirección de la API de cada wiki
const WIKIS = {
    w: "https://en.wikipedia.org/w/api.php",
    es: "https://es.wikipedia.org/w/api.php",
    villanos: "https://villains.fandom.com/api.php",
    heroes: "https://heroes.fandom.com/api.php",
    disney: "https://disney.fandom.com/api.php",
    simpson: "https://simpsons.fandom.com/api.php",
}

// Solo se aceptan fotos de estos servidores
const SERVIDORES_DE_FOTOS = ["upload.wikimedia.org", "static.wikia.nocookie.net"]

export const AGENTE = "LunarRojoAdivinaQuien/1.0 (https://lunar-rojo.vercel.app/adivina-quien)"

/** @param {string} api @param {URLSearchParams} p */
const consultar = async (api, p) => {
    p.set("format", "json")
    p.set("formatversion", "2")
    const r = await fetch(`${api}?${p}`, { headers: { "User-Agent": AGENTE } })
    if (!r.ok) throw new Error(`${r.status} en ${new URL(api).hostname}`)
    return r.json()
}

// Imágenes que no son el personaje (logos, íconos, banderitas…)
const ES_ADORNO = /(\.svg$|logo|icon|ícono|flag|bandera|signature|firma|stub|wiki|placeholder|banner|navbox|disambig)/i

// De las imágenes de una página, la primera cuyo nombre tenga alguna de las palabras
/** @param {string} api @param {string} titulo @param {string} palabras @param {number} ancho */
const imagenConPalabra = async (api, titulo, palabras, ancho) => {
    const datos = await consultar(api, new URLSearchParams({ action: "parse", page: titulo, prop: "images", redirects: "1" }))
    /** @type {string[]} */
    const imagenes = datos.parse?.images ?? []
    const buscadas = palabras.toLowerCase().split("|").filter(Boolean)
    const archivo = imagenes.find(
        (x) => !ES_ADORNO.test(x) && buscadas.some((palabra) => x.toLowerCase().replace(/_/g, " ").includes(palabra))
    )
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
 * @returns {Promise<{ url: string, archivo: string, pagina: string, enlace: string } | null>}
 */
export async function buscarFoto(fuente, ancho) {
    const exacta = fuente.match(/^(\w+):(.+)$/)
    const busqueda = fuente.match(/^(\w+)\?(.+)$/)
    const [, wiki, resto] = exacta ?? busqueda ?? []
    const api = WIKIS[/** @type {keyof typeof WIKIS} */ (wiki)]
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
    if (!pagina) return null

    const foto = palabras
        ? await imagenConPalabra(api, pagina.title, palabras, ancho)
        : pagina.thumbnail
            ? { url: pagina.thumbnail.source, archivo: pagina.pageimage ?? "" }
            : null
    if (!foto || !SERVIDORES_DE_FOTOS.includes(new URL(foto.url).hostname)) return null
    return { ...foto, pagina: pagina.title, enlace: pagina.fullurl }
}
