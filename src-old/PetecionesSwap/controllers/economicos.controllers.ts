
import { Request, Response } from 'express';
import { swaPools } from '../../database/swap.connection';
import { where } from 'sequelize';



const consultas = {
    eco_status: `
        SELECT 
            P.pv_eco as eco, 
            P.pv_modulo as mod, 
            M.mod_desc ,
            P.pv_estatus as estatus 
        FROM pv P 
        inner join modulo M on ( P.pv_modulo = M.mod_clave )
    `,
    kilometraje: `
    SELECT
        vnt_blt,
        klmtj,
        time_eftv as tiempo_efectivo,
        time_mrt as tiempo_muerto,
        mdl_id as modulo,
        fecha ,
        eco,
        oprd as operador,
        tipo_unidad 
    FROM op_tarjeta_pv` ,
}

export const getEcosStatus = async (req: Request, res: Response ) => {
    const { modulo, estado, eco } = req.query 
    
    const filtros = [];
    let myWhere = '';

    if(modulo) filtros.push( `pv_modulo = ${modulo}`)
    if(eco)    filtros.push( `pv_eco = ${eco}`)
    if(estado) filtros.push( `pv_estatus IN (${estado})`)      // 1: Operable, 2: No operable, 3: ???, 8: Baja

    if(filtros.length>0) myWhere = 'WHERE ' + filtros.join(' and ');
    
        
    try {
        const {rows} = await swaPools[0].query(`
        ${consultas.eco_status}
        ${myWhere}
        `)

        res.send( rows )
        // res.send( {count: rows.length, rows} )

    } catch (error) {
        res.json({ error: (error as  Error).message })
    }
}

