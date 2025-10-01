import J from 'joi';


export const schemaPostRutas = J.array().items( 
    J.object({
        nombre:             J.string().required(), 
        swap_ruta:          J.string().required(), 
        origen_destino:     J.string().required(), 
        id_autorizada_mod:  J.number().integer().required(),
    })
).required().min(1);