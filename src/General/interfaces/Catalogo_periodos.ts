
export interface Periodo {
    fecha_inicio: Date,
    fecha_fin: Date,
    serial: number,
}

export type Cat_Periodos =  Periodo & {id: number}