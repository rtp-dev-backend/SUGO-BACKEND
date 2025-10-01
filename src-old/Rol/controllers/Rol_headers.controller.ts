// import { SGI_sequelize_connection } from './../../database/sgi.connection';
import { Rol_Header } from '../../Rol/models/Rol_headers.model'
import { Request, Response } from 'express';
import { rolHeaders_get } from '../services/Rol_headers.services';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { rol_calendarios } from '../models/rol_calendarios.model';



export const getRol_headers = async (req: Request, res: Response) => {
    const { periodo, modulo } = req.query as unknown as { periodo: number, modulo: number };

    try {
        const Header = await rolHeaders_get( {periodo, modulo} )

        res.json(Header)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getRol_header = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as { id: number };
    try {
        const Header = await rolHeaders_get( {header_id: id} )

        if(Header.length==0) return res.send(null)
        res.json(Header[0])

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const postRol_headers = async (req: Request, res: Response) => {
    const { id_modulos, id_periodos, id_rutas } = req.body
    const data = { id_modulos, id_periodos, id_rutas }
    try {
      const Header = await Rol_Header.create( data )  
      res.json(Header)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export const deleteRol_headers = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as { id: number };
    
    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        
        await rol_calendarios.destroy({
            where: { id_header: id },
            transaction
        });

        await Rol_Header.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        res.json({id_header: id})
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }
}