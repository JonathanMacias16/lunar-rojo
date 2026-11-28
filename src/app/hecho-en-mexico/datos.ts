// Base de marcas de "¿Es mexicano?".
// Revisada en noviembre de 2026. Los dueños de las marcas cambian seguido:
// antes de agregar o mover una marca, confírmalo con una nota reciente.
//
// Cómo se decide el semáforo (por quién es dueño de la marca):
// - "mexicana": la empresa dueña es mexicana.
// - "hecha-en-mexico": el dueño es extranjero, pero sabemos que se fabrica aquí.
// - "extranjera": el dueño es extranjero y no tenemos confirmado que se fabrique aquí.

export const FECHA_REVISION = "noviembre de 2026"

export type Nivel = "mexicana" | "hecha-en-mexico" | "extranjera"

export type IdCategoria =
    | "refrescos"
    | "agua"
    | "jugos"
    | "sueros"
    | "cerveza"
    | "tequila"
    | "pan"
    | "galletas"
    | "botanas"
    | "dulces"
    | "lacteos"
    | "carnes"
    | "salsas"
    | "mayonesa"
    | "abarrotes"
    | "limpieza"
    | "lavanderia"
    | "dental"
    | "cuidado"
    | "papel"
    | "farmacia"

export type Categoria = {
    id: IdCategoria
    nombre: string
    // Palabras con las que la gente busca esta categoría (sin acentos da igual)
    terminos: string[]
    // Se muestra cuando hace falta explicar la categoría, sobre todo si no hay marcas mexicanas
    nota?: string
}

export type Marca = {
    nombre: string
    alias?: string[]
    categorias: IdCategoria[]
    dueno: string
    pais: string
    nivel: Nivel
    nota?: string
}

export const CATEGORIAS: Categoria[] = [
    {
        id: "refrescos",
        nombre: "Refrescos y agua mineral",
        terminos: ["refresco", "soda", "gaseosa", "chesco", "cola", "agua mineral", "agua con gas", "mineral", "bebida gaseosa"],
    },
    {
        id: "agua",
        nombre: "Agua natural",
        terminos: ["agua", "agua natural", "agua purificada", "agua embotellada", "garrafon", "botella de agua"],
        nota: "Ninguna de las marcas grandes que tenemos es de dueño mexicano. Una opción local: el garrafón de la purificadora de tu colonia.",
    },
    {
        id: "jugos",
        nombre: "Jugos y bebidas de fruta",
        terminos: ["jugo", "nectar", "bebida de fruta", "juguito"],
    },
    {
        id: "sueros",
        nombre: "Sueros e hidratación",
        terminos: ["suero", "suero oral", "electrolitos", "rehidratante", "bebida deportiva", "bebida isotonica", "hidratante"],
    },
    {
        id: "cerveza",
        nombre: "Cerveza",
        terminos: ["cerveza", "chela", "cheve", "birra"],
        nota: "Las grandes cervecerías mexicanas hoy son de empresas extranjeras, aunque la cerveza se hace aquí. Para algo 100% mexicano, busca cerveza artesanal de tu estado.",
    },
    {
        id: "tequila",
        nombre: "Tequila",
        terminos: ["tequila", "destilado de agave"],
        nota: "Por ley, todo el tequila se hace en México. Lo que cambia es de quién es la marca.",
    },
    {
        id: "pan",
        nombre: "Pan y tortillas",
        terminos: ["pan", "pan de caja", "pan blanco", "pan integral", "tortilla", "tortillas de harina", "harina de maiz", "masa"],
    },
    {
        id: "galletas",
        nombre: "Galletas y pastelitos",
        terminos: ["galleta", "galletas", "pastelito", "pastelitos", "panque"],
    },
    {
        id: "botanas",
        nombre: "Botanas",
        terminos: ["botana", "papas", "papitas", "frituras", "chips", "cacahuate", "cacahuates", "snack", "totopos", "chicharron"],
    },
    {
        id: "dulces",
        nombre: "Dulces y chocolates",
        terminos: ["dulce", "dulces", "chocolate", "chocolate de mesa", "caramelo", "paleta", "chicle", "mazapan", "gomitas", "golosina", "chamoy"],
    },
    {
        id: "lacteos",
        nombre: "Leche, yogur y queso",
        terminos: ["leche", "lacteos", "lacteo", "yogur", "yogurt", "queso", "crema", "leche en polvo", "mantequilla", "bebida lactea"],
    },
    {
        id: "carnes",
        nombre: "Carnes frías, pollo y huevo",
        terminos: ["jamon", "salchicha", "tocino", "carnes frias", "embutidos", "chorizo", "pavo", "pechuga de pavo", "pollo", "huevo", "cerdo", "carne de cerdo"],
    },
    {
        id: "salsas",
        nombre: "Salsas, chiles y condimentos",
        terminos: ["salsa", "salsa picante", "chile", "chiles", "chipotle", "jalapenos", "picante", "mole", "condimento", "sazonador", "chile en polvo"],
    },
    {
        id: "mayonesa",
        nombre: "Mayonesa y aderezos",
        terminos: ["mayonesa", "mayo", "aderezo"],
        nota: "No encontramos una mayonesa grande que sea mexicana. McCormick de México se hace aquí, pero desde 2026 solo una cuarta parte es de Grupo Herdez.",
    },
    {
        id: "abarrotes",
        nombre: "Arroz, frijol, pasta y aceite",
        terminos: ["arroz", "frijol", "frijoles", "pasta", "sopa de pasta", "fideo", "espagueti", "aceite", "aceite de cocina", "enlatados", "latas", "despensa", "abarrotes"],
    },
    {
        id: "limpieza",
        nombre: "Limpieza de la casa",
        terminos: ["cloro", "blanqueador", "limpiador", "desinfectante", "multiusos", "limpiapisos", "pino", "lavatrastes", "jabon para trastes", "limpieza"],
    },
    {
        id: "lavanderia",
        nombre: "Jabón y suavizante para ropa",
        terminos: ["detergente", "jabon para ropa", "jabon de lavar", "jabon en polvo", "jabon de barra", "suavizante", "lavar ropa", "ropa"],
    },
    {
        id: "dental",
        nombre: "Pasta de dientes",
        terminos: ["pasta de dientes", "pasta dental", "crema dental", "dentifrico", "dientes"],
        nota: "No encontramos una pasta de dientes grande que sea mexicana. Colgate, aunque es de EE.UU., se fabrica en Guanajuato.",
    },
    {
        id: "cuidado",
        nombre: "Jabón, shampoo y cremas",
        terminos: ["shampoo", "champu", "jabon", "jabon de tocador", "jabon de bano", "crema corporal", "crema para la cara", "acne", "cabello"],
    },
    {
        id: "papel",
        nombre: "Papel de baño y pañales",
        terminos: ["papel de bano", "papel higienico", "papel sanitario", "panales", "panal", "panuelos", "panuelos desechables", "toallitas humedas"],
    },
    {
        id: "farmacia",
        nombre: "Farmacia",
        terminos: ["farmacia", "medicina", "gripa", "gripe", "resfriado", "antigripal", "cicatrices", "crema para cicatrices", "arrugas"],
    },
]

const KC_MEXICO = "Empresa mexicana, aunque casi la mitad es de Kimberly-Clark de EE.UU."

export const MARCAS: Marca[] = [
    // Refrescos y agua mineral
    {
        nombre: "Jarritos",
        categorias: ["refrescos"],
        dueno: "Embotelladora Mexicana (Consorcio AGA)",
        pais: "México",
        nivel: "mexicana",
        nota: "Fuera de México la vende Novamex, con sede en Texas.",
    },
    { nombre: "Lulú", alias: ["lulu"], categorias: ["refrescos"], dueno: "Pascual (cooperativa)", pais: "México", nivel: "mexicana" },
    {
        nombre: "Coca-Cola",
        alias: ["coca", "coke"],
        categorias: ["refrescos"],
        dueno: "The Coca-Cola Company",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "La embotellan Coca-Cola FEMSA y Arca Continental, que sí son mexicanas.",
    },
    { nombre: "Pepsi", categorias: ["refrescos"], dueno: "PepsiCo", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Manzanita Sol", categorias: ["refrescos"], dueno: "PepsiCo", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    {
        nombre: "Peñafiel",
        categorias: ["refrescos"],
        dueno: "Keurig Dr Pepper",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Nació en Tehuacán, Puebla. Hoy es de una empresa estadounidense.",
    },
    {
        nombre: "Topo Chico",
        categorias: ["refrescos"],
        dueno: "The Coca-Cola Company",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Nació en Monterrey. La marca es de Coca-Cola desde 2017.",
    },
    {
        nombre: "Big Cola",
        categorias: ["refrescos"],
        dueno: "AJE",
        pais: "Perú",
        nivel: "extranjera",
        nota: "Mucha gente la cree mexicana, pero la empresa es peruana.",
    },

    // Agua natural
    { nombre: "Bonafont", categorias: ["agua"], dueno: "Danone", pais: "Francia", nivel: "hecha-en-mexico" },
    { nombre: "Ciel", categorias: ["agua"], dueno: "The Coca-Cola Company", pais: "EE.UU.", nivel: "hecha-en-mexico" },

    // Jugos
    { nombre: "Jumex", categorias: ["jugos"], dueno: "Grupo Jumex", pais: "México", nivel: "mexicana" },
    {
        nombre: "Boing!",
        alias: ["boing"],
        categorias: ["jugos"],
        dueno: "Pascual (cooperativa)",
        pais: "México",
        nivel: "mexicana",
        nota: "La hace una cooperativa: la empresa es de sus trabajadores.",
    },
    {
        nombre: "Del Valle",
        alias: ["jugos del valle"],
        categorias: ["jugos"],
        dueno: "The Coca-Cola Company",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Era mexicana. Coca-Cola y sus embotelladoras la compraron en 2007.",
    },

    // Sueros
    { nombre: "Electrolit", categorias: ["sueros"], dueno: "PiSA Farmacéutica", pais: "México", nivel: "mexicana" },
    { nombre: "Suerox", categorias: ["sueros"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
    { nombre: "Gatorade", categorias: ["sueros"], dueno: "PepsiCo", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Pedialyte", categorias: ["sueros"], dueno: "Abbott", pais: "EE.UU.", nivel: "extranjera" },

    // Cerveza
    {
        nombre: "Corona",
        categorias: ["cerveza"],
        dueno: "AB InBev",
        pais: "Bélgica",
        nivel: "hecha-en-mexico",
        nota: "La hace Grupo Modelo, que dejó de ser mexicano en 2013.",
    },
    { nombre: "Modelo", alias: ["modelo especial", "negra modelo"], categorias: ["cerveza"], dueno: "AB InBev", pais: "Bélgica", nivel: "hecha-en-mexico" },
    { nombre: "Victoria", categorias: ["cerveza"], dueno: "AB InBev", pais: "Bélgica", nivel: "hecha-en-mexico" },
    { nombre: "Pacífico", alias: ["pacifico"], categorias: ["cerveza"], dueno: "AB InBev", pais: "Bélgica", nivel: "hecha-en-mexico" },
    {
        nombre: "Tecate",
        categorias: ["cerveza"],
        dueno: "Heineken",
        pais: "Países Bajos",
        nivel: "hecha-en-mexico",
        nota: "La hace Heineken México, antes Cervecería Cuauhtémoc Moctezuma.",
    },
    { nombre: "Indio", categorias: ["cerveza"], dueno: "Heineken", pais: "Países Bajos", nivel: "hecha-en-mexico" },
    { nombre: "Dos Equis", alias: ["xx"], categorias: ["cerveza"], dueno: "Heineken", pais: "Países Bajos", nivel: "hecha-en-mexico" },
    { nombre: "Sol", categorias: ["cerveza"], dueno: "Heineken", pais: "Países Bajos", nivel: "hecha-en-mexico" },
    { nombre: "Bohemia", categorias: ["cerveza"], dueno: "Heineken", pais: "Países Bajos", nivel: "hecha-en-mexico" },
    { nombre: "Carta Blanca", categorias: ["cerveza"], dueno: "Heineken", pais: "Países Bajos", nivel: "hecha-en-mexico" },

    // Tequila
    { nombre: "José Cuervo", alias: ["cuervo"], categorias: ["tequila"], dueno: "Becle", pais: "México", nivel: "mexicana" },
    { nombre: "1800", alias: ["tequila 1800"], categorias: ["tequila"], dueno: "Becle", pais: "México", nivel: "mexicana" },
    { nombre: "Maestro Dobel", alias: ["dobel"], categorias: ["tequila"], dueno: "Becle", pais: "México", nivel: "mexicana" },
    { nombre: "Herradura", categorias: ["tequila"], dueno: "Brown-Forman", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Don Julio", categorias: ["tequila"], dueno: "Diageo", pais: "Reino Unido", nivel: "hecha-en-mexico" },
    { nombre: "Sauza", categorias: ["tequila"], dueno: "Suntory Global Spirits", pais: "Japón", nivel: "hecha-en-mexico" },
    { nombre: "Patrón", alias: ["patron"], categorias: ["tequila"], dueno: "Bacardi", pais: "Bermudas", nivel: "hecha-en-mexico" },

    // Pan y tortillas
    {
        nombre: "Bimbo",
        categorias: ["pan"],
        dueno: "Grupo Bimbo",
        pais: "México",
        nivel: "mexicana",
        nota: "Es la panificadora más grande del mundo.",
    },
    { nombre: "Tía Rosa", alias: ["tia rosa", "tortillinas"], categorias: ["pan"], dueno: "Grupo Bimbo", pais: "México", nivel: "mexicana" },
    { nombre: "Milpa Real", categorias: ["pan"], dueno: "Grupo Bimbo", pais: "México", nivel: "mexicana" },
    { nombre: "Maseca", categorias: ["pan"], dueno: "Gruma", pais: "México", nivel: "mexicana" },
    { nombre: "Mission", categorias: ["pan"], dueno: "Gruma", pais: "México", nivel: "mexicana" },

    // Galletas y pastelitos
    {
        nombre: "Marinela",
        alias: ["gansito", "principe", "submarinos", "pinguinos"],
        categorias: ["galletas"],
        dueno: "Grupo Bimbo",
        pais: "México",
        nivel: "mexicana",
    },
    { nombre: "Mac'Ma", alias: ["macma", "mac ma"], categorias: ["galletas"], dueno: "La Costeña", pais: "México", nivel: "mexicana" },
    {
        nombre: "Gamesa",
        alias: ["emperador", "marias", "chokis", "arcoiris", "mamut"],
        categorias: ["galletas"],
        dueno: "PepsiCo",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Nació en Monterrey. Es de PepsiCo desde 1990.",
    },
    { nombre: "Oreo", categorias: ["galletas"], dueno: "Mondelēz", pais: "EE.UU.", nivel: "extranjera" },

    // Botanas
    { nombre: "Barcel", alias: ["runners", "hot nuts"], categorias: ["botanas"], dueno: "Grupo Bimbo", pais: "México", nivel: "mexicana" },
    { nombre: "Takis", categorias: ["botanas"], dueno: "Grupo Bimbo (Barcel)", pais: "México", nivel: "mexicana" },
    { nombre: "Totis", categorias: ["botanas"], dueno: "La Costeña", pais: "México", nivel: "mexicana" },
    { nombre: "Nipón", alias: ["nipon", "japones", "cacahuate japones"], categorias: ["botanas"], dueno: "La Costeña", pais: "México", nivel: "mexicana" },
    {
        nombre: "Sabritas",
        categorias: ["botanas"],
        dueno: "PepsiCo",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Nació en la Ciudad de México. Es de PepsiCo desde 1966.",
    },
    { nombre: "Doritos", categorias: ["botanas"], dueno: "PepsiCo (Sabritas)", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Cheetos", categorias: ["botanas"], dueno: "PepsiCo (Sabritas)", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Ruffles", categorias: ["botanas"], dueno: "PepsiCo (Sabritas)", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Churrumais", categorias: ["botanas"], dueno: "PepsiCo (Sabritas)", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    {
        nombre: "Pringles",
        categorias: ["botanas"],
        dueno: "Mars",
        pais: "EE.UU.",
        nivel: "extranjera",
        nota: "Es de Mars desde diciembre de 2025.",
    },

    // Dulces y chocolates
    { nombre: "De la Rosa", alias: ["dulces de la rosa", "mazapan de la rosa"], categorias: ["dulces"], dueno: "Dulces De la Rosa", pais: "México", nivel: "mexicana" },
    { nombre: "Ibarra", alias: ["chocolate ibarra"], categorias: ["dulces"], dueno: "Chocolate Ibarra", pais: "México", nivel: "mexicana" },
    { nombre: "Mayordomo", alias: ["chocolate mayordomo"], categorias: ["dulces"], dueno: "Chocolate Mayordomo", pais: "México", nivel: "mexicana" },
    {
        nombre: "Ricolino",
        alias: ["panditas", "paleta payaso", "bubulubu", "kranky"],
        categorias: ["dulces"],
        dueno: "Mondelēz",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Fue de Grupo Bimbo hasta 2022.",
    },
    {
        nombre: "Vero",
        alias: ["dulces vero", "picafresa"],
        categorias: ["dulces"],
        dueno: "Mondelēz",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Nació en Guadalajara. Pasó a Bimbo en 2010 y a Mondelēz en 2022.",
    },
    { nombre: "Duvalín", alias: ["duvalin"], categorias: ["dulces"], dueno: "Mondelēz (Ricolino)", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    {
        nombre: "Pelón Pelo Rico",
        alias: ["pelon"],
        categorias: ["dulces"],
        dueno: "Hershey",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Es de Hershey desde 2004.",
    },
    { nombre: "Lucas", categorias: ["dulces"], dueno: "Mars", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Sonric's", alias: ["sonrics"], categorias: ["dulces"], dueno: "PepsiCo", pais: "EE.UU.", nivel: "hecha-en-mexico" },
    { nombre: "Abuelita", alias: ["chocolate abuelita"], categorias: ["dulces"], dueno: "Nestlé", pais: "Suiza", nivel: "hecha-en-mexico" },

    // Lácteos
    { nombre: "Lala", categorias: ["lacteos"], dueno: "Grupo Lala", pais: "México", nivel: "mexicana" },
    { nombre: "Nutri", alias: ["nutrileche", "nutri leche"], categorias: ["lacteos"], dueno: "Grupo Lala", pais: "México", nivel: "mexicana" },
    {
        nombre: "Alpura",
        categorias: ["lacteos"],
        dueno: "Alpura",
        pais: "México",
        nivel: "mexicana",
        nota: "La fundaron ganaderos mexicanos en 1970.",
    },
    { nombre: "Chilchota", categorias: ["lacteos"], dueno: "Grupo Chilchota (Durango)", pais: "México", nivel: "mexicana" },
    { nombre: "Danone", alias: ["danonino", "activia", "oikos"], categorias: ["lacteos"], dueno: "Danone", pais: "Francia", nivel: "hecha-en-mexico" },
    { nombre: "Yakult", categorias: ["lacteos"], dueno: "Yakult Honsha", pais: "Japón", nivel: "hecha-en-mexico" },
    { nombre: "Nido", categorias: ["lacteos"], dueno: "Nestlé", pais: "Suiza", nivel: "extranjera" },

    // Carnes frías, pollo y huevo
    { nombre: "FUD", categorias: ["carnes"], dueno: "Sigma", pais: "México", nivel: "mexicana" },
    { nombre: "San Rafael", categorias: ["carnes"], dueno: "Sigma", pais: "México", nivel: "mexicana" },
    { nombre: "Chimex", categorias: ["carnes"], dueno: "Sigma", pais: "México", nivel: "mexicana" },
    { nombre: "Kekén", alias: ["keken"], categorias: ["carnes"], dueno: "Grupo Kekén (Yucatán)", pais: "México", nivel: "mexicana" },
    { nombre: "Bachoco", categorias: ["carnes"], dueno: "Industrias Bachoco", pais: "México", nivel: "mexicana" },

    // Salsas, chiles y condimentos
    { nombre: "La Costeña", alias: ["costena"], categorias: ["salsas", "abarrotes"], dueno: "La Costeña", pais: "México", nivel: "mexicana" },
    { nombre: "Herdez", categorias: ["salsas", "abarrotes"], dueno: "Grupo Herdez", pais: "México", nivel: "mexicana" },
    { nombre: "Doña María", alias: ["dona maria"], categorias: ["salsas"], dueno: "Grupo Herdez", pais: "México", nivel: "mexicana" },
    { nombre: "Búfalo", alias: ["bufalo"], categorias: ["salsas"], dueno: "Grupo Herdez", pais: "México", nivel: "mexicana" },
    { nombre: "Embasa", categorias: ["salsas"], dueno: "Grupo Herdez", pais: "México", nivel: "mexicana" },
    { nombre: "Valentina", categorias: ["salsas"], dueno: "Salsa Tamazula", pais: "México", nivel: "mexicana" },
    { nombre: "Tajín", alias: ["tajin"], categorias: ["salsas"], dueno: "Empresas Tajín", pais: "México", nivel: "mexicana" },
    {
        nombre: "Cholula",
        categorias: ["salsas"],
        dueno: "McCormick",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Se hace en Jalisco. Es de McCormick desde 2020.",
    },
    { nombre: "Knorr", alias: ["knorr suiza"], categorias: ["salsas"], dueno: "Unilever", pais: "Reino Unido", nivel: "extranjera" },

    // Mayonesa y aderezos
    {
        nombre: "McCormick",
        categorias: ["mayonesa"],
        dueno: "McCormick de México",
        pais: "EE.UU. (75%) y México (25%)",
        nivel: "hecha-en-mexico",
        nota: "Se hace aquí. Desde enero de 2026, McCormick de EE.UU. tiene 75% y Grupo Herdez 25%.",
    },
    { nombre: "Hellmann's", alias: ["hellmanns"], categorias: ["mayonesa"], dueno: "Unilever", pais: "Reino Unido", nivel: "extranjera" },

    // Arroz, frijol, pasta y aceite
    { nombre: "Verde Valle", categorias: ["abarrotes"], dueno: "Verde Valle (Guadalajara)", pais: "México", nivel: "mexicana" },
    { nombre: "Isadora", categorias: ["abarrotes"], dueno: "Verde Valle", pais: "México", nivel: "mexicana" },
    { nombre: "La Moderna", alias: ["moderna"], categorias: ["abarrotes"], dueno: "Grupo La Moderna (Toluca)", pais: "México", nivel: "mexicana" },
    { nombre: "Nutrioli", categorias: ["abarrotes"], dueno: "Ragasa (Monterrey)", pais: "México", nivel: "mexicana" },

    // Limpieza de la casa
    { nombre: "Cloralex", categorias: ["limpieza"], dueno: "Grupo AlEn (Monterrey)", pais: "México", nivel: "mexicana" },
    { nombre: "Pinol", categorias: ["limpieza"], dueno: "Grupo AlEn (Monterrey)", pais: "México", nivel: "mexicana" },
    {
        nombre: "Fabuloso",
        categorias: ["limpieza"],
        dueno: "Colgate-Palmolive",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Se inventó en México en 1980.",
    },
    { nombre: "Maestro Limpio", categorias: ["limpieza"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Axion", categorias: ["limpieza"], dueno: "Colgate-Palmolive", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Salvo", categorias: ["limpieza"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },

    // Ropa
    { nombre: "Roma", categorias: ["lavanderia"], dueno: "Fábrica de Jabón La Corona", pais: "México", nivel: "mexicana" },
    { nombre: "Foca", categorias: ["lavanderia"], dueno: "Fábrica de Jabón La Corona", pais: "México", nivel: "mexicana" },
    { nombre: "Blanca Nieves", categorias: ["lavanderia"], dueno: "Fábrica de Jabón La Corona", pais: "México", nivel: "mexicana" },
    {
        nombre: "Zote",
        categorias: ["lavanderia"],
        dueno: "Fábrica de Jabón La Corona",
        pais: "México",
        nivel: "mexicana",
        nota: "El jabón de barra, desde 1970.",
    },
    { nombre: "Ensueño", alias: ["ensueno"], categorias: ["lavanderia"], dueno: "Grupo AlEn (Monterrey)", pais: "México", nivel: "mexicana" },
    { nombre: "Ariel", categorias: ["lavanderia"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Downy", categorias: ["lavanderia"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Suavitel", categorias: ["lavanderia"], dueno: "Colgate-Palmolive", pais: "EE.UU.", nivel: "extranjera" },

    // Pasta de dientes
    {
        nombre: "Colgate",
        categorias: ["dental"],
        dueno: "Colgate-Palmolive",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "Su planta de Guanajuato es la más grande de Colgate en el mundo.",
    },
    { nombre: "Crest", categorias: ["dental"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Sensodyne", categorias: ["dental"], dueno: "Haleon", pais: "Reino Unido", nivel: "extranjera" },

    // Jabón, shampoo y cremas
    { nombre: "Tío Nacho", alias: ["tio nacho"], categorias: ["cuidado"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
    { nombre: "Asepxia", categorias: ["cuidado"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
    { nombre: "Teatrical", categorias: ["cuidado"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
    { nombre: "Rosa Venus", categorias: ["cuidado"], dueno: "Fábrica de Jabón La Corona", pais: "México", nivel: "mexicana" },
    { nombre: "Escudo", categorias: ["cuidado"], dueno: "Kimberly-Clark de México", pais: "México", nivel: "mexicana", nota: KC_MEXICO },
    { nombre: "Dove", categorias: ["cuidado"], dueno: "Unilever", pais: "Reino Unido", nivel: "extranjera" },
    { nombre: "Sedal", categorias: ["cuidado"], dueno: "Unilever", pais: "Reino Unido", nivel: "extranjera" },
    { nombre: "Head & Shoulders", alias: ["head and shoulders"], categorias: ["cuidado"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },
    { nombre: "Palmolive", categorias: ["cuidado"], dueno: "Colgate-Palmolive", pais: "EE.UU.", nivel: "extranjera" },

    // Papel de baño y pañales
    { nombre: "Pétalo", alias: ["petalo"], categorias: ["papel"], dueno: "Kimberly-Clark de México", pais: "México", nivel: "mexicana", nota: KC_MEXICO },
    { nombre: "Suavel", categorias: ["papel"], dueno: "Kimberly-Clark de México", pais: "México", nivel: "mexicana", nota: KC_MEXICO },
    { nombre: "Kleen Bebé", alias: ["kleenbebe", "kleen bebe"], categorias: ["papel"], dueno: "Kimberly-Clark de México", pais: "México", nivel: "mexicana", nota: KC_MEXICO },
    {
        nombre: "Huggies",
        categorias: ["papel"],
        dueno: "Kimberly-Clark",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "La marca es de Kimberly-Clark de EE.UU.; aquí la fabrica Kimberly-Clark de México.",
    },
    {
        nombre: "Kleenex",
        categorias: ["papel"],
        dueno: "Kimberly-Clark",
        pais: "EE.UU.",
        nivel: "hecha-en-mexico",
        nota: "La marca es de Kimberly-Clark de EE.UU.; aquí la fabrica Kimberly-Clark de México.",
    },
    {
        nombre: "Regio",
        categorias: ["papel"],
        dueno: "Essity",
        pais: "Suecia",
        nivel: "hecha-en-mexico",
        nota: "Mucha gente la cree mexicana. Se hace aquí, pero es de la sueca Essity.",
    },
    { nombre: "Pampers", categorias: ["papel"], dueno: "Procter & Gamble", pais: "EE.UU.", nivel: "extranjera" },

    // Farmacia
    { nombre: "Cicatricure", categorias: ["farmacia"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
    { nombre: "XL-3", alias: ["xl3"], categorias: ["farmacia"], dueno: "Genomma Lab", pais: "México", nivel: "mexicana" },
]
