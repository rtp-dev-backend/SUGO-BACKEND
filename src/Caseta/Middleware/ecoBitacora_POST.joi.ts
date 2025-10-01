import J from 'joi';
import { regEx_fechaDiagonal, regEx_fechaGuion } from '../../utilities/regEx';


const base = {
    modulo_id:  J.number().integer().required(),
    eco:        J.number().integer().required(),
    op_cred:    J.number().integer().required(),
    turno:      J.number().integer(),
    extintor:   J.alternatives().try( J.string(), J.any()),
    ruta_swap:  J.string(),
    ruta_modalidad: J.string(),
    ruta_cc:    J.string(),
    modulo_time:J.date().required(),
    motivo:     J.string().required(),
    motivo_desc:J.string(),
    cap_time:   J.date().required(),
    cap_user:   J.number().integer().required(),
}

export const ValidarEcoBitacoraOut = J.object({
    ...base,
    eco_tipo:   J.number().min(1).max(2).required(),
})

export const ValidarEcoBitacoraIn = J.object({
    ...base,
})

export const ValidarGetSince = J.object({
    fecha_ini: J.alternatives().try( J.string(), J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)),
})