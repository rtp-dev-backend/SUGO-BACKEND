import { NextFunction, Request, Response } from "express"
import { schema_API } from "./Rol_calendario.schema.joi"
import { DataRol, DataRolPage, HeaderRol, Rol_calendario_API_Body } from "../../interfaces/Rol_calendarios.interface"
import { Rol_Header } from "../../models/Rol_headers.model"
import { Catalogo_modulos } from "../../../General/models/Catalogo_modulos.model"



export const validateDataRol = async (req: Request, res: Response, next: NextFunction) => {
    const { data, modulo }:Rol_calendario_API_Body = req.body

    //^ Validar si tiene info
    if( !Array.isArray(data) || data.length == 0 ) return res.status(202).json( { error: `data is empty, has not relevant info or is missing, value: ${JSON.stringify(data)}`} )
    
    //^ Validar los datos
    const resultadoValidacion = schema_API.validate({ data, modulo }, {
        abortEarly: false, // Permite la validación de todos los errores
    });
    if (resultadoValidacion.error) {
    //! console.error('Error de validación:', resultadoValidacion.error.details);
    const infoRaw = resultadoValidacion.error.details
    let msg = 'Invalido!!!'
    if(infoRaw && infoRaw.length>0) infoRaw.map( ({message}) => {msg = msg + `\n- ${JSON.stringify(message)}`} )
    return res.status(400).json({ error: msg })
    } else {
    //* console.log('Datos válidos:', resultadoValidacion.value);
    return next()
    } 
}

// const a1:DataRolPage = {}
// const a2:HeaderRol = {}
export const validateHeaders = async (req: Request, res: Response, next: NextFunction) => {
    const { data, modulo }:Rol_calendario_API_Body  = req.body

    try {
        const { id: modulo_id } = await Catalogo_modulos.findOne({ where: { modulo } })
        
        const headerFindedPromise =  await Promise.all( data.map( async({hoja, data}) => {
            const { header:  { ruta_id, periodo_id }} = data
            
            const Header = await Rol_Header.findOne({ where: { id_rutas: ruta_id, id_periodos: periodo_id } })
            return Header
        }))

        const headersFinded = headerFindedPromise.filter(Boolean).filter( obj => obj.id_modulos == modulo_id )

        if( headersFinded[0] ) return res.status(400).json({ error: 'Los Roles que se intentan subir fueron creados previamente, verifique la lista de Roles creados' })
        
        next()
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}


export const validatePrueba1 = async (req: Request, res: Response, next: NextFunction) => {
    const { id_header, } = req.body


    if(id_header) return next()
    
    return res.status(500).json({ msg: 'Invalid 1!!!' })
}
