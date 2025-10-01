import { hrDateToString } from "../../../utilities/funcsDates/funcs";
import { JoE, RolWithTurnos } from "../../interfaces/Rol_calendarios.interface";

/**
 * Helper especifico: Del Rol y JoE convierte las horas que vienen en Dates en horas (hh:mm) 
 * @param rolPre rol previo con horas como Dates
 * @param joePre rol de JoE previo con horas como Dates
 * @returns Rol y JoE en un objeto 
 */
const convertHrs = (rolPre: RolWithTurnos[], joePre: JoE[]):{rol:RolWithTurnos[], joe:JoE[]} => {

    const rol = rolPre.map( sevicio => {
        ['lun_vie','sab','dom'].map(tipo => {
            if(sevicio[tipo]){
                sevicio[tipo] = sevicio[tipo].map( j => {
                    j.hr_ini_t   = j.hr_ini_t   ? hrDateToString(j.hr_ini_t)    : null
                    j.hr_ter_t   = j.hr_ter_t   ? hrDateToString(j.hr_ter_t)    : null
                    j.hr_ini_cc  = j.hr_ini_cc  ? hrDateToString(j.hr_ini_cc)   : null
                    j.hr_ter_cc  = j.hr_ter_cc  ? hrDateToString(j.hr_ter_cc)   : null
                    j.hr_ter_mod = j.hr_ter_mod ? hrDateToString(j.hr_ter_mod)  : null
                    return j
                } )
            }
        });
        return sevicio
    })
  
    const joe = joePre.map( r => {
        const { hr_ini_t, hr_ter_t, ...resto } = r
        const hr1 = hrDateToString(hr_ini_t)
        const hr2 = hrDateToString(hr_ter_t)
        return {...resto, hr_ini_t: hr1, hr_ter_t: hr2 }
    })

    return {rol, joe}
}

export default convertHrs