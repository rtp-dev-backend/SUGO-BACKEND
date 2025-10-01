import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { Request, Response } from 'express'
import { modalidad_autorizada } from '../models/modalidad_autorizada.model.js'
import { ruta_autorizada} from "../models/rutas_autorizadas.model.js"





export const getmodalidad_autorizada = async (req: Request, res: Response) => {
    try {
        const Modadlidad = await modalidad_autorizada.findAll()
        res.json(Modadlidad)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }  
}

export const getmodalidades_autorizada = async (req: Request, res: Response) => {
   const {id} = req.params
    try {
        const Modadlidad = await modalidad_autorizada.findOne({
            where : {id},
        })
        res.json(Modadlidad)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postmodalidad_autorizada = async (req: Request, res: Response) => {
    const { name } = req.body
    try {
        const newModalidad = await modalidad_autorizada.create({
            name,
            
        })
        res.json(newModalidad)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postModalidades = async (req: Request, res: Response) => {
    const { data } = req.body
    // return res.json(data)
    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        const newModalidades = await modalidad_autorizada.bulkCreate(data, { transaction });

        await transaction.commit();
        res.json(newModalidades)
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }

}

export const deletemodalidad_autorizada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await modalidad_autorizada.destroy({
            where: {
                id,
            },
        });
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//dejar al final
export const putmodalidad_autorizada = async (req: Request, res: Response) => {


}