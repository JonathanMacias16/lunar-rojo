// Baja, recorta y optimiza las fotos de los personajes del Adivina Quién.
//
//   node scripts/fotos-adivina-quien.mjs            → todas las que faltan
//   node scripts/fotos-adivina-quien.mjs freddy zim → solo esas (aunque ya existan)
//
// Cada personaje tiene una o más fuentes que se prueban en orden:
//   "wiki:Título exacto"  → la foto principal de esa página
//   "wiki?texto a buscar" → la foto de la primera página que encuentre
// Las fotos quedan en public/adivina-quien/fotos/<id>.webp y la lista en
// src/app/adivina-quien/fotos.json (la página solo usa las que estén ahí).

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const RAIZ = path.resolve(import.meta.dirname, "..")
const CARPETA = path.join(RAIZ, "public/adivina-quien/fotos")
const LISTA = path.join(RAIZ, "src/app/adivina-quien/fotos.json")
const ANCHO = 360
const ALTO = 480

// Dirección de la API de cada wiki
const WIKIS = {
    w: "https://en.wikipedia.org/w/api.php",
    es: "https://es.wikipedia.org/w/api.php",
    villanos: "https://villains.fandom.com/api.php",
    heroes: "https://heroes.fandom.com/api.php",
    disney: "https://disney.fandom.com/api.php",
    simpson: "https://simpsons.fandom.com/api.php",
}

const FUENTES = {
    // Monstruos clásicos
    orlok: ["w:Count Orlok"],
    dracula: ["villanos:Count Dracula (Universal)", "w:Dracula (1931 English-language film)"],
    frankenstein: ["w:Frankenstein's monster"],
    momia: ["villanos:Imhotep (Universal)", "w:Imhotep (The Mummy)", "w:The Mummy (1932 film)"],
    novia: ["w:Bride of Frankenstein"],
    "hombre-lobo": ["w:Wolf Man (character)", "w:The Wolf Man (1941 film)"],
    criatura: ["w:Gill-man"],

    // Terror de película
    "norman-bates": ["w:Norman Bates"],
    regan: ["w:Regan MacNeil"],
    leatherface: ["w:Leatherface"],
    carrie: ["w:Carrie White"],
    damien: ["w:Damien Thorn"],
    "michael-myers": ["w:Michael Myers (Halloween)"],
    xenomorfo: ["w:Xenomorph"],
    jason: ["w:Jason Voorhees"],
    "jack-torrance": ["w:Jack Torrance"],
    "gemelas-grady": ["villanos:Grady Twins", "villanos?Grady twins Shining"],
    ash: ["w:Ash Williams"],
    freddy: ["w:Freddy Krueger"],
    gizmo: ["heroes:Gizmo (Gremlins)", "heroes?Gizmo Gremlins mogwai"],
    stripe: ["villanos:Stripe (Gremlins)", "villanos?Stripe Gremlins"],
    pegajoso: ["w:Slimer"],
    malvavisco: ["w:Stay Puft Marshmallow Man"],
    pinhead: ["w:Pinhead (Hellraiser)"],
    depredador: ["w:Predator (fictional species)"],
    chucky: ["w:Chucky"],
    beetlejuice: ["w:Beetlejuice (character)", "villanos?Betelgeuse Beetlejuice"],
    lydia: ["w:Lydia Deetz"],
    "edward-tijeras": ["heroes:Edward Scissorhands", "w:Edward Scissorhands"],
    hannibal: ["w:Hannibal Lecter"],
    "homero-addams": ["w:Gomez Addams"],
    morticia: ["w:Morticia Addams"],
    "tio-lucas": ["w:Uncle Fester"],
    largo: ["w:Lurch (The Addams Family)"],
    candyman: ["w:Candyman (character)"],
    winifred: ["disney:Winifred Sanderson"],
    "mary-sanderson": ["disney:Mary Sanderson"],
    "sarah-sanderson": ["disney:Sarah Sanderson"],
    binx: ["disney:Thackery Binx"],
    ghostface: ["w:Ghostface (identity)"],
    jinete: ["villanos:Headless Horseman (Sleepy Hollow)", "villanos?Headless Horseman Sleepy Hollow 1999"],
    creeper: ["w:The Creeper (Jeepers Creepers)"],
    samara: ["w:Samara Morgan"],
    "billy-saw": ["w:Billy the Puppet"],
    sweeney: ["villanos:Sweeney Todd (Tim Burton)", "villanos?Sweeney Todd Demon Barber Fleet Street"],
    "edward-cullen": ["w:Edward Cullen"],
    annabelle: ["villanos:Annabelle (The Conjuring Universe)", "villanos?Annabelle doll Conjuring"],
    babadook: ["villanos:The Babadook", "w:The Babadook"],
    art: ["w:Art the Clown"],
    pennywise: ["w:It (character)"],
    valak: ["villanos:Valak (The Conjuring Universe)", "villanos?Valak demon nun"],
    llorona: ["villanos:La Llorona (The Conjuring Universe)", "villanos?La Llorona Curse"],
    grabber: ["villanos:The Grabber", "villanos?Grabber Black Phone"],
    m3gan: ["villanos:M3GAN", "w:M3GAN"],
    fazbear: ["w:Freddy Fazbear"],

    // Películas animadas
    "bruja-blancanieves": ["w:Evil Queen (Disney)"],
    malefica: ["w:Maleficent"],
    ursula: ["w:Ursula (The Little Mermaid)"],
    jack: ["w:Jack Skellington"],
    sally: ["w:Sally (The Nightmare Before Christmas)"],
    oogie: ["w:Oogie Boogie"],
    zero: ["disney:Zero", "disney?Zero ghost dog Nightmare Before Christmas"],
    alcalde: ["disney:Mayor of Halloween Town", "disney?Mayor Halloween Town"],
    sulley: ["w:James P. Sullivan"],
    mike: ["w:Mike Wazowski"],
    randall: ["w:Randall Boggs"],
    boo: ["w:Boo (Monsters, Inc.)"],
    emily: ["heroes:Emily (Corpse Bride)", "heroes?Emily Corpse Bride"],
    victor: ["heroes:Victor Van Dort", "heroes?Victor Van Dort Corpse Bride"],
    "casa-monstruo": ["w:Monster House (film)"],
    nahuala: ["es:La leyenda de la Nahuala"],
    coraline: ["heroes:Coraline Jones", "w:Coraline (film)"],
    "otra-madre": ["villanos:The Beldam", "villanos?Beldam Other Mother Coraline"],
    drac: ["heroes:Dracula (Hotel Transylvania)", "heroes?Dracula Hotel Transylvania"],
    mavis: ["heroes:Mavis Dracula", "heroes?Mavis Hotel Transylvania"],
    "norman-babcock": ["heroes:Norman Babcock", "w:ParaNorman"],
    sparky: ["heroes:Sparky (Frankenweenie)", "heroes?Sparky Frankenweenie"],
    "la-muerte": ["heroes:La Muerte", "heroes?La Muerte Book of Life"],
    xibalba: ["villanos:Xibalba"],
    hector: ["heroes:Héctor Rivera", "heroes?Hector Coco Pixar"],

    // Series
    herman: ["w:Herman Munster"],
    "lily-monster": ["w:Lily Munster"],
    "conde-contar": ["w:Count von Count"],
    slappy: ["w:Slappy the Dummy"],
    salem: ["w:Salem Saberhagen"],
    sabrina: ["heroes:Sabrina Spellman (1996)", "w:Sabrina Spellman"],
    buffy: ["w:Buffy Summers"],
    once: ["w:Eleven (Stranger Things)"],
    demogorgon: ["villanos:Demogorgon (Stranger Things)", "villanos?Demogorgon Stranger Things"],
    vecna: ["villanos:Vecna (Stranger Things)", "villanos?Vecna Henry Creel"],
    merlina: ["heroes:Wednesday Addams (Wednesday)", "w:Wednesday Addams"],
    enid: ["heroes:Enid Sinclair", "heroes?Enid Sinclair Wednesday"],
    dedos: ["w:Thing (The Addams Family)"],

    // Caricaturas
    gasparin: ["w:Casper the Friendly Ghost"],
    scooby: ["w:Scooby-Doo (character)"],
    patula: ["heroes:Count Duckula", "w:Count Duckula"],
    el: ["w:Him (The Powerpuff Girls)"],
    coraje: ["heroes:Courage (Courage the Cowardly Dog)", "w:Courage the Cowardly Dog"],
    holandes: ["villanos:Flying Dutchman (SpongeBob SquarePants)", "villanos?Flying Dutchman SpongeBob"],
    zim: ["w:Zim (Invader Zim)"],
    "puro-hueso": ["heroes:Grim (The Grim Adventures of Billy & Mandy)", "heroes?Grim Billy Mandy"],
    mandy: ["villanos:Mandy (The Grim Adventures of Billy & Mandy)", "villanos?Mandy Grim Adventures"],
    danny: ["heroes:Danny Phantom (character)", "heroes?Danny Phantom Fenton"],
    marceline: ["w:Marceline the Vampire Queen"],
    draculaura: ["heroes:Draculaura", "heroes?Draculaura Monster High"],
    bill: ["w:Bill Cipher"],

    // Los Simpson: La casita del horror
    "kang-kodos": ["w:Kang and Kodos"],
    "bart-cuervo": ["simpson:The Raven", "simpson?The Raven Treehouse of Horror"],
    "bart-poderoso": ["simpson:Bart's Nightmare", "simpson?Bart's Nightmare Treehouse of Horror II"],
    "muneco-krusty": ["simpson:Clown Without Pity", "simpson?Krusty Doll evil"],
    "king-homero": ["simpson:King Homer"],
    "flanders-zombi": ["simpson:Dial Z for Zombies"],
    "flanders-diablo": ["simpson:Devil Flanders", "simpson?Devil Flanders"],
    "homero-dona": ["simpson:The Devil and Homer Simpson"],
    "burns-dracula": ["simpson:Bart Simpson's Dracula"],
    "homero-resplandor": ["simpson:The Shinning"],
    willie: ["simpson:Nightmare on Evergreen Terrace"],
    "homero-3d": ["simpson:Homer³", "simpson?Homer3 Treehouse of Horror VI"],
    hugo: ["simpson:Hugo Simpson"],
    "bart-mosca": ["simpson:Fly vs. Fly"],
    "marge-bruja": ["simpson:Easy-Bake Coven"],
}

const AGENTE = "LunarRojoAdivinaQuien/1.0 (https://lunar-rojo.vercel.app/adivina-quien)"
const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

const pedir = async (url) => {
    const r = await fetch(url, { headers: { "User-Agent": AGENTE } })
    if (!r.ok) throw new Error(`${r.status} ${url}`)
    return r
}

// La foto principal de una página (o de la primera que salga al buscar)
const buscarFoto = async (fuente) => {
    const exacta = fuente.match(/^(\w+):(.+)$/)
    const busqueda = fuente.match(/^(\w+)\?(.+)$/)
    const [, wiki, texto] = exacta ?? busqueda ?? []
    if (!WIKIS[wiki]) throw new Error(`Fuente mal escrita: ${fuente}`)
    const p = new URLSearchParams({
        action: "query",
        format: "json",
        formatversion: "2",
        redirects: "1",
        prop: "pageimages|info",
        inprop: "url",
        piprop: "thumbnail|name",
        pithumbsize: "720",
        pilicense: "any",
    })
    if (exacta) p.set("titles", texto)
    else {
        p.set("generator", "search")
        p.set("gsrsearch", texto)
        p.set("gsrlimit", "1")
        p.set("gsrnamespace", "0")
    }
    const datos = await (await pedir(`${WIKIS[wiki]}?${p}`)).json()
    const pagina = datos.query?.pages?.find((x) => x.thumbnail?.source)
    if (!pagina) return null
    return { url: pagina.thumbnail.source, archivo: pagina.pageimage, pagina: pagina.title, enlace: pagina.fullurl }
}

const main = async () => {
    const pedidos = process.argv.slice(2)
    const lista = JSON.parse(await fs.readFile(LISTA, "utf8").catch(() => "{}"))
    await fs.mkdir(CARPETA, { recursive: true })

    const ids = pedidos.length ? pedidos : Object.keys(FUENTES).filter((id) => !lista[id])
    const fallidos = []
    for (const id of ids) {
        const fuentes = FUENTES[id]
        if (!fuentes) {
            console.log(`? ${id}: no tiene fuentes`)
            continue
        }
        let hecho = false
        for (const fuente of fuentes) {
            try {
                const foto = await buscarFoto(fuente)
                if (!foto) continue
                const original = Buffer.from(await (await pedir(foto.url)).arrayBuffer())
                const salida = await sharp(original, { animated: false })
                    .rotate()
                    .resize(ANCHO, ALTO, { fit: "cover", position: sharp.strategy.attention })
                    .webp({ quality: 72 })
                    .toBuffer()
                await fs.writeFile(path.join(CARPETA, `${id}.webp`), salida)
                lista[id] = { pagina: foto.pagina, archivo: foto.archivo, enlace: foto.enlace }
                console.log(`✓ ${id}: ${foto.pagina} → ${foto.archivo} (${Math.round(salida.length / 1024)} KB)`)
                hecho = true
                break
            } catch (e) {
                console.log(`  ${id}: falló ${fuente} (${e.message})`)
            }
            await esperar(150)
        }
        if (!hecho) fallidos.push(id)
        await esperar(150)
    }

    const ordenada = Object.fromEntries(Object.entries(lista).sort(([a], [b]) => a.localeCompare(b)))
    await fs.writeFile(LISTA, JSON.stringify(ordenada, null, 4) + "\n")
    console.log(`\n${Object.keys(ordenada).length} con foto.${fallidos.length ? ` Sin foto: ${fallidos.join(", ")}` : ""}`)
}

main()
