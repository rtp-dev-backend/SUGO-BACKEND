// import { TarjetaData } from "../../Cumplimiento/interfaces/getCumplimiento.interfaces";
// import { swaPools } from "../../database/swap.connection";


// interface Opt { cred: number }

// /**
//  * Peticion a SWAP de todas las tarjetas de los operadores del modulo en un rango de fechas X (½'s vueltas)
//  * @param modulo 1-7
//  * @param fechaIni yyyy-mm-dd | yyyy/mm/dd
//  * @param fechaFin yyyy-mm-dd | yyyy/mm/dd
//  */
// export const getTjtOpData = async(modulo: number, fechaIni: string, fechaFin: string, opt?: Opt ): Promise<TarjetaData[]> => {

//     const searchCred = (opt?.cred) ? `AND T.tarjeta_op = ${opt.cred}`: '';

//     try {
//         const {rows} = await swaPools[modulo].query(`
//             SELECT
//                 TD.tarjetad_cve as id,
//                 TD.tarjeta_cve as tjt_gnrl_id,
//                 to_char(T.tarjeta_fecha,'YYYY-MM-DD') AS fecha,
//                 T.tarjeta_eco AS eco,
//                 T.tarjeta_op AS op_cred,
//                     T.tarjeta_turno as turno,
//                     to_char(T.tarjeta_hr_ini_pst,'HH24:MI:SS') AS hr_ini_t,
//                     to_char(T.tarjeta_hr_tmn_jnd,'HH24:MI:SS') AS hr_fin_t,
//                     to_char(T.tarjeta_hr_almt_ini,'HH24:MI:SS') AS hr_almt1,
//                     to_char(T.tarjeta_hr_almt_fin,'HH24:MI:SS') AS hr_almt2,
//                 RT.ruta_nombre||COALESCE(RT.ruta_trayecto,'') AS ruta,
//                 to_char(TD.tarjetad_salhr,'HH24:MI:SS') AS hr_sld,
//                 to_char(TD.tarjetad_lleghr,'HH24:MI:SS') AS hr_llgd,
//                 CC1.punto_nombre AS cc_sld,
//                 CC1.punto_descrip AS cc_sld_name,
//                 CC2.punto_nombre AS cc_llg,
//                 CC2.punto_descrip AS cc_llg_name,
//                 TD.tarjetad_bserie AS bltj_sr,
//                 TD.tarjetad_bnum AS bltj_nmr
//             FROM op_tarjeta_det TD
//             INNER JOIN op_tarjeta T ON (TD.tarjeta_cve=T.tarjeta_cve)
//             INNER JOIN op_ruta_punto CC1 ON (TD.tarjetad_sallug=CC1.punto_cve)
//             INNER JOIN op_ruta_punto CC2 ON (TD.tarjetad_lleglug=CC2.punto_cve)
//             INNER JOIN op_ruta RT ON (TD.tarjetad_ruta=RT.ruta_cve_sist)
//             WHERE
//                 (TD.mod_clave=$1) AND
//                 (T.mod_clave =$1) AND
//                 (RT.mod_clave=$1) AND 
//                 (T.tarjeta_fecha BETWEEN $2 AND $3) ${searchCred}
//             ORDER BY
//             T.tarjeta_fecha,
//             T.tarjeta_eco,
//             T.tarjeta_hr_ini_pst,
//             TD.tarjetad_salhr;
//         `,[modulo, fechaIni, fechaFin]);
        
//         return rows        
//     } catch (error) {
//         throw new Error(`Error en getTjtOpData ${error}`)
//     }
// }
