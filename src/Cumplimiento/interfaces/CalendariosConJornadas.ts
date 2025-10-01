

export interface Calendario {
    id:          number;
    id_header:   number;
    dia:         Date | string;
    servicio:    string;
    eco:         number | null;
    op_cred:     number;
    id_jornada:  number | null;
    op_tipo:     "ORD" | "CD";
    op_estado:   "L" | "D";
    sistema:     "T/F" | "E/S";
    rol_jornada: RolJornada | null;
}

export interface RolJornada {
    id:         number;
    turno:      number | null;
    hr_ini_t:   string;
    lug_ini_cc: string;
    hr_ini_cc:  null | string;
    hr_ter_cc:  null | string;
    lug_ter_cc: null | string;
    hr_ter_mod: null | string;
    hr_ter_t:   string;
}
