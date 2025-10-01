
interface RolCalendario {
    id:number,
    id_header:number,
    op_cred:number,
    id_jornada:number,
    dia: Date,
    op_tipo: number,
    op_estado:number,
    sistema: string,
    eco:number
}

export type ModelRolCalendario = { id: number }  & RolCalendario


export interface Credenciales { //La propiedades debene de terminar en el # de turno
    cred_turno1?: number;
    cred_turno2?: number;
    cred_turno3?: number;
}

export interface DataRol {
    hoja: string,
    data: DataRolPage
}

export interface DataRolPage {
    header: HeaderRol,
    rol: RolWithTurnos[], 
    cd: CD[], 
    joe: JoE[], 
    notas: {
        sacanDiasParesT1: boolean,
        diasFes?:        { 
            existLabel: string, 
            lista: {
                df_dias: string, 
                df_servicios: string
            }[]
        },
    }
}

export interface HeaderRol {
    // "periodo_date_fin"?: Date | string,
    // "periodo_date_ini"?: Date | string,
    "periodo"?      : string,
    "periodo_id"?   : number,
    "ori_des"?      : string,
    "ruta"?         : string,
    "ruta_id"?      : number,
    "modalidad"?    : string,
    "modalidad_id"? : number,
}

export interface RolWithTurnos {
    servicio:     string;
    eco:          string;
    sistema:      Sistema;
    credenciales: Credenciales;
    descansos:    Descansos;
    lun_vie?:     Jornadas[];
    sab?:         Jornadas[];
    dom?:         Jornadas[];
}

export interface CD {
    servicio:     string;
    eco?:         string;
    sistema:      Sistema;
    credenciales: Credenciales;
    descansos:    Descansos;
}

export interface JoE {
    cred:      number;
    lugIni1:   string;
    hr_ini_t:    Date | string;
    hr_ter_t:    Date | string;
    descansos: Descansos;
}

export enum Sistema {
    ES = "E/S",
    TF = "T/F",
}

export interface Descansos {
    lunes?:     string;
    martes?:    string;
    miercoles?: string;
    jueves?:    string;
    viernes?:   string;
    sabado?:    string;
    domingo?:   string;
}

export interface Jornadas {
    turno:      number;     // turno        // turno 
    hr_ini_t:     Date;     // hrIniT       // hr_ini_t
    hr_ter_t?:    Date;     // hrTerT       // hr_ter_t
    hr_ini_cc?:   Date;     // hrIniCC      // hr_ini_cc
    hr_ter_cc?:   Date;     // hrTerCC      // hr_ter_cc
    hr_ter_mod?:  Date;     // hrTerMod     // hr_ter_mod
    lug_ini_cc:   string;   // lugIniCC     // lug_ini_cc
    lug_ter_cc?:  string;   // lugTerCC     // lug_ter_cc
}

//^ -------------------

export type Modulo = '1' | '2' | '3' | '4-A' | '4-M' | '5' | '6' | '7'  

export interface Header {
    id_modulos: number;
    id_periodos: number;
    id_rutas: number;
    // fecha_val_1: string | Date;
    // fecha_val_2: string | Date;
}

export interface Rol_calendario {
    id_header:  number,             // id_header:  number,
    dia:        string | Date,      // dia:        Date,
    servicio:   number | string     // servicio:   number,
    eco:        number | string,    // eco:        number,
    op_cred:    number,             // op_cred:    number,
    id_jornada: number  |null,      // id_jornada: number,
    op_tipo:    string,             // op_tipo:    number,
    op_estado:  string,             // op_estado:  number,
    sistema:    Sistema,            // sistema:    string,
}

export interface JornadaSimplificada { turno: number, id_jornada: number }

export interface RolModificado {
    lun_vie:    JornadaSimplificada[] | { jornada: JornadaSimplificada[], dia: number}[];
    sab:        JornadaSimplificada[];
    dom:        JornadaSimplificada[];
    servicio:   string;
    eco:        string;
    sistema:    Sistema;
    credenciales: Credenciales;
    descansos:  Descansos;
}

export type RolServicios = RolModificado & { id_header:  number, t1SacaDia1: boolean, ecosAcubrir?: number[] } 

export type C2 = Rol_calendario & {index: number}


export interface Rol_calendario_API_Body { data:DataRol[], modulo:number }