import { Request, Response } from "express"
import { view_trabajador } from "../models/view_trabajador.model"


export const getTrabInfo = async (req: Request, res: Response) => {
    const { cred } = req.params

    try {
        const data = await view_trabajador.findByPk(cred)

        res.json(data)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}