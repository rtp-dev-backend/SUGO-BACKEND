import { NextFunction, Request, Response } from "express"
import { ValidarTarjeta } from "../../middlewares/Tarjeta_Operador/valtarjetas_operador.joi";


export const ValidarTarjeta_Oper = (req: Request, res: Response, next: NextFunction) =>{
    const {modulo, inicio,fin} = req.query

    const ValidarTarjeta_Oper = ValidarTarjeta.validate({modulo,inicio,fin},{
        abortEarly: false,
    });
    if (ValidarTarjeta_Oper.error) {
        //! console.error('Error de validación:', ValidarTarjeta_Oper.error.details);
        const infoRaw = ValidarTarjeta_Oper.error.details
        console.log(infoRaw)
        let msg = 'Dato erroneo!!!'
        if(infoRaw && infoRaw.length>0) infoRaw.map( ({message}) => {msg = msg + `\n- ${JSON.stringify(message)}`} )
        return res.status(400).json({ error: msg })
        } else {
        //* console.log('Datos válidos:', ValidarTarjeta_Oper.value);
        return next()
        } 
}