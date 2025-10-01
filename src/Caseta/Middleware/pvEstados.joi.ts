import J from 'joi';
import Joi from 'joi';

export interface NewEstado {
    momento:        Date,
    tipo:           1|2|3,
    eco:            number,
    eco_estatus:    0|1|2,
    eco_tipo:       1|2|3|4,
    motivo_id:      number,
    motivo_tipo:    1|2,
    motivo_desc:    string,
    modulo:         number,
    direccion:      string,
    ruta:           string,
    ruta_modalidad: string,
    ruta_cc:        string,
    op_cred:        number,
    op_turno:       number,
    extintor:       string,
    createdBy:      number,
    createdBy_modulo:   number,
};

const regPrevOrNext = J.object({
    id:        J.number().integer().required(),
    tipo:           J.number().min(1).max(4).required(),
});

export const ValidarNewEstado = J.object({
    momento:        J.date().required(),
    tipo:           J.number().min(1).max(4).required(),
    eco:            J.number().integer().required(),
    eco_estatus:    J.number().min(0).max(2).required(),
    eco_tipo:       J.number().min(1).max(2),
    motivo_id:      J.number().integer().required(),
    motivo_tipo:    J.number().min(1).max(4).required(),
    // motivo_tipo:    J.number().min(1).max(2).required(),
    motivo_desc:    J.string(),
    modulo:         J.number().integer(),
    direccion:      J.string(),
    ruta:           J.string(),
    ruta_modalidad: J.string(),
    ruta_cc:        J.string(),
    op_cred:        J.number().integer(),
    op_turno:       J.number().integer(),
    extintor:       J.string(),
    // estatus:        J.number().integer().required(),
    // createdAt:      J.date().required(),
    createdBy:      J.number().integer().required(),
    createdBy_modulo: J.number().integer().required(),
    modulo_puerta:  J.string().required(),
    // updateAt:       J.date(),
    updateBy:       J.number().integer(),
    reg_previo:     regPrevOrNext,
    reg_siguiente:  regPrevOrNext,
});

export const ValidarNewMotivo = J.object({
    desc: J.string().required(), 
    tipo: J.number().min(1).max(4).required(), 
    eco_disponible: J.alternatives([J.boolean(), J.number().min(0).max(1)]).required(),
    createdBy: J.number().required()
});

// export const ValidarupdateMotivo = J.object({
//     desc: J.string().required(), 
//     tipo: J.number().min(1).max(4).required(), 
//     eco_disponible: J.alternatives([J.boolean(), J.number().min(0).max(1)]).required(),
//     createdBy: J.number().required()
// });

export const ValidarEliminarRegistro = J.object({
    cred:        J.number().integer().required(),
});

export const ValidarViewPV = Joi.object({
    modulo: Joi.number().required()
});