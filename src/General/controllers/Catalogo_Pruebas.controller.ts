import { Request, Response } from 'express'
//MODELO
import { Periodo_prueba } from '../../General/models/Catalogo_Prueba.model'


export const getPruebas = async (req: Request, res: Response) => {
    try {
        const Perido = await Periodo_prueba.findAll()
        res.json(Perido)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getPrueba = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const Perido = await Periodo_prueba.findOne({
            where: { id },
        })
        res.json(Perido)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const postPruebas = async (req: Request, res: Response) => {
    const { fecha_inicio, fecha_fin, serial, hora } = req.body
    try {
        const Perido = await Periodo_prueba.create({
            fecha_inicio,
            fecha_fin,
            hora,
            serial,

        })
        res.json(Perido)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}