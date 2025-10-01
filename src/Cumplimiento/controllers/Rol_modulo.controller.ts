import { Request, Response } from "express"
import { GetCumpliOp_Body, GetCumpli_Body } from "../interfaces/CumpliRequests"
import { getTjtOpData } from "../../PetecionesSwap/services/tarjeta_operador.services"
import { DiaCalOp, getCalendarOfCred, getCalendarsInPeriod } from "../../Rol/services/Rol_calendario.services"
import CumplimientoRol from "../utilities/getCumplimiento"
import groupByRepeatedValue from "../../utilities/funcsArrays/groupByRepeatedValue"
import { regEx_numbers } from "../../utilities/regEx"
import { TarjetaData } from "../interfaces/getCumplimiento.interfaces"
import sortByProperty from "../../utilities/funcsArrays/sortByProperty"



export const getCumpli = async (req: Request, res: Response) => {
    const { modulo, ecos, periodo, ruta } = req.body as unknown as GetCumpli_Body;
    const { fecha_inicio, fecha_fin } = periodo 
    const { id: header_id } = ruta

    try {
        const tjtData = await getTjtOpData(modulo, fecha_inicio, fecha_fin);
        const calendariosRol = await getCalendarsInPeriod( header_id )

        const ev = new CumplimientoRol(tjtData, calendariosRol, periodo, ruta)
        const cumplimiento_ruta = ev.getCumplimientoXecos( ecos )

        const cumpliSorted = sortByProperty( cumplimiento_ruta.cumplimientoDeEcos, 'ecoInPeriod_cumplimiento' ).reverse()
        
        res.json({ 
            cumplimiento: {
                ruta_cumplimiento: cumplimiento_ruta.ruta_cumplimiento,
                cumplimientoDeEcos: cumpliSorted,
            }, 
            // tjtData, calendariosRol 
        })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}



export const getCumpliOp = async (req: Request, res: Response) => {
    const { op_creds, periodo } = req.body as unknown as GetCumpliOp_Body;

    try {
        const calendariosRol = await getCalendarOfCred(op_creds, periodo.fecha_inicio, periodo.fecha_fin )
        const calendariosRol_grouped = groupByRepeatedValue(calendariosRol, 'op_cred').map( arr => ({ 
            op_cred: arr[0]?.op_cred, 
            data:    arr,
            modulos: arr.map( obj => obj.modulo ).filter( (item, index, self) => self.indexOf(item) === index )
        }) )

        const tjtDataXop_Promises = calendariosRol_grouped.map( async(obj) => {
            const { modulos, op_cred, data: calendarioRol } = obj
            const tjtDataPromises = modulos.map( async(mod) => {
                const modulo = mod.match(regEx_numbers)[0]
                console.log(modulo, periodo.fecha_inicio, periodo.fecha_fin, { cred: op_cred });
                const tjtData = await getTjtOpData(modulo, periodo.fecha_inicio, periodo.fecha_fin, { cred: op_cred });
                return tjtData
            })

            const tjtData_grouped = await Promise.all( tjtDataPromises )

            const tjtData: TarjetaData[] = tjtData_grouped.flat(3)
            const cump = new CumplimientoRol( tjtData, calendarioRol, periodo )
            const cumpliOp = cump.getCumlimientoXcred( op_cred )
            return {op_cred, ...cumpliOp};
            // // return { op_cred, tjtData, calendarioRol}
        } )

        // // const dataXop: { op_cred: any; tjtData: TarjetaData[]; calendarioRol: DiaCalOp[]; }[] = await Promise.all(tjtDataXopPromises)
        const dataXop = await Promise.all(tjtDataXop_Promises)

        return res.json(dataXop)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}
