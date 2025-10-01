
import FindOrCreate_jornadas from "../../services/FoC_jornadas";
import doCalendars from "./doCalendars";
import joinCalendarsAndApplyJoE from "./applyJoE";
import convertHrs from "./convertHrsOfRol";
import isDuplicadosEnRol from "./isDuplicadosEnRol";
import { getDatesBetween } from "../../../utilities/funcsDates/funcs";
import { DataRol, JornadaSimplificada, Modulo, RolModificado, Rol_calendario } from "../../interfaces/Rol_calendarios.interface";

import { Rol_Header } from "../../models/Rol_headers.model";
import { Cal, rol_calendarios } from "../../models/rol_calendarios.model";
import { Model, Transaction } from "sequelize";
import { ModelRolHeader } from "../../interfaces/Rol_headers.interface";
import { Catalogo_peridos } from "../../../General/models/Catalogo_periodo.model";
import { Cat_Periodos } from "../../../General/interfaces/Catalogo_periodos";
import { Catalogo_modulos } from "../../../General/models/Catalogo_modulos.model";


// const modulo:Modulo = '1'


/**
 * FUNCION PRINCIPAL para recibir data e insertar en las tablas necesarias la data de los calendarios
 * @param data del excel con todos los roles
 */
const getCalendars = async(data: DataRol[], modulo: number|string, transaction: Transaction) => {
    try {
        const { id: modulo_id } = await Catalogo_modulos.findOne({ where: { modulo } })
        //& Iterar cada hoja
        const calendariosXhojasPromises = data.map( async({ hoja, data }): Promise<{ hoja: string, rol: Rol_calendario[][][], cd: Rol_calendario[][][], calendar: Rol_calendario[]}> => {
            // Si o si hay header y rol, puede que no CD o JoE
            const { header, notas, rol: rolPre, cd, joe: joePre } = data
            const {rol, joe} = convertHrs(rolPre, joePre)
            const { periodo_id, ruta_id } = header
            
                //& Find or Create header
                const rol_header = { 
                    id_modulos:     modulo_id,             // De donde lo tomo ???
                    id_periodos:    periodo_id,
                    id_rutas:       ruta_id,
                }
                const [ headerFinded, isCreated ]: [ModelRolHeader, boolean] = await Rol_Header.findOrCreate({ where: rol_header, transaction });
                const { id:id_header } = headerFinded

                //& Obtener dias del periodo para realizar calendario
                const { fecha_inicio, fecha_fin }:Cat_Periodos = await Catalogo_peridos.findByPk( headerFinded.id_periodos )
                const dateIni = (fecha_inicio as unknown as string).split('-').join('/') 
                const dateFin = (fecha_fin as unknown as string).split('-').join('/')
                const rangeDates: Date[] = getDatesBetween( new Date(dateIni), new Date(dateFin) )

                //& Find or Create jornadas & Ajustar Rol con id's de las jornadas
                const rolConJornadasIDsPromises = rol.map( async(servicio, i) => {
                    const { lun_vie, sab, dom, ...rest } = servicio
                    const ids_lv  = await FindOrCreate_jornadas( lun_vie, { transaction } )
                    const ids_sab = await FindOrCreate_jornadas( sab, { transaction } )
                    const ids_dom = await FindOrCreate_jornadas( dom, { transaction } )

                    return {...rest, lun_vie: ids_lv, sab: ids_sab, dom: ids_dom }
                } )
                const rolConIDs = await Promise.all(rolConJornadasIDsPromises)


                //& Crear calendarios de operadores "ordinarios" con header_id y jornadas_id
                const calendarios_rolOrd = rolConIDs.map( (servicio) => {
                    const calendarioXservicio = doCalendars( {...servicio, id_header, t1SacaDia1: notas.sacanDiasParesT1}, rangeDates )
                    return calendarioXservicio
                } ).filter( cal => cal.some( c => c.length>0 ))


                //& Ajustar calendarios de "CD" segun el servicio que cubren 
                const cdMod: (RolModificado|any)[] = cd.map( c => {
                    const { servicio, descansos, eco } = c
                    const { lunes, martes, miercoles, jueves, viernes, sabado, domingo } = descansos
                    const cubrirServicios = [ domingo, lunes, martes, miercoles, jueves, viernes, sabado ]

                    const ecosAcubrir: number[] = []
                    const lun_vie: { jornada: JornadaSimplificada[], dia: number}[] = []
                    const sab:     JornadaSimplificada[] = []
                    const dom:     JornadaSimplificada[] = []

                    cubrirServicios.map( (numServ, dia) => {
                        if(!Number(numServ)) return
                        
                        if( dia == 0 ){             // Domingo
                            const servOrd = rolConIDs.find( r => r.servicio == numServ )
                            if( servOrd && servOrd.dom ) dom.push( ...servOrd.dom )
                            if( servOrd ) ecosAcubrir.push( Number(servOrd.eco) )
                            else throw new Error(`Faltan jornadas de domingo para los cubredescansos del servicio ${servicio} de la hoja ${hoja}`)
                        } else if( dia == 6) {      // Sabado
                            const servOrd = rolConIDs.find( r => r.servicio == numServ )
                            if( servOrd && servOrd.sab ) sab.push( ...servOrd.sab )
                            if( servOrd ) ecosAcubrir.push( Number(servOrd.eco) )
                            else throw new Error(`Faltan jornadas de sabado para los cubredescansos del servicio ${servicio} de la hoja ${hoja}`)
                        } else {                    // L-V
                            const servOrd = rolConIDs.find( s => s.servicio == numServ )
                            if( servOrd && servOrd.lun_vie ) lun_vie.push({ jornada: (servOrd.lun_vie as JornadaSimplificada[]), dia })
                            if( servOrd ) ecosAcubrir.push( Number(servOrd.eco) )
                            else throw new Error(`Faltan jornadas de lunes a viernes para los cubredescansos del servicio ${servicio} de la hoja ${hoja}`)
                        }
                    } )

                    return { ...c, eco: Number(eco) ? Number(eco):null, lun_vie, sab, dom, ecosAcubrir }
                } )


                //& Crear calendarios de operadores "cubre-descansos" con header_id y jornadas_id   
                const calendarios_CD = cdMod.map( (servicio, i) => {
                    const calendarioXservicio = doCalendars( {...servicio, id_header, t1SacaDia1: notas.sacanDiasParesT1}, rangeDates, true )
                    return calendarioXservicio
                } ).filter( cal => cal.some( c => c.length>0 ))


                //& Considerar JoE
                const cal = await joinCalendarsAndApplyJoE( joe, calendarios_rolOrd.flat(20), calendarios_CD.flat(20), transaction )


                return { hoja, rol: calendarios_rolOrd, cd: calendarios_CD, calendar: cal }     
        } )

        //& resolver promesas
        const calendariosXhojas = await Promise.all(calendariosXhojasPromises)
    
        //& Calendarios de operadores del Rol-ordinarios
        const calendarios_rol : Rol_calendario[] = calendariosXhojas.map( ({rol}) => rol ).flat(20)
        const calendarios_cd  : Rol_calendario[] = calendariosXhojas.map( ({cd}) => cd ).flat(20)
        const calendarios_All : Rol_calendario[] = calendariosXhojas.map( ({calendar}) => calendar ).flat(20)

        // const errorInRol= isDuplicadosEnRol(calendarios_rol)
        // const errorInCD = isDuplicadosEnRol(calendarios_cd)
        const errorInAll= isDuplicadosEnRol(calendarios_All)
        
        if( errorInAll  ) {
            const errores = calendarios_All.filter( c => errorInAll.includes(c.op_cred) )
            //? Cuales y en donde??
            throw ({message: `Existen operadores con mas de 1 jornada por dia: ${errorInAll.join(', ')}`, desc: errores})
        }
    
        //& Bulk create calendars de operadores
        const calendarios = await rol_calendarios.bulkCreate( calendarios_All as any, { transaction } );

        return calendarios
        
    } catch (error) {
        throw ({message: `Error en getCalendars: ${error.message}`, desc: error.desc})
    }
    
}


export default getCalendars