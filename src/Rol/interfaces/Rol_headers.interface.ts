
export interface RolHeader {
    id_modulos: number,
    id_periodos: number,
    id_rutas: number,
}

export type ModelRolHeader = { id: number } & RolHeader 

export interface RolHeader_API_getAll {
    id:             number,
    modulo_id:      number,
    modulo:         number,
    modulo_desc:    string,
    ruta_id:        number,
    ruta:           string,
    modalidad:      string,
    swap_ruta:      string,
    periodo_id:     number,
    periodo_serial: number,
    periodo_inicio: string | Date,
    periodo_fin:    string | Date
}