import { Request, Response } from 'express';
import { swaPools } from '../../database/swap.connection';
import { QueryTypes } from 'sequelize';
import { SGI_sequelize_connection } from '../../database/sgi.connection';

const trab_info = `
    SELECT 
        mod_clave as modulo,
        trab_credencial AS credencial,
        nombre_completo AS nombre,
        tipo_trab_descripcion AS puesto,
        puesto_descripcion AS puesto_desc,
        trab_status AS status,
        trab_status_desc AS status_desc
    FROM trab_view
`


export const getTrabajadores = async ( req: Request, res: Response ) => {
    const { modulo, cred, estado, puesto } = req.query

    const filtros = [];
    let myWhere = '';

    if(modulo) filtros.push( `mod_clave = ${modulo}`)
    if(cred)   filtros.push( `trab_credencial = ${cred}`)
    if(puesto)   filtros.push( `tipo_trab_descripcion = '${puesto}' `)
    if(estado) filtros.push( `trab_status = ${estado}`)

    if(filtros.length>0) myWhere = `WHERE ${filtros.join(' and ')}`;

    try {
        const getAllOperador = await swaPools[0].query(`
            ${trab_info}
            ${myWhere}
        `)
      
        res.json({ count: getAllOperador.rows.length,  data: getAllOperador.rows})
        
    } catch (error) {
        res.json({ error: (error as  Error).message })
    }
}



// put in helpers
const dateToString = (date: Date, invert=false) => {
    // if( typeof date != 'object' ) return date
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    if(invert) return`${year}/${month}/${day}`;
    return `${day}/${month}/${year}`;
};

export const getTrabajadoresConIncapacidad = async( req: Request, res: Response ) => {

    const { fecha, concepto, cred } = req.query

    const f = new Date()

    const fechaNow = fecha 
    || `${f.getFullYear()}/${f.getMonth()}/${f.getMinutes()}` ;
    const fechaMenos1mes = new Date( (fechaNow as string) )
    fechaMenos1mes.setDate( fechaMenos1mes.getDate() -30 )

    console.log('fechas', dateToString(fechaMenos1mes, true), fechaNow);

    const filtros = [];
    let myWhere = '';

    if(concepto) filtros.push( `id_concepto = ${concepto}`)         // 1-6 ( 1:general, 2:mixto, 3:ausencia, 4:justificacion, 5:sancion, 6:incapacidad )
    if(cred)     filtros.push( `id_trabajador = ${cred}`)
    // if(fechaNow)    filtros.push( `('${fechaNow}' <= fecha_final)`)
    if(fechaNow)    filtros.push( `(fecha_inicio >= '${dateToString(fechaMenos1mes, true)}' )`)
    if(fechaNow)    filtros.push( `(fecha_final BETWEEN '${dateToString(fechaMenos1mes, true)}' AND '${fechaNow}' )`)

    if(filtros.length>0) myWhere = `WHERE ${filtros.join(' AND ')}`;

    try {
        const getAll_Incapacidades = await SGI_sequelize_connection.query(`
            SELECT
                -- id,
                id_concepto ,
                id_trabajador as cred,
                unidades as dias,
                usuario_captura ,
                fecha_inicio ,
                fecha_final ,
                create_at
            FROM altas_sga as2
            ${myWhere}    
        `, { type: QueryTypes.SELECT })

        // put in helpers
        const groupByRepeatedValue = (arr, prop='eco') => {
            const result = [];
            let currentGroup = [];
            let currentValue = arr[0][prop];
            
            arr.forEach(item => {
              if (item[prop] == currentValue) {
                currentGroup.push(item);
              } else {
                result.push(currentGroup);
                currentGroup = [item];
                currentValue = item[prop];
              }
            });
            
            result.push(currentGroup);
            return result;
          }
        // put in helpers
        const sortByProperty = (arr, prop) => {
            return arr.slice().sort((a, b) => {
              if (a[prop] < b[prop]) {
                return -1;
              }
              if (a[prop] > b[prop]) {
                return 1;
              }
              return 0;
            });
             
        }

        if( getAll_Incapacidades.length === 0) return res.json({count: getAll_Incapacidades.length, data: getAll_Incapacidades })

        const data = groupByRepeatedValue( sortByProperty(getAll_Incapacidades,'cred') , 'cred').filter( g => g.length > 0+0 )
        const creds = data.map( (g, i) => {
            if(g.length === 0) return
            let dias = 0
            g.forEach( i => dias += i.dias )
            return { cred: g[0].cred, dias, data: data[i]}
        } )
    
        res.json( creds.filter( c => c.dias>=28 ) )
        
    } catch (error) {
        res.json({ error: (error as  Error).message })
    }
}