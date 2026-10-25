// Personajes del Adivina Quién de Halloween y lo que se puede preguntar de ellos.
import listaFotos from "./fotos.json"

// Lo que se pregunta. Los primeros cuatro salen de dónde viene el personaje;
// los demás se anotan a mano en cada uno.
export type Rasgo =
    | "animado"
    | "pelicula"
    | "simpson"
    | "clasico"
    | "mujer"
    | "villano"
    | "humano"
    | "joven"
    | "animal"
    | "sombrero"
    | "mascara"
    | "arma"

type RasgoPropio = Exclude<Rasgo, "animado" | "pelicula" | "simpson" | "clasico">

export const preguntas: { rasgo: Rasgo; texto: string; ficha: string }[] = [
    { rasgo: "mujer", texto: "¿Es mujer?", ficha: "Es mujer" },
    { rasgo: "villano", texto: "¿Es de los malos?", ficha: "Es de los malos" },
    { rasgo: "humano", texto: "¿Es humano?", ficha: "Es humano" },
    { rasgo: "joven", texto: "¿Es niño, niña o adolescente?", ficha: "Es niño o adolescente" },
    { rasgo: "animal", texto: "¿Es un animal?", ficha: "Es un animal" },
    { rasgo: "sombrero", texto: "¿Usa sombrero?", ficha: "Usa sombrero" },
    { rasgo: "mascara", texto: "¿Usa máscara?", ficha: "Usa máscara" },
    { rasgo: "arma", texto: "¿Trae un arma?", ficha: "Trae un arma" },
    { rasgo: "animado", texto: "¿Es de caricatura?", ficha: "Es de caricatura" },
    { rasgo: "pelicula", texto: "¿Es de una película?", ficha: "Es de película (no de serie)" },
    { rasgo: "simpson", texto: "¿Es de Los Simpson?", ficha: "Es de Los Simpson" },
    { rasgo: "clasico", texto: "¿Es de antes del 2000?", ficha: "Es de antes del 2000" },
]

export const textoDe = (rasgo: Rasgo) => preguntas.find((p) => p.rasgo === rasgo)?.texto ?? ""

type Fuente = { titulo: string; tipo: "pelicula" | "serie"; animado: boolean; anio: number }

const peli = (titulo: string, anio: number): Fuente => ({ titulo, tipo: "pelicula", animado: false, anio })
const peliAnimada = (titulo: string, anio: number): Fuente => ({ titulo, tipo: "pelicula", animado: true, anio })
const serie = (titulo: string, anio: number): Fuente => ({ titulo, tipo: "serie", animado: false, anio })
const caricatura = (titulo: string, anio: number): Fuente => ({ titulo, tipo: "serie", animado: true, anio })
const casita = (numero: string, anio: number) => caricatura(`Los Simpson: La casita del horror ${numero}`, anio)

const fuentes = {
    // Terror y monstruos de película
    nosferatu: peli("Nosferatu", 1922),
    dracula: peli("Drácula", 1931),
    frankenstein: peli("Frankenstein", 1931),
    momia: peli("La momia", 1932),
    novia: peli("La novia de Frankenstein", 1935),
    hombreLobo: peli("El hombre lobo", 1941),
    laguna: peli("El monstruo de la laguna negra", 1954),
    psicosis: peli("Psicosis", 1960),
    exorcista: peli("El exorcista", 1973),
    masacre: peli("La masacre de Texas", 1974),
    carrie: peli("Carrie", 1976),
    profecia: peli("La profecía", 1976),
    halloween: peli("Halloween", 1978),
    alien: peli("Alien: el octavo pasajero", 1979),
    viernes13: peli("Viernes 13", 1980),
    resplandor: peli("El resplandor", 1980),
    evilDead: peli("Evil Dead", 1981),
    pesadilla: peli("Pesadilla en la calle del infierno", 1984),
    gremlins: peli("Gremlins", 1984),
    cazafantasmas: peli("Cazafantasmas", 1984),
    hellraiser: peli("Hellraiser", 1987),
    depredador: peli("Depredador", 1987),
    chucky: peli("Chucky: el muñeco diabólico", 1988),
    beetlejuice: peli("Beetlejuice", 1988),
    manosTijera: peli("El joven manos de tijera", 1990),
    silencio: peli("El silencio de los inocentes", 1991),
    addams: peli("Los locos Addams", 1991),
    candyman: peli("Candyman", 1992),
    abracadabra: peli("Abracadabra", 1993),
    scream: peli("Scream", 1996),
    jineteSinCabeza: peli("La leyenda del jinete sin cabeza", 1999),
    jeepers: peli("Jeepers Creepers", 2001),
    aro: peli("El aro", 2002),
    saw: peli("El juego del miedo", 2004),
    sweeney: peli("Sweeney Todd", 2007),
    crepusculo: peli("Crepúsculo", 2008),
    annabelle: peli("Annabelle", 2014),
    babadook: peli("Babadook", 2014),
    terrifier: peli("Terrifier", 2016),
    it: peli("It (Eso)", 2017),
    monja: peli("La monja", 2018),
    llorona: peli("La maldición de la Llorona", 2019),
    telefono: peli("El teléfono negro", 2022),
    m3gan: peli("M3GAN", 2022),
    fnaf: peli("Five Nights at Freddy's", 2023),

    // Películas animadas
    blancanieves: peliAnimada("Blancanieves y los siete enanos", 1937),
    bellaDurmiente: peliAnimada("La bella durmiente", 1959),
    sirenita: peliAnimada("La sirenita", 1989),
    extranoMundo: peliAnimada("El extraño mundo de Jack", 1993),
    monstersInc: peliAnimada("Monsters, Inc.", 2001),
    cadaver: peliAnimada("El cadáver de la novia", 2005),
    monsterHouse: peliAnimada("Monster House", 2006),
    nahuala: peliAnimada("La leyenda de la Nahuala", 2007),
    coraline: peliAnimada("Coraline y la puerta secreta", 2009),
    hotelT: peliAnimada("Hotel Transylvania", 2012),
    paranorman: peliAnimada("ParaNorman", 2012),
    frankenweenie: peliAnimada("Frankenweenie", 2012),
    libroVida: peliAnimada("El libro de la vida", 2014),
    coco: peliAnimada("Coco", 2017),

    // Series
    munster: serie("La familia Monster", 1964),
    sesamo: serie("Plaza Sésamo", 1972),
    escalofrios: serie("Escalofríos", 1995),
    sabrina: serie("Sabrina, la bruja adolescente", 1996),
    buffy: serie("Buffy, la cazavampiros", 1997),
    stranger: serie("Stranger Things", 2016),
    merlina: serie("Merlina", 2022),

    // Caricaturas
    gasparin: caricatura("Gasparín, el fantasma amigable", 1950),
    scooby: caricatura("¿Scooby-Doo, dónde estás?", 1969),
    patula: caricatura("Conde Pátula", 1988),
    chicas: caricatura("Las Chicas Superpoderosas", 1998),
    coraje: caricatura("Coraje, el perro cobarde", 1999),
    bobEsponja: caricatura("Bob Esponja", 1999),
    zim: caricatura("Invasor Zim", 2001),
    billyMandy: caricatura("Las macabras aventuras de Billy y Mandy", 2001),
    danny: caricatura("Danny Phantom", 2004),
    horaAventura: caricatura("Hora de aventura", 2010),
    monsterHigh: caricatura("Monster High", 2010),
    gravity: caricatura("Gravity Falls", 2012),

    // Los Simpson: La casita del horror
    casita1: casita("I", 1990),
    casita2: casita("II", 1991),
    casita3: casita("III", 1992),
    casita4: casita("IV", 1993),
    casita5: casita("V", 1994),
    casita6: casita("VI", 1995),
    casita7: casita("VII", 1996),
    casita8: casita("VIII", 1997),
} satisfies Record<string, Fuente>

type ClaveFuente = keyof typeof fuentes

export type Grupo = "peliculas" | "animadas" | "series" | "caricaturas" | "simpson"

export type Personaje = {
    id: string
    nombre: string
    emoji: string
    color: string
    foto?: string // si no hay, se usa el emoji
    de: string // "Título (año)"
    grupo: Grupo
    rasgos: ReadonlySet<Rasgo>
}

// Número a partir de un texto (para que el mismo código dé el mismo tablero en los dos celulares)
export const numeroDeTexto = (texto: string) => {
    let h = 2166136261
    for (let i = 0; i < texto.length; i++) {
        h ^= texto.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

// Las fotos las baja scripts/fotos-adivina-quien.mjs; la versión cambia si se cambia la foto
const fotos: Record<string, { archivo?: string }> = listaFotos
const fotoDe = (id: string) => {
    const foto = fotos[id]
    if (!foto) return undefined
    return `/adivina-quien/fotos/${id}.webp?v=${numeroDeTexto(foto.archivo ?? id).toString(36)}`
}

export const hayFotos = Object.keys(fotos).length > 0

const p = (
    id: string,
    nombre: string,
    fuente: ClaveFuente,
    emoji: string,
    color: string,
    ...propios: RasgoPropio[]
): Personaje => {
    const f: Fuente = fuentes[fuente]
    const simpson = fuente.startsWith("casita")
    const rasgos = new Set<Rasgo>(propios)
    if (f.animado) rasgos.add("animado")
    if (f.tipo === "pelicula") rasgos.add("pelicula")
    if (simpson) rasgos.add("simpson")
    if (f.anio < 2000) rasgos.add("clasico")
    const grupo: Grupo = simpson
        ? "simpson"
        : f.tipo === "pelicula"
            ? f.animado ? "animadas" : "peliculas"
            : f.animado ? "caricaturas" : "series"
    return { id, nombre, emoji, color, foto: fotoDe(id), de: `${f.titulo} (${f.anio})`, grupo, rasgos }
}

export const personajes: Personaje[] = [
    // Monstruos clásicos
    p("orlok", "Conde Orlok", "nosferatu", "🦇", "#27272a", "villano"),
    p("dracula", "Drácula", "dracula", "🧛", "#4c0519", "villano"),
    p("frankenstein", "Monstruo de Frankenstein", "frankenstein", "🔩", "#3f6212", "villano"),
    p("momia", "La Momia", "momia", "⚱️", "#78350f", "villano"),
    p("novia", "La novia de Frankenstein", "novia", "⚡", "#334155", "mujer"),
    p("hombre-lobo", "El Hombre Lobo", "hombreLobo", "🐺", "#57534e", "villano"),
    p("criatura", "La Criatura de la laguna", "laguna", "🧜‍♂️", "#115e59", "villano"),

    // Terror de película
    p("norman-bates", "Norman Bates", "psicosis", "🚿", "#374151", "villano", "humano", "arma"),
    p("regan", "Regan", "exorcista", "🙃", "#3f3f46", "mujer", "humano", "joven"),
    p("leatherface", "Leatherface", "masacre", "🪚", "#713f12", "villano", "humano", "mascara", "arma"),
    p("carrie", "Carrie", "carrie", "🩸", "#881337", "mujer", "humano", "joven"),
    p("damien", "Damien", "profecia", "👦", "#450a0a", "villano", "joven"),
    p("michael-myers", "Michael Myers", "halloween", "🔪", "#1e293b", "villano", "humano", "mascara", "arma"),
    p("xenomorfo", "Alien", "alien", "👾", "#14532d", "villano"),
    p("jason", "Jason Voorhees", "viernes13", "🏒", "#1c1917", "villano", "humano", "mascara", "arma"),
    p("jack-torrance", "Jack Torrance", "resplandor", "🪓", "#7c2d12", "villano", "humano", "arma"),
    p("gemelas-grady", "Las gemelas Grady", "resplandor", "👭", "#1e40af", "mujer", "villano", "joven"),
    p("ash", "Ash Williams", "evilDead", "🔫", "#854d0e", "humano", "arma"),
    p("freddy", "Freddy Krueger", "pesadilla", "🧤", "#991b1b", "villano", "sombrero", "arma"),
    p("gizmo", "Gizmo", "gremlins", "🐹", "#a16207", "animal"),
    p("stripe", "Stripe", "gremlins", "🧌", "#166534", "villano"),
    p("pegajoso", "Pegajoso", "cazafantasmas", "🤢", "#4d7c0f"),
    p("malvavisco", "Hombre de Malvavisco", "cazafantasmas", "🍡", "#0369a1", "villano", "sombrero"),
    p("pinhead", "Pinhead", "hellraiser", "📌", "#1f2937", "villano"),
    p("depredador", "Depredador", "depredador", "🎯", "#365314", "villano", "mascara", "arma"),
    p("chucky", "Chucky", "chucky", "🧑‍🦰", "#1d4ed8", "villano", "arma"),
    p("beetlejuice", "Beetlejuice", "beetlejuice", "🪲", "#15803d", "villano"),
    p("lydia", "Lydia Deetz", "beetlejuice", "📷", "#27272a", "mujer", "humano", "joven"),
    p("edward-tijeras", "Edward Manos de Tijera", "manosTijera", "✂️", "#334155"),
    p("hannibal", "Hannibal Lecter", "silencio", "🍷", "#7f1d1d", "villano", "humano", "mascara"),
    p("homero-addams", "Homero Addams", "addams", "🤵", "#292524", "humano"),
    p("morticia", "Morticia Addams", "addams", "🥀", "#3b0764", "mujer", "humano"),
    p("tio-lucas", "Tío Lucas", "addams", "💡", "#44403c", "humano"),
    p("largo", "Largo", "addams", "🛎️", "#1e293b"),
    p("candyman", "Candyman", "candyman", "🐝", "#713f12", "villano", "arma"),
    p("winifred", "Winifred Sanderson", "abracadabra", "📕", "#6b21a8", "mujer", "villano", "humano"),
    p("mary-sanderson", "Mary Sanderson", "abracadabra", "👃", "#9a3412", "mujer", "villano", "humano"),
    p("sarah-sanderson", "Sarah Sanderson", "abracadabra", "🎶", "#be185d", "mujer", "villano", "humano"),
    p("binx", "Binx", "abracadabra", "🐈‍⬛", "#292524", "animal"),
    p("ghostface", "Ghostface", "scream", "😱", "#18181b", "villano", "humano", "mascara", "arma"),
    p("jinete", "El Jinete sin Cabeza", "jineteSinCabeza", "🐎", "#312e81", "villano", "arma"),
    p("creeper", "El Creeper", "jeepers", "🚚", "#3f6212", "villano", "sombrero"),
    p("samara", "Samara", "aro", "📼", "#155e75", "mujer", "villano", "joven"),
    p("billy-saw", "Billy, el muñeco", "saw", "🌀", "#991b1b", "villano"),
    p("sweeney", "Sweeney Todd", "sweeney", "💈", "#292524", "villano", "humano", "arma"),
    p("edward-cullen", "Edward Cullen", "crepusculo", "✨", "#475569"),
    p("annabelle", "Annabelle", "annabelle", "🎀", "#57534e", "mujer", "villano"),
    p("babadook", "Babadook", "babadook", "🎩", "#1c1917", "villano", "sombrero"),
    p("art", "Art, el payaso", "terrifier", "🤡", "#27272a", "villano", "sombrero", "arma"),
    p("pennywise", "Pennywise", "it", "🎈", "#b91c1c", "villano"),
    p("valak", "La Monja", "monja", "📿", "#1c1917", "mujer", "villano"),
    p("llorona", "La Llorona", "llorona", "😭", "#3730a3", "mujer", "villano"),
    p("grabber", "El Grabber", "telefono", "☎️", "#0f172a", "villano", "humano", "sombrero", "mascara"),
    p("m3gan", "M3GAN", "m3gan", "🤖", "#9f1239", "mujer", "villano", "joven"),
    p("fazbear", "Freddy Fazbear", "fnaf", "🐻", "#78350f", "villano", "sombrero"),

    // Películas animadas
    p("bruja-blancanieves", "La Bruja de Blancanieves", "blancanieves", "🍎", "#7f1d1d", "mujer", "villano", "humano"),
    p("malefica", "Maléfica", "bellaDurmiente", "🐉", "#4c1d95", "mujer", "villano"),
    p("ursula", "Úrsula", "sirenita", "🐙", "#6b21a8", "mujer", "villano"),
    p("jack", "Jack Skellington", "extranoMundo", "💀", "#18181b"),
    p("sally", "Sally", "extranoMundo", "🪡", "#1e40af", "mujer"),
    p("oogie", "Oogie Boogie", "extranoMundo", "🎲", "#854d0e", "villano"),
    p("zero", "Zero", "extranoMundo", "🐕", "#475569", "animal"),
    p("alcalde", "El Alcalde", "extranoMundo", "🎭", "#7c2d12", "sombrero"),
    p("sulley", "Sulley", "monstersInc", "💙", "#0e7490"),
    p("mike", "Mike Wazowski", "monstersInc", "👁️", "#4d7c0f"),
    p("randall", "Randall", "monstersInc", "🦎", "#6d28d9", "villano"),
    p("boo", "Boo", "monstersInc", "👧", "#be185d", "mujer", "humano", "joven"),
    p("emily", "Emily, la novia cadáver", "cadaver", "👰", "#1e3a8a", "mujer"),
    p("victor", "Victor Van Dort", "cadaver", "🎹", "#334155", "humano"),
    p("casa-monstruo", "La Casa Monstruo", "monsterHouse", "🏚️", "#422006", "villano"),
    p("nahuala", "La Nahuala", "nahuala", "🧙‍♀️", "#3b0764", "mujer", "villano"),
    p("coraline", "Coraline", "coraline", "🔑", "#1d4ed8", "mujer", "humano", "joven"),
    p("otra-madre", "La Otra Madre", "coraline", "🔘", "#27272a", "mujer", "villano"),
    p("drac", "Drac", "hotelT", "🏨", "#312e81"),
    p("mavis", "Mavis", "hotelT", "🖤", "#1e1b4b", "mujer", "joven"),
    p("norman-babcock", "Norman Babcock", "paranorman", "🧟", "#3f6212", "humano", "joven"),
    p("sparky", "Sparky", "frankenweenie", "🐶", "#3f3f46", "animal"),
    p("la-muerte", "La Muerte", "libroVida", "🕯️", "#be123c", "mujer", "sombrero"),
    p("xibalba", "Xibalba", "libroVida", "🐍", "#14532d", "villano"),
    p("hector", "Héctor", "coco", "🎸", "#c2410c", "sombrero"),

    // Series
    p("herman", "Herman Monster", "munster", "🥾", "#3f6212"),
    p("lily-monster", "Lily Monster", "munster", "🧛‍♀️", "#312e81", "mujer"),
    p("conde-contar", "El Conde Contar", "sesamo", "🔢", "#5b21b6"),
    p("slappy", "Slappy", "escalofrios", "🗣️", "#991b1b", "villano"),
    p("salem", "Salem", "sabrina", "😼", "#1c1917", "animal"),
    p("sabrina", "Sabrina Spellman", "sabrina", "🪄", "#be185d", "mujer", "humano", "joven"),
    p("buffy", "Buffy", "buffy", "🗡️", "#9d174d", "mujer", "humano", "joven", "arma"),
    p("once", "Once", "stranger", "🧇", "#9f1239", "mujer", "humano", "joven"),
    p("demogorgon", "Demogorgon", "stranger", "🌺", "#450a0a", "villano"),
    p("vecna", "Vecna", "stranger", "🕰️", "#7c2d12", "villano"),
    p("merlina", "Merlina Addams", "merlina", "🎻", "#18181b", "mujer", "humano", "joven"),
    p("enid", "Enid Sinclair", "merlina", "🌈", "#db2777", "mujer", "joven"),
    p("dedos", "Dedos", "merlina", "🖐️", "#44403c"),

    // Caricaturas
    p("gasparin", "Gasparín", "gasparin", "👻", "#0c4a6e", "joven"),
    p("scooby", "Scooby-Doo", "scooby", "🦴", "#92400e", "animal"),
    p("patula", "Conde Pátula", "patula", "🦆", "#14532d", "animal"),
    p("el", "Él", "chicas", "🦞", "#b91c1c", "villano"),
    p("coraje", "Coraje", "coraje", "😨", "#be185d", "animal"),
    p("holandes", "El Holandés Volador", "bobEsponja", "🏴‍☠️", "#115e59", "villano", "sombrero"),
    p("zim", "Zim", "zim", "🛸", "#7e22ce", "villano"),
    p("puro-hueso", "Puro Hueso", "billyMandy", "☠️", "#1c1917", "arma"),
    p("mandy", "Mandy", "billyMandy", "😠", "#db2777", "mujer", "humano", "joven"),
    p("danny", "Danny Phantom", "danny", "💚", "#0f766e", "joven"),
    p("marceline", "Marceline", "horaAventura", "🍓", "#1e1b4b", "mujer"),
    p("draculaura", "Draculaura", "monsterHigh", "💗", "#db2777", "mujer", "joven"),
    p("bill", "Bill Cipher", "gravity", "🔺", "#a16207", "villano", "sombrero"),

    // Los Simpson: La casita del horror
    p("kang-kodos", "Kang y Kodos", "casita1", "👽", "#4d7c0f", "villano"),
    p("bart-cuervo", "Bart, el cuervo", "casita1", "🐦", "#1f2937", "animal", "joven"),
    p("bart-poderoso", "Bart, el todopoderoso", "casita2", "🌟", "#c2410c", "villano", "humano", "joven"),
    p("muneco-krusty", "El muñeco de Krusty", "casita3", "🧸", "#15803d", "villano"),
    p("king-homero", "King Homero", "casita3", "🦍", "#57534e", "animal"),
    p("flanders-zombi", "Flanders zombi", "casita3", "🥸", "#3f6212", "villano"),
    p("flanders-diablo", "Flanders, el Diablo", "casita4", "😈", "#b91c1c", "villano"),
    p("homero-dona", "Homero cabeza de dona", "casita4", "🍩", "#db2777", "humano"),
    p("burns-dracula", "Sr. Burns Drácula", "casita4", "🦷", "#4c0519", "villano"),
    p("homero-resplandor", "Homero en «El Resplandor»", "casita5", "🍺", "#a16207", "villano", "humano", "arma"),
    p("willie", "Willie de las pesadillas", "casita6", "🔱", "#9a3412", "villano", "arma"),
    p("homero-3d", "Homero en 3D", "casita6", "🧊", "#0369a1", "humano"),
    p("hugo", "Hugo, el gemelo de Bart", "casita7", "🐟", "#155e75", "humano", "joven"),
    p("bart-mosca", "Bart mosca", "casita8", "🪰", "#3f3f46", "animal", "joven"),
    p("marge-bruja", "Marge bruja", "casita8", "🧹", "#1d4ed8", "mujer", "humano", "sombrero"),
]

const porId = new Map(personajes.map((x) => [x.id, x]))

export const personaje = (id: string | null | undefined) => (id ? porId.get(id) : undefined)

export const tiene = (id: string, rasgo: Rasgo) => porId.get(id)?.rasgos.has(rasgo) ?? false

// ——— Tablero ———

export const TAMANO_TABLERO = 24

const azarConSemilla = (semilla: number) => {
    let a = semilla
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const revolver = <T,>(lista: T[], azar: () => number) => {
    const copia = [...lista]
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(azar() * (i + 1))
        ;[copia[i], copia[j]] = [copia[j], copia[i]]
    }
    return copia
}

const tableros = new Map<string, Personaje[]>()

// Los 24 personajes de una ronda. Toma de cada grupo según su tamaño para que
// siempre haya de todo un poco, y luego los acomoda al azar.
export const tableroPara = (codigo: string, ronda: number): Personaje[] => {
    const clave = `${codigo}:${ronda}`
    const guardado = tableros.get(clave)
    if (guardado) return guardado

    const azar = azarConSemilla(numeroDeTexto(clave))
    const elegidos: Personaje[] = []
    const sobrantes: Personaje[] = []
    const grupos: Grupo[] = ["peliculas", "animadas", "series", "caricaturas", "simpson"]
    for (const grupo of grupos) {
        const delGrupo = revolver(personajes.filter((x) => x.grupo === grupo), azar)
        const cuantos = Math.floor((TAMANO_TABLERO * delGrupo.length) / personajes.length)
        elegidos.push(...delGrupo.slice(0, cuantos))
        sobrantes.push(...delGrupo.slice(cuantos))
    }
    elegidos.push(...revolver(sobrantes, azar).slice(0, TAMANO_TABLERO - elegidos.length))

    const tablero = revolver(elegidos, azar)
    tableros.set(clave, tablero)
    return tablero
}
