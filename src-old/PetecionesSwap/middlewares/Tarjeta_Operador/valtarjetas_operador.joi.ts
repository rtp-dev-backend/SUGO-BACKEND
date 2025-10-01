import J from 'joi'
import { regEx_fechaDiagonal, regEx_fechaGuion } from '../../../utilities/regEx'


export const ValidarTarjeta = J.object({
    modulo: J.number().integer().required(),
    inicio: J.alternatives().try( J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),
    fin   : J.alternatives().try(J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),


})