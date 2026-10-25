// Personajes del Adivina Quién de Halloween, lo que se puede preguntar de ellos
// y las categorías para armar el tablero.
import listaFotos from "./fotos.json"

// ——— Lo que se pregunta ———

// Para todos los personajes. Los primeros cuatro salen de dónde viene el personaje.
type RasgoGeneral =
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

// Solo se preguntan cuando se juega con un universo
type RasgoDeUniverso =
    | "familiaSimpson"
    | "vampiro"
    | "lobo"
    | "cullen"
    | "vulturi"
    | "rubio"
    | "pelirrojo"
    | "lentes"
    | "poderes"
    | "mundoReves"
    | "pandilla"
    | "fantasma"
    | "familiaAddams"

export type Rasgo = RasgoGeneral | RasgoDeUniverso

type RasgoPropio = Exclude<Rasgo, "animado" | "pelicula" | "simpson" | "clasico">

export type Pregunta = { rasgo: Rasgo; texto: string; ficha: string }

const preguntasGenerales: Pregunta[] = [
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

const rubio: Pregunta = { rasgo: "rubio", texto: "¿Es rubio?", ficha: "Es rubio" }
const pelirrojo: Pregunta = { rasgo: "pelirrojo", texto: "¿Es pelirrojo?", ficha: "Es pelirrojo" }
const lentes: Pregunta = { rasgo: "lentes", texto: "¿Usa lentes?", ficha: "Usa lentes" }

export type Universo = "simpson" | "crepusculo" | "coraje" | "stranger" | "scooby" | "jack" | "addams"

const preguntasDeUniverso: Record<Universo, Pregunta[]> = {
    simpson: [{ rasgo: "familiaSimpson", texto: "¿Es de la familia Simpson?", ficha: "Es de la familia Simpson" }],
    crepusculo: [
        { rasgo: "vampiro", texto: "¿Es vampiro?", ficha: "Es vampiro" },
        { rasgo: "lobo", texto: "¿Se convierte en lobo?", ficha: "Se convierte en lobo" },
        { rasgo: "cullen", texto: "¿Es de los Cullen?", ficha: "Es de los Cullen" },
        { rasgo: "vulturi", texto: "¿Es de los Vulturis?", ficha: "Es de los Vulturis" },
        rubio,
        pelirrojo,
    ],
    coraje: [lentes],
    stranger: [
        { rasgo: "poderes", texto: "¿Tiene poderes?", ficha: "Tiene poderes" },
        { rasgo: "mundoReves", texto: "¿Es del Mundo del Revés?", ficha: "Es del Mundo del Revés" },
        lentes,
        pelirrojo,
    ],
    scooby: [
        { rasgo: "pandilla", texto: "¿Es de la pandilla de Scooby?", ficha: "Es de la pandilla" },
        { rasgo: "fantasma", texto: "¿Es un fantasma?", ficha: "Es un fantasma" },
        lentes,
        rubio,
        pelirrojo,
    ],
    jack: [],
    addams: [{ rasgo: "familiaAddams", texto: "¿Es de la familia Addams?", ficha: "Es de la familia Addams" }],
}

// ——— De dónde vienen ———

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
    addams: serie("Los locos Addams", 1964),
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
    casita9: casita("IX", 1998),
    casita10: casita("X", 1999),
    casita11: casita("XI", 2000),
    casita12: casita("XII", 2001),
    casita14: casita("XIV", 2003),
} satisfies Record<string, Fuente>

type ClaveFuente = keyof typeof fuentes

// A qué universo pertenece cada fuente (las que no salen aquí no tienen universo propio)
const universoDeFuente = (fuente: ClaveFuente): Universo | undefined => {
    if (fuente.startsWith("casita")) return "simpson"
    const universos: Partial<Record<ClaveFuente, Universo>> = {
        crepusculo: "crepusculo",
        coraje: "coraje",
        stranger: "stranger",
        scooby: "scooby",
        extranoMundo: "jack",
        addams: "addams",
        merlina: "addams",
    }
    return universos[fuente]
}

// ——— Personajes ———

export type Grupo = "peliculas" | "animadas" | "series" | "caricaturas" | "simpson"

export type Personaje = {
    id: string
    nombre: string
    emoji: string
    color: string
    foto: string // si no carga, queda el emoji
    de: string // "Título (año)"
    anio: number
    grupo: Grupo
    universo?: Universo
    general: boolean // si sale en los tableros que mezclan de todo (si no, solo en su universo)
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

// Las fotos guardadas en el sitio (scripts/fotos-adivina-quien.mjs) van primero; si no hay,
// /adivina-quien/foto/<id> la busca en Wikipedia o Fandom. La versión cambia si cambia la foto.
const fotos: Record<string, { archivo?: string }> = listaFotos
const fotoDe = (id: string) => {
    const foto = fotos[id]
    if (!foto) return `/adivina-quien/foto/${id}`
    return `/adivina-quien/fotos/${id}.webp?v=${numeroDeTexto(foto.archivo ?? id).toString(36)}`
}

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
    return {
        id,
        nombre,
        emoji,
        color,
        foto: fotoDe(id),
        de: `${f.titulo} (${f.anio})`,
        anio: f.anio,
        grupo,
        universo: universoDeFuente(fuente),
        general: true,
        rasgos,
    }
}

// Personajes menos conocidos: solo salen cuando se juega con su universo
const solo = (x: Personaje): Personaje => ({ ...x, general: false })

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
    p("candyman", "Candyman", "candyman", "🐝", "#713f12", "villano", "arma"),
    p("winifred", "Winifred Sanderson", "abracadabra", "📕", "#6b21a8", "mujer", "villano", "humano"),
    p("mary-sanderson", "Mary Sanderson", "abracadabra", "👃", "#9a3412", "mujer", "villano", "humano"),
    p("sarah-sanderson", "Sarah Sanderson", "abracadabra", "🎶", "#be185d", "mujer", "villano", "humano"),
    p("binx", "Thackery Binx", "abracadabra", "🐈‍⬛", "#292524", "animal"),
    p("ghostface", "Ghostface", "scream", "😱", "#18181b", "villano", "humano", "mascara", "arma"),
    p("jinete", "El Jinete sin Cabeza", "jineteSinCabeza", "🐎", "#312e81", "villano", "arma"),
    p("creeper", "El Creeper", "jeepers", "🚚", "#3f6212", "villano", "sombrero"),
    p("samara", "Samara", "aro", "📼", "#155e75", "mujer", "villano", "joven"),
    p("billy-saw", "Billy, el muñeco", "saw", "🌀", "#991b1b", "villano"),
    p("sweeney", "Sweeney Todd", "sweeney", "💈", "#292524", "villano", "humano", "arma"),
    p("annabelle", "Annabelle", "annabelle", "🎀", "#57534e", "mujer", "villano"),
    p("babadook", "Babadook", "babadook", "🎩", "#1c1917", "villano", "sombrero"),
    p("art", "Art, el payaso", "terrifier", "🤡", "#27272a", "villano", "sombrero", "arma"),
    p("pennywise", "Pennywise", "it", "🎈", "#b91c1c", "villano"),
    p("valak", "La Monja", "monja", "📿", "#1c1917", "mujer", "villano"),
    p("llorona", "La Llorona", "llorona", "😭", "#3730a3", "mujer", "villano"),
    p("grabber", "El Grabber", "telefono", "☎️", "#0f172a", "villano", "humano", "sombrero", "mascara"),
    p("m3gan", "M3GAN", "m3gan", "🤖", "#9f1239", "mujer", "villano", "joven"),
    p("fazbear", "Freddy Fazbear", "fnaf", "🐻", "#78350f", "villano", "sombrero"),

    // Crepúsculo
    p("edward-cullen", "Edward Cullen", "crepusculo", "✨", "#475569", "joven", "vampiro", "cullen"),
    p("bella", "Bella Swan", "crepusculo", "🍎", "#7f1d1d", "mujer", "humano", "joven"),
    p("jacob", "Jacob Black", "crepusculo", "🐺", "#78350f", "joven", "lobo"),
    solo(p("alice", "Alice Cullen", "crepusculo", "🔮", "#334155", "mujer", "joven", "vampiro", "cullen")),
    solo(p("carlisle", "Carlisle Cullen", "crepusculo", "🩺", "#475569", "vampiro", "cullen", "rubio")),
    solo(p("esme", "Esme Cullen", "crepusculo", "🏡", "#57534e", "mujer", "vampiro", "cullen")),
    solo(p("rosalie", "Rosalie Hale", "crepusculo", "🌹", "#881337", "mujer", "joven", "vampiro", "cullen", "rubio")),
    solo(p("emmett", "Emmett Cullen", "crepusculo", "💪", "#1e293b", "joven", "vampiro", "cullen")),
    solo(p("jasper", "Jasper Hale", "crepusculo", "😶", "#44403c", "joven", "vampiro", "cullen", "rubio")),
    solo(p("charlie-swan", "Charlie Swan", "crepusculo", "👮", "#1e3a8a", "humano")),
    solo(p("billy-black", "Billy Black", "crepusculo", "🪶", "#713f12", "humano")),
    solo(p("james", "James", "crepusculo", "🧛‍♂️", "#27272a", "villano", "vampiro")),
    solo(p("victoria", "Victoria", "crepusculo", "🔥", "#9a3412", "mujer", "villano", "vampiro", "pelirrojo")),
    solo(p("laurent", "Laurent", "crepusculo", "🌿", "#365314", "villano", "vampiro")),
    solo(p("aro", "Aro", "crepusculo", "👑", "#450a0a", "villano", "vampiro", "vulturi")),
    solo(p("caius", "Caius", "crepusculo", "❄️", "#3f3f46", "villano", "vampiro", "vulturi", "rubio")),
    solo(p("marcus", "Marcus", "crepusculo", "🕸️", "#292524", "villano", "vampiro", "vulturi")),
    solo(p("jane", "Jane", "crepusculo", "⚡", "#7f1d1d", "mujer", "villano", "joven", "vampiro", "vulturi", "rubio")),
    solo(p("alec", "Alec", "crepusculo", "🌫️", "#1c1917", "villano", "joven", "vampiro", "vulturi")),
    solo(p("renesmee", "Renesmee Cullen", "crepusculo", "🎀", "#be185d", "mujer", "joven", "vampiro", "cullen")),
    solo(p("seth", "Seth Clearwater", "crepusculo", "🐾", "#a16207", "joven", "lobo")),
    solo(p("leah", "Leah Clearwater", "crepusculo", "🌙", "#57534e", "mujer", "lobo")),
    solo(p("sam-uley", "Sam Uley", "crepusculo", "🌲", "#14532d", "lobo")),
    solo(p("riley", "Riley Biers", "crepusculo", "🩸", "#7f1d1d", "villano", "vampiro")),

    // Películas animadas
    p("bruja-blancanieves", "La Bruja de Blancanieves", "blancanieves", "🍎", "#7f1d1d", "mujer", "villano", "humano"),
    p("malefica", "Maléfica", "bellaDurmiente", "🐉", "#4c1d95", "mujer", "villano"),
    p("ursula", "Úrsula", "sirenita", "🐙", "#6b21a8", "mujer", "villano"),
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

    // El extraño mundo de Jack
    p("jack", "Jack Skellington", "extranoMundo", "💀", "#18181b"),
    p("sally", "Sally", "extranoMundo", "🪡", "#1e40af", "mujer"),
    p("oogie", "Oogie Boogie", "extranoMundo", "🎲", "#854d0e", "villano"),
    p("zero", "Zero", "extranoMundo", "🐕", "#475569", "animal"),
    p("alcalde", "El Alcalde", "extranoMundo", "🎭", "#7c2d12", "sombrero"),
    p("lock", "Lock", "extranoMundo", "😈", "#991b1b", "villano", "joven", "mascara"),
    p("shock", "Shock", "extranoMundo", "🧙", "#4c1d95", "mujer", "villano", "joven", "mascara", "sombrero"),
    p("barrel", "Barrel", "extranoMundo", "☠️", "#365314", "villano", "joven", "mascara"),
    solo(p("finkelstein", "El Dr. Finkelstein", "extranoMundo", "🧠", "#3f3f46")),
    solo(p("santa-jack", "Santa Claus", "extranoMundo", "🎅", "#b91c1c", "humano", "sombrero")),
    solo(p("igor", "Igor", "extranoMundo", "🦴", "#44403c")),
    solo(p("behemoth", "Behemoth", "extranoMundo", "🪓", "#57534e")),
    solo(p("hombre-lobo-jack", "El Hombre Lobo de Halloween", "extranoMundo", "🐺", "#713f12")),
    solo(p("vampiros-jack", "Los vampiros", "extranoMundo", "☂️", "#1c1917", "sombrero")),
    solo(p("arlequin", "El Demonio Arlequín", "extranoMundo", "🃏", "#7c2d12")),
    solo(p("payaso-jack", "El payaso sin cara", "extranoMundo", "🤡", "#9f1239")),
    solo(p("mr-hyde", "Mr. Hyde", "extranoMundo", "🎩", "#292524", "sombrero")),
    solo(p("conejo-pascua", "El Conejo de Pascua", "extranoMundo", "🐰", "#be185d", "animal")),

    // Los Addams
    p("homero-addams", "Homero Addams", "addams", "🤵", "#292524", "humano", "familiaAddams"),
    p("morticia", "Morticia Addams", "addams", "🥀", "#3b0764", "mujer", "humano", "familiaAddams"),
    p("tio-lucas", "Tío Lucas", "addams", "💡", "#44403c", "humano", "familiaAddams"),
    p("largo", "Largo", "addams", "🛎️", "#1e293b"),
    p("pericles", "Pericles Addams", "addams", "💣", "#44403c", "humano", "joven", "familiaAddams"),
    solo(p("abuela-addams", "La Abuela Addams", "addams", "🧪", "#3f3f46", "mujer", "humano", "familiaAddams")),
    p("primo-eso", "El Primo Eso", "addams", "🧶", "#78350f", "sombrero", "familiaAddams"),
    p("merlina", "Merlina Addams", "merlina", "🎻", "#18181b", "mujer", "humano", "joven", "familiaAddams"),
    p("enid", "Enid Sinclair", "merlina", "🌈", "#db2777", "mujer", "joven"),
    p("dedos", "Dedos", "merlina", "🖐️", "#44403c"),
    solo(p("xavier", "Xavier Thorpe", "merlina", "🎨", "#334155", "humano", "joven")),
    solo(p("tyler", "Tyler Galpin", "merlina", "☕", "#1e3a8a", "villano", "joven")),
    solo(p("bianca", "Bianca Barclay", "merlina", "🧜‍♀️", "#0e7490", "mujer", "joven")),
    solo(p("weems", "Larissa Weems", "merlina", "🏫", "#475569", "mujer")),
    solo(p("thornhill", "Marilyn Thornhill", "merlina", "🌱", "#3f6212", "mujer", "villano", "humano")),
    solo(p("eugene", "Eugene Ottinger", "merlina", "🐝", "#a16207", "humano", "joven")),
    solo(p("ajax", "Ajax Petropolus", "merlina", "🐍", "#14532d", "joven", "sombrero")),

    // Series
    p("herman", "Herman Monster", "munster", "🥾", "#3f6212"),
    p("lily-monster", "Lily Monster", "munster", "🧛‍♀️", "#312e81", "mujer"),
    p("conde-contar", "El Conde Contar", "sesamo", "🔢", "#5b21b6"),
    p("slappy", "Slappy", "escalofrios", "🗣️", "#991b1b", "villano"),
    p("salem", "Salem", "sabrina", "😼", "#1c1917", "animal"),
    p("sabrina", "Sabrina Spellman", "sabrina", "🪄", "#be185d", "mujer", "humano", "joven"),
    p("buffy", "Buffy", "buffy", "🗡️", "#9d174d", "mujer", "humano", "joven", "arma"),

    // Stranger Things
    p("once", "Once", "stranger", "🧇", "#9f1239", "mujer", "humano", "joven", "poderes"),
    p("demogorgon", "Demogorgon", "stranger", "🌺", "#450a0a", "villano", "mundoReves"),
    p("vecna", "Vecna", "stranger", "🕰️", "#7c2d12", "villano", "poderes", "mundoReves"),
    p("mike-wheeler", "Mike Wheeler", "stranger", "🚲", "#1e3a8a", "humano", "joven"),
    p("dustin", "Dustin Henderson", "stranger", "🧢", "#a16207", "humano", "joven", "sombrero"),
    solo(p("lucas", "Lucas Sinclair", "stranger", "🏹", "#365314", "humano", "joven")),
    solo(p("will", "Will Byers", "stranger", "🎲", "#334155", "humano", "joven")),
    p("max", "Max Mayfield", "stranger", "🛹", "#9a3412", "mujer", "humano", "joven", "pelirrojo"),
    p("steve", "Steve Harrington", "stranger", "🏏", "#57534e", "humano", "joven", "arma"),
    solo(p("nancy", "Nancy Wheeler", "stranger", "📰", "#9d174d", "mujer", "humano", "joven", "arma")),
    solo(p("jonathan", "Jonathan Byers", "stranger", "📷", "#44403c", "humano", "joven")),
    p("hopper", "Jim Hopper", "stranger", "🚓", "#78350f", "humano", "sombrero", "arma"),
    solo(p("joyce", "Joyce Byers", "stranger", "💡", "#713f12", "mujer", "humano")),
    solo(p("robin", "Robin Buckley", "stranger", "🍦", "#1d4ed8", "mujer", "humano", "joven")),
    solo(p("eddie", "Eddie Munson", "stranger", "🎸", "#1c1917", "humano", "joven")),
    solo(p("erica", "Erica Sinclair", "stranger", "🍨", "#be185d", "mujer", "humano", "joven")),
    solo(p("billy-hargrove", "Billy Hargrove", "stranger", "🚗", "#0369a1", "villano", "humano", "joven")),
    solo(p("murray", "Murray Bauman", "stranger", "📼", "#3f3f46", "humano", "lentes")),
    solo(p("brenner", "El Dr. Brenner", "stranger", "🧪", "#475569", "villano", "humano")),
    solo(p("bob-newby", "Bob Newby", "stranger", "📻", "#4d7c0f", "humano")),
    solo(p("barb", "Barb", "stranger", "👓", "#881337", "mujer", "humano", "joven", "lentes")),
    solo(p("azotamentes", "El Azotamentes", "stranger", "🕷️", "#450a0a", "villano", "mundoReves")),
    solo(p("argyle", "Argyle", "stranger", "🍕", "#7c2d12", "humano")),
    solo(p("kali", "Kali", "stranger", "8️⃣", "#27272a", "mujer", "humano", "poderes")),

    // Caricaturas
    p("gasparin", "Gasparín", "gasparin", "👻", "#0c4a6e", "joven"),
    p("patula", "Conde Pátula", "patula", "🦆", "#14532d", "animal"),
    p("el", "Él", "chicas", "🦞", "#b91c1c", "villano"),
    p("holandes", "El Holandés Volador", "bobEsponja", "🏴‍☠️", "#115e59", "villano", "sombrero"),
    p("zim", "Zim", "zim", "🛸", "#7e22ce", "villano"),
    p("puro-hueso", "Puro Hueso", "billyMandy", "☠️", "#1c1917", "arma"),
    p("mandy", "Mandy", "billyMandy", "😠", "#db2777", "mujer", "humano", "joven"),
    p("danny", "Danny Phantom", "danny", "💚", "#0f766e", "joven"),
    p("marceline", "Marceline", "horaAventura", "🍓", "#1e1b4b", "mujer"),
    p("draculaura", "Draculaura", "monsterHigh", "💗", "#db2777", "mujer", "joven"),
    p("bill", "Bill Cipher", "gravity", "🔺", "#a16207", "villano", "sombrero"),

    // Scooby-Doo
    p("scooby", "Scooby-Doo", "scooby", "🦴", "#92400e", "animal", "pandilla"),
    p("shaggy", "Shaggy", "scooby", "🥪", "#4d7c0f", "humano", "pandilla"),
    p("fred", "Fred", "scooby", "🧣", "#0369a1", "humano", "pandilla", "rubio"),
    p("daphne", "Daphne", "scooby", "💜", "#6b21a8", "mujer", "humano", "pandilla", "pelirrojo"),
    p("velma", "Vilma", "scooby", "🔍", "#c2410c", "mujer", "humano", "pandilla", "lentes"),
    solo(p("caballero-negro", "El Caballero Negro", "scooby", "🛡️", "#1c1917", "villano", "arma", "fantasma")),
    solo(p("capitan-cutler", "El fantasma del Capitán Cutler", "scooby", "🤿", "#14532d", "villano", "fantasma")),
    solo(p("minero-49", "El Minero 49", "scooby", "⛏️", "#78350f", "villano", "sombrero", "fantasma")),
    solo(p("sombra-fantasma", "La Sombra Fantasma", "scooby", "👤", "#312e81", "villano", "fantasma")),
    solo(p("space-kook", "El Espectro Espacial", "scooby", "💀", "#334155", "villano", "fantasma")),
    solo(p("creeper-scooby", "El Creeper (Scooby)", "scooby", "🧟‍♂️", "#3f6212", "villano")),
    solo(p("payaso-fantasma", "El Payaso Fantasma", "scooby", "🤡", "#9f1239", "villano", "fantasma")),
    solo(p("brujo-scooby", "El Brujo", "scooby", "🪬", "#7c2d12", "villano", "mascara")),
    solo(p("momia-ankha", "La Momia de Ankha", "scooby", "⚱️", "#a16207", "villano")),
    solo(p("fantasma-nieve", "El Fantasma de las Nieves", "scooby", "❄️", "#0e7490", "villano", "fantasma")),
    solo(p("monstruo-brea", "El Monstruo de Brea", "scooby", "🛢️", "#18181b", "villano")),
    solo(p("charlie-robot", "Charlie, el robot", "scooby", "🤖", "#475569", "villano")),
    solo(p("fantasma-voltios", "El Fantasma de 10,000 voltios", "scooby", "⚡", "#ca8a04", "villano", "fantasma")),

    // Coraje, el perro cobarde
    p("coraje", "Coraje", "coraje", "😨", "#be185d", "animal"),
    p("muriel", "Muriel", "coraje", "👵", "#9d174d", "mujer", "humano", "lentes"),
    p("eustace", "Eustace", "coraje", "👴", "#78350f", "villano", "humano", "sombrero", "lentes"),
    solo(p("katz", "Katz", "coraje", "🐈", "#7f1d1d", "villano", "animal")),
    solo(p("le-quack", "Le Quack", "coraje", "🦆", "#3f6212", "villano", "animal", "sombrero")),
    solo(p("di-lung", "Di Lung", "coraje", "🔧", "#a16207", "humano")),
    solo(p("freaky-fred", "Freaky Fred", "coraje", "💈", "#1e3a8a", "villano", "humano")),
    solo(p("computadora", "La Computadora", "coraje", "💻", "#475569")),
    solo(p("ma-bagge", "Ma Bagge", "coraje", "👵🏻", "#57534e", "mujer", "villano", "humano")),
    solo(p("rey-ramses", "El Rey Ramsés", "coraje", "🏺", "#ca8a04", "villano")),
    solo(p("zorro-cajun", "El Zorro Cajún", "coraje", "🦊", "#c2410c", "villano", "animal")),
    solo(p("dr-vindaloo", "El Dr. Vindaloo", "coraje", "🩺", "#0e7490", "humano")),
    solo(p("gran-fusilli", "El Gran Fusilli", "coraje", "🎪", "#7c2d12", "villano", "humano")),
    solo(p("reina-charco", "La Reina del Charco Negro", "coraje", "🌊", "#1c1917", "mujer", "villano")),
    solo(p("shirley", "Shirley, la médium", "coraje", "🔮", "#6b21a8", "mujer", "humano")),
    solo(p("benton", "Benton Tarantella", "coraje", "✏️", "#334155", "villano", "humano")),
    solo(p("pollo-espacio", "El pollo del espacio", "coraje", "🐔", "#14532d", "villano", "animal")),

    // Los Simpson: La casita del horror
    p("kang-kodos", "Kang y Kodos", "casita1", "👽", "#4d7c0f", "villano"),
    p("bart-cuervo", "Bart, el cuervo", "casita1", "🐦", "#1f2937", "animal", "joven", "familiaSimpson"),
    p("bart-poderoso", "Bart, el todopoderoso", "casita2", "🌟", "#c2410c", "villano", "humano", "joven", "familiaSimpson"),
    p("muneco-krusty", "El muñeco de Krusty", "casita3", "🧸", "#15803d", "villano"),
    p("king-homero", "King Homero", "casita3", "🦍", "#57534e", "animal", "familiaSimpson"),
    p("flanders-zombi", "Flanders zombi", "casita3", "🥸", "#3f6212", "villano"),
    p("flanders-diablo", "Flanders, el Diablo", "casita4", "😈", "#b91c1c", "villano"),
    p("homero-dona", "Homero cabeza de dona", "casita4", "🍩", "#db2777", "humano", "familiaSimpson"),
    p("burns-dracula", "Sr. Burns Drácula", "casita4", "🦷", "#4c0519", "villano"),
    p("gremlin-autobus", "El gremlin del autobús", "casita4", "👹", "#3f6212", "villano"),
    p("homero-resplandor", "Homero en «El Resplandor»", "casita5", "🍺", "#a16207", "villano", "humano", "arma", "familiaSimpson"),
    p("skinner-cafeteria", "Skinner caníbal", "casita5", "🍖", "#7f1d1d", "villano", "humano"),
    p("willie", "Willie de las pesadillas", "casita6", "🔱", "#9a3412", "villano", "arma"),
    p("homero-3d", "Homero en 3D", "casita6", "🧊", "#0369a1", "humano", "familiaSimpson"),
    p("lard-lad", "Lard Lad gigante", "casita6", "🗿", "#c2410c", "villano"),
    p("hugo", "Hugo, el gemelo de Bart", "casita7", "🐟", "#155e75", "humano", "joven", "familiaSimpson"),
    p("bart-mosca", "Bart mosca", "casita8", "🪰", "#3f3f46", "animal", "joven", "familiaSimpson"),
    p("marge-bruja", "Marge bruja", "casita8", "🧹", "#1d4ed8", "mujer", "humano", "sombrero", "familiaSimpson"),
    p("maggie-alien", "Maggie alienígena", "casita9", "👶", "#4d7c0f", "mujer", "joven", "familiaSimpson"),
    p("tomy-daly", "Tomy y Daly", "casita9", "🐭", "#be123c", "villano", "animal", "arma"),
    p("flanders-lobo", "Flanders hombre lobo", "casita10", "🐺", "#57534e", "villano"),
    p("el-coleccionista", "El Coleccionista", "casita10", "📦", "#312e81", "villano", "humano"),
    p("homero-fantasma", "Homero fantasma", "casita11", "👻", "#0c4a6e", "familiaSimpson"),
    p("ultracasa", "Ultracasa 3000", "casita12", "🏠", "#0f766e", "villano"),
    p("homero-muerte", "Homero, la Muerte", "casita14", "🪦", "#1c1917", "arma", "familiaSimpson"),
    p("frinkenstein", "Frinkenstein", "casita14", "⚗️", "#365314", "villano"),
]

const porId = new Map(personajes.map((x) => [x.id, x]))

export const personaje = (id: string | null | undefined) => (id ? porId.get(id) : undefined)

export const tiene = (id: string, rasgo: Rasgo) => porId.get(id)?.rasgos.has(rasgo) ?? false

// Lo que se contesta de un personaje (las de su universo van al final)
export const fichaDe = (x: Personaje): Pregunta[] => [
    ...preguntasGenerales,
    ...(x.universo ? preguntasDeUniverso[x.universo] : []),
]

// ——— Categorías ———

const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ" // sin I ni O para no confundirlas

export type Categoria = {
    id: string
    nombre: string
    descripcion: string
    emoji: string
    // El código de la partida empieza con esta letra; así los dos cels saben qué categoría es
    letra: string | null
    universo?: Universo
    entra: (x: Personaje) => boolean
}

const deUniverso = (universo: Universo, nombre: string, descripcion: string, emoji: string, letra: string): Categoria => ({
    id: universo,
    nombre,
    descripcion,
    emoji,
    letra,
    universo,
    entra: (x) => x.universo === universo,
})

export const categorias: Categoria[] = [
    { id: "todos", nombre: "Todos al azar", descripcion: "De todo un poco", emoji: "🎃", letra: null, entra: (x) => x.general },
    { id: "viejos", nombre: "Los más viejos", descripcion: "Antes de 1990", emoji: "📼", letra: "V", entra: (x) => x.general && x.anio < 1990 },
    { id: "noventas", nombre: "Los 90", descripcion: "De 1990 a 1999", emoji: "📺", letra: "N", entra: (x) => x.general && x.anio >= 1990 && x.anio < 2000 },
    { id: "nuevos", nombre: "Los más nuevos", descripcion: "Del 2000 para acá", emoji: "📱", letra: "R", entra: (x) => x.general && x.anio >= 2000 },
    { id: "caricaturas", nombre: "Puras caricaturas", descripcion: "Series y películas animadas", emoji: "🖍️", letra: "A", entra: (x) => x.general && x.rasgos.has("animado") },
    { id: "terror", nombre: "Terror de película", descripcion: "Películas con actores", emoji: "🔪", letra: "P", entra: (x) => x.general && x.grupo === "peliculas" },
    deUniverso("simpson", "Los Simpson", "La casita del horror", "🍩", "S"),
    deUniverso("crepusculo", "Crepúsculo", "Vampiros y lobos de Forks", "🧛", "C"),
    deUniverso("coraje", "Coraje, el perro cobarde", "En medio de la nada", "🐕", "K"),
    deUniverso("stranger", "Stranger Things", "Hawkins y el Mundo del Revés", "🚲", "T"),
    deUniverso("scooby", "Scooby-Doo", "La pandilla y sus monstruos", "🔍", "D"),
    deUniverso("jack", "El extraño mundo de Jack", "El Pueblo de Halloween", "💀", "J"),
    deUniverso("addams", "Los Addams", "La familia y Nevermore", "🖤", "M"),
]

const TODOS = categorias[0]

export const categoriaPorId = (id: string | null | undefined) => categorias.find((c) => c.id === id) ?? TODOS

export const categoriaDeCodigo = (codigo: string) => categorias.find((c) => c.letra === codigo[0]) ?? TODOS

// Un código nuevo para la categoría: la primera letra dice cuál es
export const codigoPara = (categoria: Categoria) => {
    const numeros = new Uint32Array(4)
    crypto.getRandomValues(numeros)
    const letrasLibres = [...LETRAS].filter((l) => !categorias.some((c) => c.letra === l))
    const opcionesPrimera = categoria.letra ? [categoria.letra] : letrasLibres
    const primera = opcionesPrimera[numeros[0] % opcionesPrimera.length]
    return primera + Array.from(numeros.slice(1), (n) => LETRAS[n % LETRAS.length]).join("")
}

export const personajesDe = (categoria: Categoria) => personajes.filter(categoria.entra)

// Las preguntas de la lista para un tablero: solo las que sirven para descartar a alguien
export const preguntasPara = (codigo: string, ronda: number): Pregunta[] => {
    const categoria = categoriaDeCodigo(codigo)
    const tablero = tableroPara(codigo, ronda)
    const todas = [...preguntasGenerales, ...(categoria.universo ? preguntasDeUniverso[categoria.universo] : [])]
    return todas.filter((q) => {
        const cuantos = tablero.filter((x) => x.rasgos.has(q.rasgo)).length
        return cuantos > 0 && cuantos < tablero.length
    })
}

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

// Los personajes de una ronda: 24 al azar de la categoría (o todos si son menos).
// Con «Todos al azar» toma de cada grupo según su tamaño para que haya de todo un poco.
export const tableroPara = (codigo: string, ronda: number): Personaje[] => {
    const clave = `${codigo}:${ronda}`
    const guardado = tableros.get(clave)
    if (guardado) return guardado

    const azar = azarConSemilla(numeroDeTexto(clave))
    const categoria = categoriaDeCodigo(codigo)
    const disponibles = personajesDe(categoria)
    const tamano = Math.min(TAMANO_TABLERO, disponibles.length)

    let elegidos: Personaje[]
    if (categoria === TODOS) {
        elegidos = []
        const sobrantes: Personaje[] = []
        const grupos: Grupo[] = ["peliculas", "animadas", "series", "caricaturas", "simpson"]
        for (const grupo of grupos) {
            const delGrupo = revolver(disponibles.filter((x) => x.grupo === grupo), azar)
            const cuantos = Math.floor((tamano * delGrupo.length) / disponibles.length)
            elegidos.push(...delGrupo.slice(0, cuantos))
            sobrantes.push(...delGrupo.slice(cuantos))
        }
        elegidos.push(...revolver(sobrantes, azar).slice(0, tamano - elegidos.length))
    } else {
        elegidos = revolver(disponibles, azar).slice(0, tamano)
    }

    const tablero = revolver(elegidos, azar)
    tableros.set(clave, tablero)
    return tablero
}
