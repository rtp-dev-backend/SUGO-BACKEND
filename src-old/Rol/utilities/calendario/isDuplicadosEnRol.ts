import groupByRepeatedValue from "../../../utilities/funcsArrays/groupByRepeatedValue";
import { dateToString } from "../../../utilities/funcsDates/funcs";
import { Rol_calendario } from "../../interfaces/Rol_calendarios.interface";

/**
 * Determina si los operadors tienen varias jornadas en 1 dia
 * @param rol Rol de operadores "ordinarios" o "cubre descansos"
 */
const isDuplicadosEnRol = ( rol: Rol_calendario[] ) => {
    const datosDuplicados_soloCopias = rol.filter( (obj1, index, self) => 
        index !== self.findIndex( (obj2) => ( dateToString(obj1.dia) === dateToString(obj2.dia) && obj1.op_cred === obj2.op_cred )
    ));

    if( datosDuplicados_soloCopias.length != 0 ){
        const datosDuplicados_creds = datosDuplicados_soloCopias.filter( (item, index, self) => 
            index === self.findIndex( (obj) => obj.op_cred === item.op_cred )
        );

        return datosDuplicados_creds.map( obj => obj.op_cred)
    } else {
        console.log('No hay duplicados');
        return false
    }
}

export default isDuplicadosEnRol