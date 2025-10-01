
import { NextFunction, Request, Response } from 'express'
import { Catalogo_peridos} from "../../General/models/Catalogo_periodo.model"






export const validarPeriodo = async (req: Request, res: Response, next:NextFunction) => {
    const {serial} = req.body

    try {
        const Serial_resDB = await Catalogo_peridos.findOne({
            where : {serial},
        })
        console.log(Serial_resDB)
        if(!Serial_resDB) return next() 

        res.json({msg: 'ya existe el serial', Modulo: Serial_resDB})

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }  
}
