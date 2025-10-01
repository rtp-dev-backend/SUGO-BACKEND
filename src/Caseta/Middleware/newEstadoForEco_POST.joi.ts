import J from 'joi';


export const ValidarnewEcoEstado = J.object({
    eco_estatus: J.number().integer().required(),
    eco:         J.number().integer().required(),
    momento:     J.date().required(),
    motivo:      J.string().required(),
    motivo_desc: J.string(),
    lugar_tipo:  J.number().integer().required(),
    lugar:       J.string().required(),
    lugar_desc:  J.string(),
    createdBy:   J.number().integer().required()
})