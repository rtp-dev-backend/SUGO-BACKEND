import { Request, Response } from "express"
import { PVecosXmodalidad, PVecosXmodalidad_ModelInterface, pv_ecos_modalidades } from "../Models/pv_ecos_modalidades.model"
import { Op, QueryTypes } from "sequelize"
import { compararObjetos } from "../../utilities/funcsObjects/compararObjetos"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"


export const getPvEcos = async (req: Request, res: Response) => {
    const {
        eco,
        modalidad
    } = req.query

    const where: string[] = []

    if(eco) where.push(`pv.eco = ${eco}`)
    if(modalidad) where.push(`pem.modalidad = ${modalidad}`)

    try {
        const ecos = await SUGO_sequelize_connection.query(`
            SELECT
                pv.modulo,
                pv.modulo_desc,
                pv.eco,
                pem.modalidad,
                pv.chasis_marca || '-' || pv.carroceria_modelo as eco_marca,
                pv.vehiculo_modelo,
                pv.matricula,
                pv.estado_fisico,
                pv.estado_fisico_desc,
                pv.puertas,
                pv.capacidad_sentados,
                pv.capacidad_parados,
                pv.servicio_tipo,
                pv.vehiculo_tipo,
                pv.servicio_modalidad_sicab,
                pv.servicio_modalidad_sicab_tarifa as tarifa
            FROM view_pv pv
            LEFT JOIN pv_ecos_modalidades pem on (pv.eco = pem.eco)
            WHERE modulo != 90 and estatus not in (6, 8)	-- NO servidor de prueba  and  NO en comercializacion, baja
            ${where.length>0 ? 'AND '+where.join(' AND '):''}
            ORDER BY modulo, modalidad
        `, { type: QueryTypes.SELECT })
        
        return res.json(ecos)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


export const updateEco = async (req: Request, res: Response) => {
    const body: PVecosXmodalidad = req.body

    try {
        const ecoDataRaw = await pv_ecos_modalidades.findOne({where: { eco: body.eco }})
        if( ecoDataRaw === null){
            throw new Error('No existe el eco '+body.eco)
        }
        
        const ecoData: PVecosXmodalidad_ModelInterface = ecoDataRaw.toJSON()
        const { id, logs: old_logs, ...rest } = ecoData
        const data = {
            eco: body.eco,
            modalidad: body.modalidad,
            estatus: body.estatus,
            created_at: body.created_at,
            created_by: body.created_by,
            autorizado_by: body.autorizado_by,
        }

        const comparacion = compararObjetos(rest, data)
        if( Object.keys(comparacion).length-1 == 0 ){   // created_at al ser un Date lo marca como diferente
            throw new Error('Nada que modificar en el eco '+body.eco)
        }

        const logs: PVecosXmodalidad[] = (old_logs as any) || []
        logs.push(rest)
        
        await pv_ecos_modalidades.update({ ...data, logs }, { where: { eco: body.eco }})
        
        return res.send( { ...body, logs } )
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}