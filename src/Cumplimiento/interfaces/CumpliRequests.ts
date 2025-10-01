import { Periodo, Res_RolHeaders } from "./getCumplimiento.interfaces";


export interface GetCumpli_Body {
    modulo: number,
    ecos: number[],
    periodo: Periodo,
    ruta: Res_RolHeaders
}

export interface GetCumpliOp_Body {
    op_creds: number[],
    periodo: Periodo,
}