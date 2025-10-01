import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { Request, Response } from 'express'
import {Catalogo_modulos} from '../models/Catalogo_modulos.model.js'


export const getModulos = async (req: Request, res: Response) => {
    const { modulo } = req.query
    const where: any = {}
    if(modulo)   where.modulo = `${modulo}`.toUpperCase() // DEBE SER string
    try {
        const Modulo = await Catalogo_modulos.findAll({ where })
        res.json(Modulo[0])

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }  
}

export const getModulo = async (req: Request, res: Response) => {
   const {id} = req.params
    try {
        const Modulo = await Catalogo_modulos.findOne({
            where : {id},
        })
        res.json(Modulo)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postModulo = async (req: Request, res: Response) => {
    const {modulo, descripcion} = req.body
    try {
        const Modulo = await Catalogo_modulos.create({
        modulo,
        descripcion
        })
        res.json(Modulo)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const deleteModulo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Catalogo_modulos.destroy({
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
export const putModulo = async (req: Request, res: Response) => {


}