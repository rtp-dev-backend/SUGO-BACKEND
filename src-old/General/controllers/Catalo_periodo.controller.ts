// CONEXION
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
//METODO
import { Request, Response } from 'express'
//MODELO
import { Catalogo_peridos } from '../../General/models/Catalogo_periodo.model.js'
import { Op, QueryTypes } from "sequelize";
import sortByDate from "../../utilities/funcsArrays/sortByDate.js";


export const getPeriodos = async (req: Request, res: Response) => {

    const {fecha_fin, aho} = req.query

    const where: any = {}
    let limit: number = undefined

    if(fecha_fin) where.fecha_fin = { [Op.lte]: fecha_fin };
    if(aho) {
        where.fecha_inicio = { [Op.gte]: `${aho}-1-1` }
        limit = 12
    }

    try {
        const Periodo = await Catalogo_peridos.findAll({
            where,
            limit
        })

        if( Periodo.length == 0 ) return res.json( [] )

        const data = sortByDate(Periodo, 'fecha_inicio')

        res.json(data)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export const getPeridos = async (req: Request, res: Response) => {
    try {
        const Perido = await Catalogo_peridos.findAll()
        res.json(Perido)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getPerido = async (req: Request, res: Response) => {
    try {
        // Option 1
        const Periodo = await Catalogo_peridos.findAll({
            attributes: [
              'id',
              [SUGO_sequelize_connection.fn('to_char', SUGO_sequelize_connection.col('fecha_inicio'), 'yyyy/mm/dd' ), 'fecha_inicio'],
              [SUGO_sequelize_connection.fn('to_char', SUGO_sequelize_connection.col('fecha_fin'), 'yyyy/mm/dd' ), 'fecha_fin'],
              'createdAt',
              'updatedAt',
              'serial'
            ]
        })

        // Option 2
        const Periodo2 = await SUGO_sequelize_connection.query(`
            SELECT 
                id, 
                to_char(fecha_inicio,'YYYY/MM/DD') AS fecha_inicio,
                to_char(fecha_fin,'YYYY/MM/DD') AS fecha_fin,
                serial,
                "createdAt",
                "updatedAt"
            FROM periodos
        `, { type: QueryTypes.SELECT });

        res.json(Periodo)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getPeriodo = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const Perido = await Catalogo_peridos.findOne({
            where: { id },
        })
        res.json(Perido)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postPerido = async (req: Request, res: Response) => {
    const {fecha_inicio, fecha_fin, serial} = req.body
    try {
        const Perido = await Catalogo_peridos.create({
            fecha_inicio,
            fecha_fin,
            serial,

        })
        res.json(Perido)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postPeriodosAll = async (req: Request, res: Response) => {
    const { data } = req.body
    // return res.json(data)
    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        const newModalidades = await Catalogo_peridos.bulkCreate(data, { transaction });

        await transaction.commit();
        res.json(newModalidades)
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }

}

export const deletePerido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Catalogo_peridos.destroy({
            where: {
                id,
            },
        });
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



// //dejar al final
// export const putmodalidad_autorizada = async (req: Request, res: Response) => {


// }