import { Request, Response } from "express"
import { PVestados, PVestados_ModelInterface, pv_estados } from "../Models/pv_estados.model"
import { pv_estados_motivos } from "../Models/pv_estados_motivos.model"
import { SUGO_sequelize_connection } from "../../database/sugo.connection"
import { Includeable, Op } from "sequelize"
import { swaPools } from "../../database/swap.connection"
import { pv_ecos_modalidades } from "../Models/pv_ecos_modalidades.model"



interface GetQueryParams{
    id?: number, 
    tipo?: 1|2|3, 
    eco?: string, 
    eco_estatus?: 0|1|2, 
    fecha_ini?
    fecha_fin?
    motivo?: number,
    modulo?: number,
    create_modulo?: number,
    ruta?: string,
    ruta_modalidad?: string,
    op_cred?: number,
    estatus?: number, 
    motivo_id?: number,
    motivo_tipo?: 1|2,
    motivo_eco_disponible?: 0|1|boolean,
    complemento?: boolean|'true'|'false'|'null'|number,
    // complemento?: boolean|0|1,
    limit?: number, 
    page?: number,
    order?: 'ASC'|'DESC'
}
interface CreateMotivo {
    "desc": string, 
    "tipo": 1|2|3|4,  // [Despacho, Recepcion, Actualización fuera, Actualización dentro](1) de modulo
    "eco_disponible": 0|1|Boolean,
    "createdBy": number,
}



/**
 * Obtener motivos para actualizar el parque vehicular
 */
export const getMotivos = async (req: Request, res: Response) => {
    const {  } = req.query

    try {
        const motivos = await pv_estados_motivos.findAll({ 
            where: { estatus: 1 } 
        });
        res.json(motivos)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createMotivo = async (req: Request, res: Response) => {
    const newMotivo: CreateMotivo = req.body

    try {
        const newRegistro = await pv_estados_motivos.create(newMotivo as any)
        
        // res.json({...newMotivo});
        res.json(newRegistro);
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


export const deleteMotivo = async (req: Request, res: Response) => {
    const { id } = req.params
    const { cred } = req.query

    try {
        //& Find Motivo
        const registro = await pv_estados_motivos.findByPk(id)
        
        //& Middlewares
        if(!registro) return res.status(500).json({ msg: 'No existe motivo con id '+id });
        if(!registro.dataValues?.estatus) return res.status(500).json({ msg: `El motivo ${id} ya estaba eliminado` });
        
        //& SET prev_values
        const prev_values = registro.dataValues?.prev_values || [];
        prev_values.push(JSON.stringify(registro))
        
        //& Update
        await pv_estados_motivos.update({ estatus: null, updatedBy: cred, prev_values },{
            where: { id }
        })
        
        //& Send res
        const registroUpdated = await pv_estados_motivos.findByPk(id)
        return res.json(registroUpdated)
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

const notNullOptions = ['notNull', 'not-null', 'notnull', 'nonull', 'noNull']
/**
 * Obtener todos los estados
 */
export const getEstados = async (req: Request, res: Response) => {
    const { 
        id, 
        tipo, 
        eco, 
        eco_estatus,
        fecha_ini,
        fecha_fin,
        motivo,
        modulo,
        create_modulo, 
        ruta,
        ruta_modalidad,
        op_cred,
        estatus,

        motivo_id,
        motivo_tipo,
        motivo_eco_disponible,

        complemento, 
        limit=1000, 
        page=1,
        order='DESC' 
    }: GetQueryParams = req.query
    //@ts-ignore
    const limite = (limit == '0' || limit=='false') ? undefined :  isNaN(limit) ? 1000 : limit
    //@ts-ignore
    // return res.send({...req.query, reg_id: registro_id=='null'})

    const where: any = {}
    const where_motivos: any = {}

    // include Models
    const include: Includeable[] = [ 
        { model: pv_estados_motivos, where: where_motivos },
        { model: pv_ecos_modalidades, as: 'eco_modalidad', attributes: [['modalidad', 'name']] },
    ]
    //? Añadir complemento del registro solicitado?
    complemento==='true' || !!Number(complemento)
    ? include.push({ model: pv_estados, as: 'complemento', include: [pv_estados_motivos] }) 
    : undefined ;

    
    if(id) where.id = id;
    if(eco) where.eco = { [Op.in]: eco.split(',').map( n => n.trim())};
    // if(eco) where.eco = eco;
    if(tipo) where.tipo = tipo;
    if(eco_estatus) where.eco_estatus = eco_estatus;
    if(fecha_ini) where.momento = { [Op.gte]: fecha_ini };
    if(fecha_fin) where.momento = { [Op.lte]: fecha_fin };
    if(fecha_ini && fecha_fin) where.momento = { [Op.between]: [fecha_ini, fecha_fin] };
    if(motivo) where.motivo_id = motivo;
    if(modulo) where.modulo = modulo;
    if(Number(create_modulo)) where.createdBy_modulo = create_modulo;
    if(ruta) where.ruta = ruta;
    if(ruta_modalidad) where.ruta_modalidad = ruta_modalidad;
    if(op_cred) where.op_cred = op_cred;
    if(!estatus) where.estatus = { [Op.in]: [1,2] };
    else if(estatus) where.estatus = estatus;
    if(!complemento) undefined;
    else if( complemento==='null' || complemento==='false' )  where.registro_id = { [Op.is]: null };
    else if( notNullOptions.includes(complemento as string) ) where.registro_id = null;
    else if( Number(complemento) ) where.registro_id = complemento;
    // if(createdBy) where.createdBy = createdBy

    // Where motivos
    if(motivo_id) where_motivos.id = motivo_id
    if(motivo_tipo) where_motivos.tipo = motivo_tipo
    if(motivo_eco_disponible) where_motivos.eco_disponible = motivo_eco_disponible

    try {
        const { count, rows: estados } = await pv_estados.findAndCountAll({
            where, 
            include,
            order: [ 
                ['momento', order] 
            ],
            limit: limite,
            offset: limite ? (page-1)*limite : 0
        })

        const pages = Math.ceil(count/(limite||count))
        res.json({
            "info": {
                count ,
                pages ,
                // "next": Number(page)<pages ? Number(page)+1 : null,
                // "prev": page>=2     ? page-1 : null,
            },
            "results": estados
        })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


interface RegPrevOrNext {
    id: number,
    tipo: 1|2|3|4
}
/**
 * Crear nuevo estatus de economico 
*/ 
export const createNewEstado = async (req: Request, res: Response) => {
    //? Se ocupa un Middleware para asegurar que venga eso
    const nuevoReg:( PVestados&{motivo_tipo: 1|2, reg_previo?: RegPrevOrNext, reg_siguiente?: RegPrevOrNext} ) = req.body
    // return res.send(nuevoReg)

    const transaction = await SUGO_sequelize_connection.transaction();
    let respuesta: any = { message: 'No coincide con ningun caso para crear un nuevo estado'};

    try {
        const previoReg = nuevoReg.reg_previo;
        const siguienteReg = nuevoReg.reg_siguiente;

        //& Casos
        if( !previoReg && !siguienteReg ) {             //& Caso I:  Primer registro
            // Valores a decidir:  nuevoReg.estatus  //// prev_values, registro_id, (updatedBy)
            /* Flujo:  
                UPDATE status=2 where eco and estatus=1  
                CREAR nuevoReg      (con estatus: 1, (prev_values: null, registro_id: null) )
                --> FIN 
            */

            // Inactivar registros previos/activos  
            await pv_estados.update({ estatus: 2 }, {
                where: {
                    eco: nuevoReg.eco,
                    estatus: 1
                },
                transaction
            });

            // Crear nuevo registro
            const newEdo = await pv_estados.create({...nuevoReg, estatus: 1 }, { transaction });
            respuesta = { newEdo };
        } else if( previoReg && !siguienteReg ){        //& Caso II:  Registro Actual/Top
            // Valores a decidir:  nuevoReg.estatus, nuevoReg.registro_id, prevReg.registro_id
            /* Flujo:  
                UPDATE status=2 where eco and estatus=1  
                nuevoReg.tipo=2 (Recepción) ?
                    ? Setear despacho segun previo
                    let despacho = previoReg
                    if( previoReg.tipo != 1 ) {
                        despacho = FIND DESPACHO where eco and tipo=1 and estatus=2 registro_id is null
                    }

                    CREAR NUEVO CON newEdo.registro_id = previoReg.id
                    UPDATE previoReg.registro_id = newEdo.id
                    --> FIN
                : CREAR NUEVO --> FIN 
            */

            // Inactivar registros previos/activos  
            await pv_estados.update({ estatus: 2 }, {
                where: {
                    eco: nuevoReg.eco,
                    estatus: 1
                },
                transaction
            });

            //^ Si es una Recepción
            if( nuevoReg.tipo == 2 ){
                // Setear despacho segun previo
                let despacho = previoReg
                if( previoReg.tipo != 1 ){      // Si previo no es despacho... busca el despacho abierto
                    const despachoFinded = await pv_estados.findOne({ 
                        where: {
                            eco: nuevoReg.eco,
                            tipo: 1,
                            estatus: 2,     // NO registros eliminados ( Antes cambie los estatus activos(1) por inactivos(2) )
                            registro_id: null
                        }, 
                        transaction 
                    })
                    if (!despachoFinded) throw new Error (`No se encontró un despacho abierto para la recepción del eco ${nuevoReg.eco}`)
                    despacho = despachoFinded
                }

                // Crear nuevo registro
                const newEdo = await pv_estados.create({...nuevoReg, estatus: 1, registro_id: despacho.id }, { transaction });
                // Al ser Recepción setear Despacho  
                const prevRegUpdated = await pv_estados.update({ registro_id: newEdo.id }, { where: { id: despacho.id }, transaction });
                respuesta = { despacho: prevRegUpdated, newEdo };
            } else {    //^ NO es una Recepción
                // Crear nuevo registro
                const newEdo = await pv_estados.create({...nuevoReg, estatus: 1 }, { transaction });
                respuesta = { newEdo };
            }

        } else if( previoReg && siguienteReg ){         //& Caso III:  "Entre" registros

            
        } else if( !previoReg && siguienteReg ){        //& Caso IV:  "Reemplazar" primer registro (Va a ocurrir casi que nuca pero puede pasar)

        
        }
        
        await transaction.commit();
        res.json(respuesta)
    } catch(error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }
}

export const createNewTopEstado = async (req: Request, res: Response) => {
    // Se ocupa un Middleware para asegurar que venga eso
    const data:PVestados = req.body

    const transaction = await SUGO_sequelize_connection.transaction();
    try {
        // Actualizar status de registro previo  
        await pv_estados.update({ estatus: 2 }, {
            where: {
                eco: data.eco,
                estatus: 1
            },
            transaction
        });
        // Crear nuevo registro
        const newEdo = await pv_estados.create({...data, estatus: 1 }, { transaction })
        
        await transaction.commit();
        res.json(newEdo)
    } catch(error) {
        await transaction.rollback();
        return res.status(500).json({ message: error.message })
    }
}

/**
 * "Eliminar" un registro cambiando su estatus a 0 (eliminado) 
 */
export const deleteEstado = async (req: Request, res: Response) => {
    const { id } = req.params
    const { cred } = req.query

    try {
        //& Find Motivo
        const registro = await pv_estados.findByPk(id)
        
        //& Middlewares
        if(!registro) return res.status(400).json({ msg: 'No existe registro con id '+id });

        const {eco, estatus, momento} = registro.dataValues
        if(!estatus) return res.status(400).json({ msg: `El registro ${id} ya estaba eliminado` });

        const regPosteriores = await pv_estados.findAndCountAll({
            where: { eco, estatus: { [Op.not]: 0}, momento: { [Op.gt]: momento },  }
        })
        if(regPosteriores.count) return res.status(400).json({ msg: `El registro ${id} no se puede eliminar porque el eco ${eco} ya tiene registros posteriores` });

        
        await pv_estados.update({ estatus: 0, updatedBy: cred }, { 
            where:{ id }
        })
        console.log(id, 'delete by', cred);
        return res.send({id, msg: 'delete by '+cred})
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

/**
 * Eliminar un registro
 */
// // export const hardDeleteEstado = async (req: Request, res: Response) => {
// //     const { id } = req.params
// //     try {
// //         await pv_estados.destroy({ where:{ id }})
// //         res.json({msg: 'hard delete', id})
// //     } catch(error) {
// //         return res.status(500).json({ message: error.message })
// //     }
// // }


/**
 * 
*/
const tipos_desc = [ undefined, 'Modulo operativo', 'Centros de reconstruccion', 'Comercializacion', 'Almacen Central', 'Modulo dado de baja', 'Control de bienes', 'Inactivo']
export const getModulosSWAP = async (req: Request, res: Response) => {
    const {  } = req.params

    try {
        const modulos = await swaPools[0].query(`
            SELECT 
                mod_clave as id,
                mod_nombre as name,
                mod_direccion as direccion,
                mod_tipo as tipo,
                mod_desc as desc 
            from modulo m
            order by mod_clave;
        `);
        const modulosActivos = modulos.rows.filter( m => !(m.tipo == 5 || m.tipo==7) )

        res.json(modulosActivos.map( m => ({...m, tipo_desc: tipos_desc[m.tipo] }) ))
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}