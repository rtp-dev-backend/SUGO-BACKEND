import { C2, JoE, Jornadas, Rol_calendario } from "../../interfaces/Rol_calendarios.interface"
import FindOrCreate_jornadas from "../../services/FoC_jornadas"


const joinCalendarsAndApplyJoE = async(joe: JoE[], rol: Rol_calendario[], cd: Rol_calendario[], transaction) => {
    const calendar: Rol_calendario[] = [ ...rol, ...cd ]

    if( joe.length == 0 ) return calendar

    const promises = joe.map( async(serv) => {
        const { cred, descansos, hr_ini_t, hr_ter_t, lugIni1 } = serv;
        const { lunes, martes, miercoles,  viernes,jueves, sabado, domingo } = descansos;
        const dias = [ domingo, lunes, martes, miercoles, jueves, viernes, sabado ];

        // Del calendario buscar indices y obj por cred y dia  
        const calendarMod: (C2|null)[] = calendar.map( (cal, index) => {
            if(cal.op_cred == cred && !!dias[(cal.dia as Date).getDay()] ) return {...cal, index}
            return null
        } ).filter(Boolean);

        if( calendarMod.length == 0 ) throw new Error( `La cred ${cred} no se encuentra en un servicio del rol o no tiene jornadas asignadas` );
        
        // FindOrCreate Jornada nueva a asignar
        const jornada = [{
            turno:      null,
            hr_ini_t:   hr_ini_t,
            hr_ter_t:   hr_ter_t,
            hr_ini_cc:  null,
            hr_ter_cc:  null,
            lug_ini_cc: lugIni1,
            lug_ter_cc: null,
            hr_ter_mod: null,
        }];

        const [id] = await FindOrCreate_jornadas( jornada as unknown as Jornadas[], { transaction } );

        // De cada indice modifica el obj
        (calendarMod as C2[]).forEach( obj => {
            const PoD = dias[(obj.dia as Date).getDay()]
            const { id_jornada, index, op_estado: oe, ...resto } = obj;
            if( PoD == 'P' ){
                calendar[index] = { 
                    id_jornada: id.id_jornada,
                    op_estado: 'L' ,
                    ...resto
                };
            } else if( PoD == 'D' ){
                calendar[index] = { 
                    id_jornada ,
                    op_estado: 'D' ,
                    ...resto
                };
            }
        });
    });

    await Promise.all(promises); // Esperar a que todas las operaciones asíncronas se completen
    return calendar
}

export default joinCalendarsAndApplyJoE