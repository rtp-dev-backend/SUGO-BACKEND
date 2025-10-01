import { Request, Response } from "express"
import { Rol_Jornada } from "../models/Rol_jornada.model"


export const getRol_jornadas = async (req: Request, res: Response) => {
    try {
      const Jornadas = await Rol_Jornada.findAll() 
      res.json(Jornadas)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getRol_jornada = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
      const Jornada = await Rol_Jornada.findByPk(id) 
      res.json(Jornada)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const postRol_jornada = async (req: Request, res: Response) => {
    const {turno, hr_ini_t, lug_ini_cc, hr_ini_cc, hr_ter_cc, lug_ter_cc, hr_ter_mod, hr_ter_t} = req.body
    const data = { turno, hr_ini_t, lug_ini_cc, hr_ini_cc, hr_ter_cc, lug_ter_cc, hr_ter_mod, hr_ter_t }
    try {
      // const Header = await Rol_Jornada.create( data )  
      const Header = await Rol_Jornada.findOrCreate( { where: data } )  
      res.json(Header)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const post_manyRol_jornadas = async (req: Request, res: Response) => {
    const { data } = req.body
    // const data = { turno, hr_ini_t, lug_ini_cc, hr_ini_cc, hr_ter_cc, lug_ter_cc, hr_ter_mod, hr_ter_t }
    try {
      // const Header = await Rol_Jornada.create( data )  
      const Header = await Rol_Jornada.findOrCreate( { where: data } )  
      res.json(Header)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}