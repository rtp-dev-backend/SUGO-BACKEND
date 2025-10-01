import { JornadaSimplificada, RolServicios, Rol_calendario } from "../../interfaces/Rol_calendarios.interface"

const semana = ['', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes'];




/**
 * Helper especifico: Crea el calendario de trabajo de los operadores por servicio contemplando tipo de turno (T/F o E/S)
 * @param rolServicio Rol con id's de jornadas, id de header y si el Turno 1 saca el dia 1 
 * @param dates dias a crear calendario del operador  
 * @returns 
 */
const doCalendars = ( rolServicio: RolServicios, dates: Date[], isCD=false ): Rol_calendario[][] => {
    const { credenciales, ...resto } = rolServicio
    const { cred_turno1, cred_turno2, cred_turno3 } = credenciales
    const creds = { cred_turno1, cred_turno2, cred_turno3 }
    const { servicio, sistema, eco, descansos, lun_vie, sab, dom, id_header, t1SacaDia1, ecosAcubrir } = resto
    
    const calendariosXservicio: Rol_calendario[][] = []

    // Bucle para iterar cada credencial
    for (let index = 0; index < 3; index++) {   //ToDo: Cambiar 3
        const turno = index+1
        const cred = creds[`cred_turno${turno}`];

        if(!cred) continue;
    
        const calendariosXcred: Rol_calendario[] = dates.map( (dia, i) => {
            const isDiaImpar = (i+1)%2==1
    
            const op_tipo: string = isCD ? 'CD' : 'ORD';
            let id_jornada: null|number = null;
            let op_estado: null|string = null;
            let Eco: number = Number(eco)
            
            //& Asignar jornada apropieda segun dia   &   Obtener estado (laboral o descanso)
            let t = turno
            // Si es E/S y es necesario invertir turnos con relevo:
            if( sistema == 'E/S' && ((turno==1 && t1SacaDia1 && isDiaImpar) || (turno==1 && !t1SacaDia1 && !isDiaImpar ) || ( turno==2 && isDiaImpar )) ){
                t = (turno==1) ? 2 : 1;
            }

            if( dia.getDay() == 6 ) {           // Si es Sabado
                const jornada = sab.find( j => j.turno == t );
                if(jornada) id_jornada = jornada.id_jornada; 
                (descansos.sabado == 'D') ? op_estado = 'D' : op_estado = 'L';
                if(isCD && !Eco && ecosAcubrir[0]) Eco = ecosAcubrir[ 5 ];      //  Puede ser porque en el rol empieza en Lunes la semana, entonces el eco del lunes esta en la posicion 0 y el del Domingo en la 6

            } else if( dia.getDay() == 0 ) {    // Si es Domingo
                const jornada = dom.find( j => j.turno == t );
                if(jornada) id_jornada = jornada.id_jornada; 
                (descansos.domingo == 'D') ? op_estado = 'D' : op_estado = 'L';
                if(isCD && !Eco && ecosAcubrir[0]) Eco = ecosAcubrir[ 6 ];      //  Puede ser porque en el rol empieza en Lunes la semana, entonces el eco del lunes esta en la posicion 0 y el del Domingo en la 6

            } else {                            // Si es L-V
                if(!isCD) {                     // Si NO es CD
                    const jornada = (lun_vie as JornadaSimplificada[]).find( j => j.turno == t );
                    if(jornada) id_jornada = jornada.id_jornada;
                    (descansos[ semana[dia.getDay()] ] == 'D') ? op_estado = 'D' : op_estado = 'L';

                } else {                        // Si es CD
                    const diaEntreSemana = (lun_vie as { jornada: JornadaSimplificada[], dia: number}[]).find( j => j.dia == dia.getDay() );
                    if(diaEntreSemana){
                        const jornada = diaEntreSemana.jornada.find( j => j.turno == t );
                        if(jornada) id_jornada = jornada.id_jornada;
                        if(isCD && !Eco && ecosAcubrir[0]) Eco = ecosAcubrir[ dia.getDay()-1 ];     // Ni idea de porque necesite un dia menos. Puede ser porque en el rol empieza en Lunes la semana, entonces el eco del lunes esta en la posicion 0
                    }
                    (descansos[ semana[dia.getDay()] ] == 'D') ? op_estado = 'D' : op_estado = 'L';
                }
            }  
    
            if(!id_jornada) return undefined
            return {
                id_header ,
                eco: Eco,
                op_cred: cred,
                servicio: servicio, 
                dia ,
                sistema,
                id_jornada ,
                op_tipo ,      // 'ORD' | 'CD'
                op_estado      // 'L o D',
            }
        }).filter(Boolean)

        if(calendariosXcred.length>0) calendariosXservicio.push( calendariosXcred )
    }
    
    return calendariosXservicio 
}

export default doCalendars