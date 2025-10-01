
export interface RolJornada {
    turno: number,
    hr_ini_t: Date,
    lug_ini_cc: string,
    hr_ini_cc: Date,
    hr_ter_cc: Date,
    lug_ter_cc: string,
    hr_ter_mod: Date,
    hr_ter_t: Date
}

export type ModelRolJornada = { id: number }  & RolJornada