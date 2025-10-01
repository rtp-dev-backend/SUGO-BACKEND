import { QueryTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"
import { DiaCal } from "../../Cumplimiento/interfaces/getCumplimiento.interfaces"

/**
 * Función para obtener los calendarios programados de 1 Rol (ruta X modalidad X periodo) 
 * @param header_id header_id = periodo X ruta X modalidad
 */
export const getCalendarsInPeriod = async(header_id: number) => {
    try {
        const calendarios: DiaCal[] = await SUGO_sequelize_connection.query( `
            SELECT  
                rc.id_header, 
                rc.dia, 
                rc.servicio, 
                rc.eco, 
                rc.op_cred, 
                rc.op_tipo, 
                rc.op_estado, 
                rc.sistema, 
                rc.id_jornada, 
                rj.turno, 
                rj.hr_ini_t, 
                rj.lug_ini_cc, 
                rj.hr_ini_cc, 
                rj.hr_ter_cc, 
                rj.lug_ter_cc, 
                rj.hr_ter_mod, 
                rj.hr_ter_t
            FROM rol_calendarios rc
            LEFT JOIN rol_jornadas rj on ( rc.id_jornada = rj.id )
            WHERE rc.id_header = $1
            ORDER BY dia, servicio, turno, rj.hr_ini_t 
        `, { 
            bind: [header_id],
            type: QueryTypes.SELECT 
        })

        return calendarios
    } catch (error) {
        throw new Error(`Error en getCalendarsInPeriod ${error}`)
    }
}

export type DiaCalOp = DiaCal & { modulo: number, ruta: string, modalidad: string, ruta_swap: string }

export const getCalendarOfCred = async(op_creds: (number|string)[], fechaIni, fechaFin) => {
    try {
        const calendarios: DiaCalOp[] = await SUGO_sequelize_connection.query( `
            SELECT 
                rc.id_header,
                rc.dia,
                rc.servicio,
                rc.eco,
                rc.op_cred,
                rc.op_tipo,
                rc.op_estado,
                rc.sistema,
                rc.id_jornada,
                rj.turno,
                rj.hr_ini_t,
                rj.lug_ini_cc,
                rj.hr_ini_cc,
                rj.hr_ter_cc,
                rj.lug_ter_cc,
                rj.hr_ter_mod,
                rj.hr_ter_t,
                m.modulo,
                ra.nombre AS ruta,
                ma."name" AS modalidad,
                ra.swap_ruta AS ruta_swap
            FROM rol_calendarios rc
            FULL JOIN rol_jornadas rj ON ( rc.id_jornada = rj.id )
            INNER JOIN rol_headers rh  ON ( rc.id_header  = rh.id )
              INNER JOIN modulos m  ON ( rh.id_modulos  = m.id )
              INNER JOIN rutas_autorizadas ra  ON ( rh.id_rutas  = ra.id )
                INNER JOIN modalidades_autorizadas ma  ON ( ra.id_autorizada_mod = ma.id )
            WHERE 
              rc.op_cred IN (:op_creds)
              AND (rc.dia BETWEEN :fechaIni AND :fechaFin)
            ORDER BY dia, servicio, rj.hr_ini_t 
        `, { 
            replacements: { op_creds, fechaIni, fechaFin},
            type: QueryTypes.SELECT 
        })

        return calendarios
    } catch (error) {
        throw new Error(error)
    }
}