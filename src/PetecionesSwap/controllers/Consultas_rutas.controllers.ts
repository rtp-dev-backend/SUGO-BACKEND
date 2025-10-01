import { Request, Response } from 'express';
import { swaPools } from './../../database/swap.connection';
import sortByProperty from '../../utilities/funcsArrays/sortByProperty';
import deleteDuplicates from '../../utilities/funcsArrays/deleteDuplicates';


const ConsultaRutasSinModulo =`
    SELECT DISTINCT
        R.ruta_cve_sist as ruta_id,
        R.ruta_nombre||COALESCE(R.ruta_trayecto,'') AS nombre,
        MD.servicio_descrip  as modalidad,
        A.punto_nombre AS cc_ori,
        B.punto_nombre AS cc_des,
        A.punto_descrip AS cc_ori_name,
        B.punto_descrip  AS cc_des_name
    FROM op_ruta R
        LEFT JOIN op_ruta_serv MD on (R.ruta_cve_servicio = MD.ruta_cve_servicio)
        INNER JOIN op_ruta_punto A ON (R.ruta_origen_cve=A.punto_cve)
        INNER JOIN op_ruta_punto B ON (R.ruta_destino_cve=B.punto_cve)
`

const ConsultaRutas =`
    SELECT DISTINCT
        R.ruta_cve_sist as ruta_id,
        M.mod_clave as modulo,
        R.ruta_nombre||COALESCE(R.ruta_trayecto,'') AS nombre,
        MD.servicio_descrip  as modalidad,
        A.punto_nombre AS cc_ori,
        B.punto_nombre AS cc_des,
        A.punto_descrip AS cc_ori_name,
        B.punto_descrip  AS cc_des_name
    FROM op_ruta R
        LEFT JOIN op_ruta_serv MD on (R.ruta_cve_servicio = MD.ruta_cve_servicio)
        INNER JOIN modulo M ON (R.mod_clave=M.mod_clave)
        INNER JOIN op_ruta_punto A ON (R.ruta_origen_cve=A.punto_cve)
        INNER JOIN op_ruta_punto B ON (R.ruta_destino_cve=B.punto_cve)
`

const initWhere = `WHERE R.ruta_status = 1 
and M.mod_clave in (1,2,3,4,5,6,7)
`
// and A.punto_nombre NOT LIKE 'M0_'
// and A.punto_nombre NOT LIKE 'M4_'
// and B.punto_nombre NOT LIKE 'M0_'
// and B.punto_nombre NOT LIKE 'M4_'

export const getConsultaRuta = async (req: Request, res: Response) => {
    const { ruta, modulo, modalidad, only_cc, rutaTipo } = req.query

    const numerosExpresion = /\d+/g;
    const letrasExpresion = /[a-zA-Z]+/g;

    const filtros = [];
    let myWhere = initWhere;

    if (ruta) {
        const nombre = (ruta as string).match(numerosExpresion)
        const trayecto = (ruta as string).match(letrasExpresion)

        filtros.push(` R.ruta_nombre = ${nombre[0]}`)
        if (trayecto) filtros.push(`R.ruta_trayecto = '${trayecto[0]}'`)
        else filtros.push('R.ruta_trayecto IS NULL')
    }

    if(modulo) filtros.push(`M.mod_clave = '${modulo}'`)
    if(modalidad) filtros.push(`MD.servicio_descrip = '${modalidad}'`)
    if(!isNaN(rutaTipo as any)) filtros.push(`R.ruta_cve_movi = ${rutaTipo}`);  // ['Ruta', 'Local', 'C.C.', 'Local', 'Escal']


    if (filtros.length > 0) myWhere = `${initWhere} and ${filtros.join(' and ')}`;

    try {
        const { rows } = await swaPools[0].query(`
            ${ConsultaRutas}
            ${myWhere}
        `)
        console.log(ConsultaRutas, myWhere);
        console.log('Rutas encontradas', rows.length);
        res.json(rows);
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
};


const consultaModalidad = `
    SELECT servicio_descrip as name
    FROM op_ruta_serv MD
    WHERE status = 1
    ORDER BY ruta_cve_servicio;
`

export const getModalidades = async (req: Request, res: Response) => {
    try {
        const { rows } = await swaPools[0].query(consultaModalidad)
        console.log(consultaModalidad)
        res.json(rows.map( r => r.name))
    } catch (error) {
        res.json({ error: (error as Error).message })
    }
};


