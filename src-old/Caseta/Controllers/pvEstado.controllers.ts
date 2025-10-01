import { Request, Response } from "express"
import { Op, QueryTypes } from "sequelize"
import { pv_estados_old } from "../Models/pv_estado.model"
import { swaPools } from "../../database/swap.connection"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"



export const getEstadoDelPV = async (req: Request, res: Response ) => {

    const {
        eco,
        ultimo_cambio,
        eco_estatus,
        fecha_ini,
        fecha_fin,
        motivo,
        lugarTipo,
        lugar,
        estatus,
        createdBy
    } = req.query

    let order;  // [['id', 'DESC']]
    let limit;  // 
    const where: any = {}

    if(eco) where.eco = eco
    if(ultimo_cambio) { order = [['id', 'DESC']]; limit=1 }
    if(eco_estatus) where.eco_estatus = eco_estatus
    if(fecha_ini) where.momento = { [Op.gte]: fecha_ini }
    if(fecha_fin) where.momento = { [Op.lte]: fecha_fin }
    if(fecha_ini && fecha_fin) where.momento = { [Op.between]: [fecha_ini, fecha_fin] }
    if(motivo) where.motivo = motivo
    if(lugarTipo) where.lugar_tipo = lugarTipo
    if(lugar) where.lugar = lugar
    if(estatus) where.estatus = estatus
    if(createdBy) where.createdBy = createdBy

    try {
        const data = await pv_estados_old.findAll({ where, limit, order });

        if(ultimo_cambio) return res.json(data[0])
        return res.json(data)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


interface CreateNew_ReqBody {
    eco_estatus:    number; // 2,
    eco:            number; // 3000,
    momento:        Date;   // "2024-01-10T05:00:00.000Z",
    motivo:         string; // "MTTO PREVENTIVO",
    motivo_desc?:   string; // "",
    lugar_tipo:     number; // 2,
    lugar:          string; // "5",
    lugar_desc?:    string; // "",
    createdBy:      number; // 11172
    // estatus:        number; // Se añade al crear un registro
    // updatedBy?:     number; // Se añade al editar un registro
    // updatedAt?:     Date;   // Se añade al editar un registro
    // createdAt:      Date;   // Se añade automaticamente al crear un registro,
}

export const createNewEstadoForEco = async (req: Request, res: Response) => {
    const b:CreateNew_ReqBody = req.body

    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        //& Cambiar el registro previo a inactivo
        await pv_estados_old.update({ estatus: 2 }, { 
            where: {
                eco: b.eco,
                estatus: 1
            },
            transaction
        });

        const registro = await pv_estados_old.create({
            eco:            b.eco,
            eco_estatus:    b.eco_estatus,
            momento:        b.momento,
            motivo:         b.motivo,
            motivo_desc:    b.motivo_desc,
            lugar_tipo:     b.lugar_tipo,
            lugar:          b.lugar,
            lugar_desc:     b.lugar_desc,
            estatus:        1,
            createdBy:      b.createdBy
        }, { transaction }) 

        await transaction.commit();
        
        res.json(registro)
    } catch(error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }
}


const tipos_desc = [ undefined, 'Modulo operativo', 'Centros de reconstruccion', 'Comercializacion', 'Almacen Central', 'Modulo dado de baja', 'Control de bienes', 'Inactivo']
export const getModulosSWAP = async (req: Request, res: Response) => {
    const {  } = req.params

    try {
        const modulos = await swaPools[0].query(`
            SELECT 
                mod_clave as id,
                mod_nombre as name,
                mod_direccion as direccion,
                mod_tipo as tipo,
                mod_desc as desc 
            from modulo m
            order by mod_clave;
        `);
        const modulosActivos = modulos.rows.filter( m => !(m.tipo == 5 || m.tipo==7) )

        res.json(modulosActivos.map( m => ({...m, tipo_desc: tipos_desc[m.tipo] }) ))
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

/**
tipo de modulo
1 = 'Modulo operativo'
2 = 'Centros de reconstruccion'
3 = 'Comercializacion'
4 = 'Almacen Central'
5 = 'Modulo dado de baja'
6 = 'Control de bienes'
7 = 'Inactivo'
 */