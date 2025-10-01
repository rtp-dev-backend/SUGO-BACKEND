import { QueryTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { RolHeader_API_getAll } from "../interfaces/Rol_headers.interface";


interface Props {
    header_id?: number
    periodo?: number,
    modulo?: number,
}
export const rolHeaders_get = async({periodo, modulo, header_id}:Props) => {
    
    const filtros = [];
    let where = '';
    if(header_id)   filtros.push( `H.id = ${header_id}`)
    if(periodo)     filtros.push( `P.id = ${periodo}`)
    if(modulo)      filtros.push( `M.modulo = '${modulo}'`)
    if(filtros.length>0) where = `WHERE ${filtros.join(' AND ')}`;

    try {
        //ToDo: add conteo de operadores y ecos en calendarios 
        const headers = await SUGO_sequelize_connection.query<RolHeader_API_getAll>(`
            SELECT 
                H.id,
                M.id as modulo_id,
                M.modulo as modulo,
                M.descripcion as modulo_desc,
                R.id as ruta_id,
                R.nombre as ruta,
                MA."name" as modalidad,  
                R.swap_ruta,
                P.id as periodo_id,
                P.serial as periodo_serial,
                to_char( P.fecha_inicio , 'yyyy/mm/dd') as periodo_inicio,  
                to_char( P.fecha_fin , 'yyyy/mm/dd') as periodo_fin
            FROM rol_headers H 
            INNER JOIN modulos M ON ( M.id = H.id_modulos )
            INNER JOIN rutas_autorizadas R  ON ( R.id = H.id_rutas )
            INNER JOIN modalidades_autorizadas MA  ON ( MA.id = R.id_autorizada_mod  )
            INNER JOIN periodos P  ON ( P.id = H.id_periodos )
            ${where}
        `, { type: QueryTypes.SELECT })

        const ecosDistintos = await SUGO_sequelize_connection.query<{id_header: number, cantidad_distintos: number}>(`
            SELECT 
                id_header, 
                COUNT(DISTINCT eco) AS cantidad_distintos
            FROM rol_calendarios rc
            GROUP BY id_header;
        `, { type: QueryTypes.SELECT })

        const opDistintos = await SUGO_sequelize_connection.query<{id_header: number, cantidad_distintos: number}>(`            
            SELECT 
                id_header, 
                COUNT(DISTINCT op_cred) AS cantidad_distintos
            FROM rol_calendarios rc
            GROUP BY id_header;
        `, { type: QueryTypes.SELECT })

        const data = headers.map( h => {
            const ecoDis = ecosDistintos.find( obj => obj.id_header == h.id ) 
            const opDis  = opDistintos.find( obj => obj.id_header == h.id ) 

            if( !ecoDis || ! opDis) return { ...h, ecos_distintos: 0, op_distintos: 0 }
            return { ...h, ecos_distintos: Number(ecoDis.cantidad_distintos), op_distintos: Number(opDis.cantidad_distintos) }
        } )

        return data
    } catch (error) {
        throw new Error(error)
    }
}