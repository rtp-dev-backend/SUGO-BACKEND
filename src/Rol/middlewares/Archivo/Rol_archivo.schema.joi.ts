import R  from 'joi'

const reagEX = (/^[A-Z]{10}$/)



export const archivo_validarJoi = R.object({
  path: R.string(),
  nombre: R.string(),
  usuario: R.number() || R.string()

})

export const archivo_getOne_validarJoi = R.object({
  id: R.number().integer()
})

export const file_archivoJoi = R.object({
  name: R.string().required(),
  size: R.number().integer().min(1).required(),

})

export const archivo_bodyJoi = R.object({
  // nombre: R.string().required(),
  usuario: R.number().integer().required(),
  mes: R.string().regex(reagEX),

})