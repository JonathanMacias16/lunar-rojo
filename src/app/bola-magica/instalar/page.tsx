import { redirect } from "next/navigation"

// Enlace para compartir: abre la bola con las instrucciones para agregarla al cel
export default function InstalarBolaMagica() {
    redirect("/bola-magica?instalar=1")
}
