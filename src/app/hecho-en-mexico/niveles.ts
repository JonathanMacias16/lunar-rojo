import type { Nivel } from "./datos"

// El semáforo: siempre con texto además del color
export const NIVELES: Record<Nivel, { etiqueta: string; descripcion: string; punto: string; pastilla: string }> = {
    mexicana: {
        etiqueta: "Mexicana",
        descripcion: "La empresa dueña de la marca es mexicana.",
        punto: "bg-emerald-400",
        pastilla: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    },
    "hecha-en-mexico": {
        etiqueta: "Hecha en México",
        descripcion: "Se fabrica aquí y da empleo aquí, pero el dueño es extranjero.",
        punto: "bg-amber-300",
        pastilla: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    },
    extranjera: {
        etiqueta: "Extranjera",
        descripcion: "El dueño es extranjero y no tenemos confirmado que se haga aquí.",
        punto: "bg-rose-400",
        pastilla: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    },
}
