import { NextFunction, Request, Response } from "express"
import {archivo_getOne_validarJoi,archivo_bodyJoi, file_archivoJoi} from './Rol_archivo.schema.joi'

export const validararchivo =  async (req: Request, res: Response, next: NextFunction) =>{
    const {id} = req.params

    if(!id ) return res.status(400).json({error: "id invalido"})

    

    const resultadoValidacion = archivo_getOne_validarJoi.validate({id}, {
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
export const ValidarbodyFile = (req: Request, res: Response, next: NextFunction) =>{
    const {usuario, mes} = req.body

    const validarbodyFile = archivo_bodyJoi.validate({usuario,mes},{
        abortEarly: false,
    });
    if (validarbodyFile.error) {
        //! console.error('Error de validación:', validarbodyFile.error.details);
        const infoRaw = validarbodyFile.error.details
        console.log(infoRaw)
        let msg = 'Dato erroneo!!!'
        if(infoRaw && infoRaw.length>0) infoRaw.map( ({message}) => {msg = msg + `\n- ${JSON.stringify(message)}`} )
        return res.status(400).json({ error: msg })
        } else {
        //* console.log('Datos válidos:', validarbodyFile.value);
        return next()
        } 
}

export const ValidarReqFiles = (req: Request, res: Response, next: NextFunction) =>{
    const { archivo } = req.files

    const validarReqFile = file_archivoJoi.validate( archivo, {
        abortEarly: false,
    });
    if (validarReqFile.error) {
        //! console.error('Error de validación:', validarReqFile.error.details);
        const infoRaw = validarReqFile.error.details
        let msg = 'Datos ingresados invalidos!!!'
        if(infoRaw && infoRaw.length>0) infoRaw.map( ({message}) => {msg = msg + `\n- ${JSON.stringify(message)}`} )
        return res.status(400).json({ error: msg })
        } else {0
        //* console.log('Datos válidos:', validarReqFile.value);
        return next()
        } 
}



