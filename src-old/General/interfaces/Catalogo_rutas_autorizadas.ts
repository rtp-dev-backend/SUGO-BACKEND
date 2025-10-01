
interface ruta1 {
    id_autorizada_mod: number,
    swap_ruta: number,
    nombre: string,
    origen_destino: string,  
    estatus: number,
}

export type Cat_Rutas = ruta1 & { id: number }