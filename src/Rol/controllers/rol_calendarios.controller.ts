import { DataRol, Rol_calendario_API_Body } from './../interfaces/Rol_calendarios.interface';
import { Request, Response } from 'express'
import { rol_calendarios } from '../models/rol_calendarios.model'
import { Rol_Header } from '../models/Rol_headers.model'
import { Rol_Jornada } from '../models/Rol_jornada.model'
import { SUGO_sequelize_connection } from '../../database/sugo.connection'
import getCalendars from '../utilities/calendario/getCalendars'
import { Catalogo_peridos } from '../../General/models/Catalogo_periodo.model';
import { ruta_autorizada } from '../../General/models/rutas_autorizadas.model';
import { Catalogo_modulos } from '../../General/models/Catalogo_modulos.model';
import { QueryTypes } from 'sequelize';
import sortStrings from '../../utilities/funcsArrays/sortStrings';
import { getCalendarOfCred } from '../services/Rol_calendario.services';


export const getCalendarios = async (req: Request, res: Response) => {
    const { cred, dia, header } = req.query

    const where: any = {}
    if(cred)        where.op_cred = cred
    if(dia)         where.dia = dia
    // if(ruta)        where.nombre = ruta

    const where_header: any = {}
    if(header)      where_header.id = header

    try {
        // Mejor hacer la consulta con SQL se me hace 
        const calendario = await rol_calendarios.findAll({
            where,
            include: [
                {
                    model: Rol_Header,
                    where: where_header,
                    include: [ Catalogo_peridos, ruta_autorizada, Catalogo_modulos ]
                }, 
                Rol_Jornada
            ]
        })
        res.json(calendario)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const getCalendario = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const calendario = await rol_calendarios.findOne({
            where: { id },
            include: [
                {
                    model: Rol_Header

                }, Rol_Jornada
            ]
        })
        res.json(calendario)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const postCalendario = async (req: Request, res: Response) => {
    const { id_header, op_cred, id_jornada, dia, op_tipo, op_estado, sistema, eco,servicio} = req.body
    const data = { id_header, op_cred, id_jornada, dia, op_tipo, op_estado, sistema, eco, servicio}
    try {
        const calendario = await rol_calendarios.create(data)
        res.json(calendario)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    

}

export const postCalendarioByExcel = async (req: Request, res: Response) => {
    const { data, modulo }:Rol_calendario_API_Body = req.body;

    const t = await SUGO_sequelize_connection.transaction();
    try {

        const calendariosCreated = await getCalendars( data, modulo, t )
        await t.commit();
        res.json({ msg: `Se crearon ${calendariosCreated.length} calendarios para modulo ${modulo}` });

    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: error.message, desc: error.desc })
    }
    

}


//^ ---------------- --------- Consultas especificas -------- ---------------

const QUERY_distinctCreds = `
    SELECT distinct op_cred, servicio
    FROM rol_calendarios rc 
    WHERE id_header = $1 
`
const QUERY_distinctEcos = `
    SELECT distinct eco, servicio  
    FROM rol_calendarios rc 
    WHERE id_header = $1 AND eco NOTNULL 
    ORDER BY servicio
`

export const getCalendario_ecosYcreds = async (req: Request, res: Response) => {
    const { needEcos=false, needCreds=false, inString, rol: rol_id} = req.query
    
    try {
        let ecos  = undefined
        let creds = undefined
        if(Number(needEcos)){
            const res = await SUGO_sequelize_connection.query(`${QUERY_distinctEcos}`, {
                bind:[rol_id], 
                type: QueryTypes.SELECT 
            });
            if(Number(inString)) ecos = sortStrings(res.map( (obj:any) => `${obj.servicio} - ${obj.eco}` ))
            else ecos = res
        }
        if(Number(needCreds)){
            const res = await SUGO_sequelize_connection.query(`${QUERY_distinctCreds}`, {
                bind:[rol_id], 
                type: QueryTypes.SELECT 
            });
            if(Number(inString)) creds = sortStrings(res.map( (obj:any) => `${obj.servicio} - ${obj.op_cred}` ))
            else creds = res
        } 
    
    
        res.json({ecos, creds})
        
    } catch (error) {
        return res.status(500).json({message: error.message})  
    }
}


export const getCalendariosByCred = async (req: Request, res: Response) => {
    const { op_cred } = req.params
    const { fechaIni, fechaFin } = req.query

    try {
        if(!Number(op_cred)) return res.status(500).json({ error: 'Credencial invalida'})
        const resp = await getCalendarOfCred([op_cred], fechaIni, fechaFin)
        
        res.json(resp)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getRutaDeEco = async (req: Request, res: Response) => {
    const { eco } = req.params
    const { fecha } = req.query

    try {
        const resp = await SUGO_sequelize_connection.query(`
            SELECT 
                eco,
                dia,
                ra.swap_ruta as ruta,
                ma."name" as modalidad
            FROM rol_calendarios rc 
            INNER JOIN  rol_headers rh on ( rc.id_header = rh.id )
                INNER JOIN rutas_autorizadas ra on ( rh.id_rutas = ra.id )
                    INNER JOIN modalidades_autorizadas ma on ( ra.id_autorizada_mod = ma.id )
            WHERE 
                eco = ${eco}
                and dia = '${fecha}'
            LIMIT 1
        `, { type: QueryTypes.SELECT })
        
        res.json(resp[0]||null)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}