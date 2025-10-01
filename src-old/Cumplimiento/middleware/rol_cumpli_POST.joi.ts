import J from 'joi';
import { regEx_NumsSplitByComma, regEx_fechaDiagonal, regEx_fechaGuion } from '../../utilities/regEx';



const schemaPeriodo = J.object({
    id:             J.number().integer().required(),
    serial:         J.number().integer().required(), 
    fecha_inicio:   J.alternatives().try( J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),
    fecha_fin:      J.alternatives().try( J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),
    createdAt:      J.date(),
    updatedAt:      J.date()
})

const schemaRuta = J.object({
    id:             J.number().integer().required(),
    modulo_id:      J.number().integer().required(),
    modulo:         J.alternatives().try(J.number().integer(), J.string()).required(),
    modulo_desc:    J.string().required(),
    ruta_id:        J.number().integer().required(),
    ruta:           J.string().required(),
    modalidad:      J.string().required(),
    swap_ruta:      J.string().required(),
    periodo_id:     J.number().integer().required(),
    periodo_serial: J.number().integer().required(),
    periodo_inicio: J.alternatives().try( J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),
    periodo_fin:    J.alternatives().try( J.string().regex(regEx_fechaGuion), J.string().regex(regEx_fechaDiagonal)).required(),
    ecos_distintos: J.number().integer(),
    op_distintos:   J.number().integer(),
})

export const ValidarTarjetaOp = J.object({
    modulo : J.number().integer().required(),
    ecos   : J.array().items( J.number().integer() ).required().min(1),
    periodo: schemaPeriodo,
    ruta   : schemaRuta,
})


export const ValidarOpCreds = J.object({
    op_creds: J.array().items( J.number().integer() ).required().min(1),
    // op_creds: J.string().regex(regEx_NumsSplitByComma).required(),
    periodo:  schemaPeriodo.required(),
})
