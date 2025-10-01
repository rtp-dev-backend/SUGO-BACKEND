
import { NextFunction, Request, Response } from 'express'
import { Catalogo_modulos } from "../models/Catalogo_modulos.model"






export const validtMod = async (req: Request, res: Response, next:NextFunction) => {
    const {modulo} = req.body

    try {
        const Modulo_resDB = await Catalogo_modulos.findOne({
            where : {modulo},
        })
        console.log(Modulo_resDB)
        if(!Modulo_resDB) return next() 

        res.json({msg: 'ya existe el modulo', Modulo: Modulo_resDB})

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }  
}
