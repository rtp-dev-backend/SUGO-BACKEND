import { Transaction } from "sequelize";
import { Jornadas } from "../interfaces/Rol_calendarios.interface"
import { Rol_Jornada } from "../models/Rol_jornada.model";


interface Opt {
    transaction: Transaction
}

/**
 * Helper especifico: aplica **findOrCreate** para retornar un array de id's
 * @param jornadas 
 * @returns id's[ ]
 */
const FindOrCreate_jornadas = async(jornadas: Jornadas[]|undefined, options: Opt) => {
    if( !(Array.isArray(jornadas)) || jornadas.length==0) return []

    try {
        const { transaction } = options
        const idsPromises = jornadas.map( async(j) => {
            const { turno, hr_ini_t, hr_ter_t, lug_ini_cc, lug_ter_cc, hr_ini_cc, hr_ter_cc, hr_ter_mod } = j
            const jornada = { turno, hr_ini_t, hr_ter_t, lug_ini_cc, lug_ter_cc, hr_ini_cc, hr_ter_cc, hr_ter_mod }
            const [{ id }] = await Rol_Jornada.findOrCreate({ where: jornada, transaction });
            return { turno, id_jornada: id }
        } )
    
        const ids = await Promise.all(idsPromises)
    
        return ids
    } catch (error) {
        throw new Error(`Error en FoC_jornadas: ${error}`)
    }
}


export default FindOrCreate_jornadas