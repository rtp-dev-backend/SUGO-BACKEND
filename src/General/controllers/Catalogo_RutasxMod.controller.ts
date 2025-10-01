import { Request, Response } from "express"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"

import { ruta_autorizada } from "../models/rutas_autorizadas.model.js"
import { Catalogo_modulos } from './../models/Catalogo_modulos.model.js';
import { Catalogo_RutaXMod } from './../models/Catalogo_RutasXMod.model';



export const getrutasxmods = async (req: Request, res: Response) => {

    try {
        const rutaxmod = await Catalogo_RutaXMod.findAll({

            include: [ruta_autorizada, Catalogo_modulos]
        })

        res.json(rutaxmod)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getrutaxmod = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const rutaxmod = await Catalogo_RutaXMod.findOne({
            where : {id}, 
            include : [ruta_autorizada, Catalogo_modulos]
        })
        res.json(rutaxmod)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postrutaxmod = async (req: Request, res: Response) => {
    const {modulo, ruta} = req.body
    try {
        const rutaxmod = await Catalogo_RutaXMod.create({
            id_modulo : modulo,
            id_ruta : ruta
        })
        res.json(rutaxmod)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const deleterutaxmod = async (req: Request, res: Response, ) => {
    const {id} = req.params
    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        await Catalogo_RutaXMod.destroy({
            where: { id },
            transaction: transaction
        });

        await Catalogo_modulos.destroy({
            where: {
                id
            },
            transaction: transaction
        });
        
        await ruta_autorizada.destroy({
            where: {
                id
            },
            transaction: transaction
        });
        await transaction.commit();
        res.sendStatus(204);
        console.log(deleterutaxmod)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const putrutaxmod = async(req: Request, res: Response, ) =>{
    try {
        const { id } = req.params;
        const { modulo, ruta} = req.body
        const rutaxmod = Catalogo_RutaXMod.update({id_modulo: modulo, id_ruta:ruta},{
            where:{id}
        })
        res.json(rutaxmod)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }



    
}