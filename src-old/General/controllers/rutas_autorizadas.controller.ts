import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { Request, Response } from 'express'
import { modalidad_autorizada } from '../models/modalidad_autorizada.model.js'
import { ruta_autorizada} from "../models/rutas_autorizadas.model.js"
import { Cat_Rutas } from "../interfaces/Catalogo_rutas_autorizadas.js"
import { Op } from "sequelize"






export const getRutas_autorizadas = async (req: Request, res: Response) => {
    const { 
        swap, 
        ruta, 
        modalidad,
        estatus=1 
    } = req.query
    const where: Partial<Record<keyof Cat_Rutas, any >> = {}
    if(swap)        where.swap_ruta = swap
    if(ruta)        where.nombre = ruta
    if(modalidad)   where.id_autorizada_mod = modalidad // DEBE SER NUMERO
    if(!Number.isNaN(estatus)) where.estatus = estatus
    
    try {
        const Ruta = await ruta_autorizada.findAll({
            where,
            include: [ 
                {
                    model: modalidad_autorizada,
                    attributes: [ 'id', 'name' ]
                },
            ]
        })

        const data = Ruta.map( ruta => {
            const { id_autorizada_mod, modalidades_autorizada, ...resto } = ruta.dataValues
            const { name, id } = modalidades_autorizada.dataValues
            return { ...resto, modalidad: name, modalidad_id: id  }
        } )

        res.json(data)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }  
}

export const getRuta_autorizada = async (req: Request, res: Response) => {
   const {id} = req.params
    try {
        const Ruta = await ruta_autorizada.findOne({
            where : {id},
            include: [ 
                {
                    model: modalidad_autorizada,
                    attributes: [ 'id', 'name' ]
                } 
            ]
        })

        const { id_autorizada_mod, modalidades_autorizada, ...resto } = Ruta.dataValues
        const { name, id:moda_id } = modalidades_autorizada.dataValues
        const data = { ...resto, modalidad: name, modalidad_id: moda_id }

        res.json(data)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


// Crea muchas rutas (nuevas)
/*// ToDo: 
  ✅ Cambiar estatus a rutas activas por 0
  ✅ findOrCreate rutas (name + modalidad + ori-des) con estatus 0 y guardar los id's
  ✅ update estatus a 1 where id in id's
*/
interface Data { nombre: string, swap_ruta: string, origen_destino: string, id_autorizada_mod: number }

export const postRutas = async (req: Request, res: Response) => {
    const data = req.body as Data[] 
    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        //& Cambiar estatus a rutas activas por inactivas 0
        await ruta_autorizada.update({ estatus: 0 }, {
            where: { estatus: 1 },
            transaction
        });

        //& Find or Create rutas  
        const rutasPromises = data.map( async(ruta): Promise<[Cat_Rutas, boolean]> => {
            const { nombre, id_autorizada_mod, origen_destino, swap_ruta } = ruta
            const rutaPromise = ruta_autorizada.findOrCreate({
                where: { nombre, origen_destino, id_autorizada_mod },
                defaults: { estatus: 0, swap_ruta },
                transaction
            });
            return rutaPromise
        });

        const rutasFindedOrCreated = await Promise.all( rutasPromises )
        const rutasId = rutasFindedOrCreated.map( ruta => ruta[0].id );

        //& Cambiar estatus a rutas activas por inactivas 0
        await ruta_autorizada.update({ estatus: 1 }, {
            where: { 
                id: { [Op.in]: rutasId } 
            },
            transaction
        });

        //& Data a enviar como respuesta
        const newRutas = rutasFindedOrCreated.map( ruta => ruta[0]);

        await transaction.commit();
        res.json(newRutas)
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }
}



//! Hasta donde recuerdo (22/12/2023) no se usan en una app ↓

export const deleteRuta_autorizada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await ruta_autorizada.destroy({
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

// Crear 
export const Ruta_modalidad = async (req: Request, res: Response) =>{
    try {
        // const { swap_ruta, nombre, origen_destino, modalidad_id } = req.body;
        const Ruta_mod = await ruta_autorizada.create(
            req.body,
            {
                include: modalidad_autorizada
            }
        );
        res.json(Ruta_mod);

    } catch (error) {
        res.status(500).json({ error: 'Error al crear la ruta con su modalidad' });

    }
}
