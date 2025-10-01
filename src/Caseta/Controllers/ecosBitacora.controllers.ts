import { Request, Response } from "express"
import { Includeable, Op, QueryTypes } from "sequelize"
import { EcoInOut, EcoInOut_ModelInterface, eco_entradas_salidas } from "../Models/ecosBitacora.model"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"

export const getEcosBitacora = async (req: Request, res: Response) => {
    const { 
        modulo, 
        fecha_ini, 
        fecha_fin, 
        despachos_abiertos, 
        solo_despachos, 
        solo_recepciones, 
        motivo,
        ruta,
        cred,
        eco,
        complemento 
    } = req.query

    const whereClausulas: any = {};
    if(modulo) whereClausulas.modulo_id = modulo
    if(fecha_ini) whereClausulas.modulo_time = { [Op.gte]: fecha_ini }
    if(fecha_fin) whereClausulas.modulo_time = { [Op.lte]: fecha_fin }
    if(fecha_ini && fecha_fin) whereClausulas.modulo_time = { [Op.between]: [fecha_ini, fecha_fin] }
    if( Number(despachos_abiertos)===0 ) whereClausulas.registro_id = { [Op.not]: null, }
        else if(despachos_abiertos) whereClausulas.registro_id = null   // == [Op.is]: null, | [Op.eq]: null  
    if(solo_despachos) whereClausulas.tipo = 1;
    if(solo_recepciones) whereClausulas.tipo = 2;
    if(motivo) whereClausulas.motivo = motivo;
    if(ruta) whereClausulas.ruta_swap = ruta;
    if(cred) whereClausulas.op_cred = cred;
    if(eco) whereClausulas.eco = eco;

    //? Añadir complemento del registro solicitado?
    const include: (Includeable | Includeable[] | undefined) = Boolean(complemento) 
    ? { model: eco_entradas_salidas, as: 'complemento' } 
    : undefined ;

    try {
        const resp = await eco_entradas_salidas.findAll({
            include ,
            where: { ...whereClausulas },
            order: ['modulo_time'],     // order: [ ['modulo_time', 'DESC'] ],
        })
        
        res.json(resp)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getEcosBitacoraMotivos = async (req: Request, res: Response ) => {
    try {
        const motivos = await SUGO_sequelize_connection.query(`
            SELECT distinct motivo, tipo  
            FROM eco_entradas_salidas
            ORDER BY tipo;
        `, { type: QueryTypes.SELECT });
        res.json(motivos)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


interface ReqBody {
    modulo_id:        number
    eco:              number
    op_cred:          number
    turno?:           number
    extintor?:        number
    ruta_swap?:       string
    ruta_modalidad?:  string
    ruta_cc?:         string
    modulo_time:      Date,
    motivo:           string
    motivo_desc?:     string
    cap_time:         Date
    cap_user:         number
    // registro_id?: number
}
export const postEcoDespacho = async (req: Request, res: Response) => {
    const b: (ReqBody & { eco_tipo: number }) = req.body

    try {
        const regDespacho: EcoInOut_ModelInterface = await eco_entradas_salidas.findOne({
            where: {
                eco: b.eco,
                tipo: 1,
                registro_id: null
            }
        })
        if(regDespacho) return res.status(500).json({message: `Ya se ha despachado el economico ${b.eco}`, ...b})

        const registro: EcoInOut = {...b, tipo: 1}  // 1: Salida/despacho
        const resp = await eco_entradas_salidas.create(registro as any)
        
        res.json(resp)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const postEcoRecepcion = async (req: Request, res: Response) => {
    const b: ReqBody = req.body

    try {
        const regDespacho: EcoInOut_ModelInterface = await eco_entradas_salidas.findOne({
            where: {
                eco: b.eco,
                tipo: 1,
                registro_id: null
            }
        })
        if(!regDespacho) return res.status(500).json({message: `No se ha despachado el economico ${b.eco}`, ...b})

        const registro: EcoInOut = {...b, tipo: 2, registro_id: regDespacho.id}  // 2: Recepcion 
        const regRegreso: EcoInOut_ModelInterface = await eco_entradas_salidas.create(registro as any)
        await eco_entradas_salidas.update( {registro_id: regRegreso.id}, {
            where: { id: regDespacho.id }
        } )
        
        res.json(regRegreso)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}