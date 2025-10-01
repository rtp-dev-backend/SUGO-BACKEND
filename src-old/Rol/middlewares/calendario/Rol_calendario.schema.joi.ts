import j from "joi";

const regEx_dateG = /^\d{4}-\d{2}-\d{2}$/       // fecha 'yyyy-mm-dd'
const regEx_dateD = /^\d{4}\/\d{2}\/\d{2}$/     // fecha 'yyyy/mm/dd'
const regEx_hr =    /^\d{2}:\d{2}$/             // hora  'hh:mm'
const regEx_cc =    /^[A-Z]{3}$/                // CC    'ABC'

// Definir un esquema de validación para un objeto
// export const schema_ejemplo = Joi.object({
//   nombre: Joi.string().min(3).max(30).required(),
//   edad: Joi.number().integer().min(18).max(99).required(),
//   correo: Joi.string().email().required(),
//   activo: Joi.boolean().required(),
//   fechaNacimiento: Joi.date().iso().required(),
//   intereses: Joi.array().items(Joi.string()).required(),
//   direccion: Joi.object({
//     calle: Joi.string().required(),
//     ciudad: Joi.string().required(),
//     codigoPostal: Joi.string().regex(/^\d{5}$/).required(),
//   }),
// });


// Definir un esquema de validación para un objeto
export const schema_Rol_calenadario = j.object({
    id_header:  j.number().integer().required(),
    op_cred:    j.number().integer(),
    id_jornada: j.number().integer(),
    dia:        j.date(),
    op_tipo:    j.string(),
    op_estado:  j.string(),
    sistema:    j.string(),
    eco:        j.number().integer(),
    servicio:   j.string()
});

//^ ------------ ------------ --------------- -------------- --------------

const schema_Credenciales = j.object({
    cred_turno1: j.number().integer(),
    cred_turno2: j.number().integer(),
    cred_turno3: j.number().integer(),
}).min(1);

const schema_Jornadas = j.object({
    turno:      j.number().integer().required(),
    hr_ini_t:   j.date().required(),
    hr_ter_t:   j.date().required(),
    hr_ini_cc:  j.date(),   
    hr_ter_cc:  j.date(),   
    hr_ter_mod: j.date(),
    lug_ini_cc: j.string().max(3).required(),   
    lug_ter_cc: j.string().max(3), 
});

const schema_Descansos = j.object({
    lunes:      j.string().max(2),
    martes:     j.string().max(2),
    miercoles:  j.string().max(2),
    jueves:     j.string().max(2),
    viernes:    j.string().max(2),
    sabado:     j.string().max(2),
    domingo:    j.string().max(2),
});

const schema_Sistema = j.string().valid( 'E/S', 'T/F' );

const schema_JoE = j.object({
  cred:         j.number().integer().required(),
  lugIni1:      j.string().required(),
  hr_ini_t:     j.date().required(),
  hr_ter_t:     j.date().required(),
  descansos:    schema_Descansos.required().min(1),
});

const schema_CD = j.object({
    servicio:       j.string().required(),
    eco:            j.string(),
    sistema:        schema_Sistema.required(),
    credenciales:   schema_Credenciales.required(),
    descansos:      schema_Descansos.required().min(2),
});


const schema_RolWithTurnos = j.object({
    servicio:       j.string().required(),
    eco:            j.string(),
    sistema:        schema_Sistema.required(),
    credenciales:   schema_Credenciales.required(),
    descansos:      schema_Descansos.required().min(2),
    lun_vie:        j.array().items( schema_Jornadas ),
    sab:            j.array().items( schema_Jornadas ),
    dom:            j.array().items( schema_Jornadas )
});


const schema_HeaderRol = j.object({
    periodo_date_ini:   j.alternatives().try( j.string().regex(regEx_dateG), j.string().regex(regEx_dateD) ),       //! Estaba comentado porque sobran, uso el periodo_id
    periodo_date_fin:   j.alternatives().try( j.string().regex(regEx_dateG), j.string().regex(regEx_dateD) ),       //! Estaba comentado porque sobran, uso el periodo_id
    periodo:            j.string(),
    periodo_id:         j.number().integer().required(),
    ori_des:            j.string(),
    ruta:               j.alternatives().try( j.string(), j.number() ),
    ruta_id:            j.number().integer().required(),
    modalidad:          j.string(),
    modalidad_id:       j.number().integer().required()
});
const schema_Notas = j.object({
    sacanDiasParesT1:     j.boolean().required(),
    diasFes: j.object({
          existLabel:         j.string().required(),
          lista: j.array().items( j.object({
              df_dias:        j.string().required(),
              df_servicios:   j.string().required(),
          })),
      }),
  });

const schema_DataRolPage = j.object({
    header: schema_HeaderRol.required(),
    rol: j.array().items( schema_RolWithTurnos ).required().min(1),
    cd: j.array().items( schema_CD ).required(),
    joe: j.array().items( schema_JoE ).required(),
    notas: schema_Notas.required(),
});

const schema_DataRol = j.object({
    hoja: j.string().required(),
    data: schema_DataRolPage.required(),
});


export const schema_API = j.object({
  data:     j.array().items( schema_DataRol ).required(),
  modulo:   j.alternatives().try(j.number().integer(), j.string()).required(),
});


export const schema_API_getEcosYcreds = j.object({
    rol: j.number().integer(),
    needEcos: j.number().integer().max(1),
    needCreds: j.number().integer().max(1),
    inString: j.number().integer().max(1),
});


export const schema_API_getCalendariosByCred = j.object({
    // op_cred: j.number().integer(),
    fechaIni: j.alternatives().try( j.string().regex(regEx_dateG), j.string().regex(regEx_dateD) ).required(),
    fechaFin: j.alternatives().try( j.string().regex(regEx_dateG), j.string().regex(regEx_dateD) ).required(),
});



/*
& Interfaces        schemas
Credenciales        schema_Credenciales
DataRol             schema_DataRol
DataRolPage         schema_DataRolPage; esquemaNotas
HeaderRol           schema_HeaderRol
RolWithTurnos       schema_RolWithTurnos
CD                  schema_CD
JoE                 schema_JoE
Sistema             schema_Sistema
Descansos           schema_Descansos
Jornadas            schema_Jornadas
*/