import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import {Rol_Header} from './Rol_headers.model.js'
import {Rol_Jornada} from './Rol_jornada.model.js'

export interface Cal {
    id:         number,
    id_header:  number,
    op_cred:    number,
    id_jornada: number,
    dia:        Date,
    op_tipo:    number,
    op_estado:  number,
    sistema:    string,
    eco:        number,
    servicio:   number,
}
export const  rol_calendarios = SUGO_sequelize_connection.define<any,Cal>(
'rol_calendarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_header:{
        type: DataTypes.INTEGER,
    },
    dia: {
        type: DataTypes.DATEONLY,  
    },
    servicio: {
        type: DataTypes.STRING,  
        comment: 'Es el numero de salida/corrida en el Rol'
    },
    eco: {
        type: DataTypes.INTEGER,  
    },
    op_cred: {
        type: DataTypes.INTEGER,  
        comment: 'id_vista_del_modulo (credencial del operador)'
    }, 
    id_jornada: {
        type: DataTypes.INTEGER,  
    },
    op_tipo: {
        type: DataTypes.STRING,  
        comment:'Tipo de operador: ordinarios y cubre descansos'

    },
    op_estado: {
        type: DataTypes.STRING,  
        comment: 'Estado del operador: L: laborando o D: descanso, v: vacaciones, i: incapacidad, p: permiso, o: onomastico'
    },
    sistema: {
        type: DataTypes.STRING,  
        comment: 'E/S o T/F'
    },
    },
    {
        timestamps: false,
    }
);


Rol_Header.hasMany(rol_calendarios, {

    foreignKey: 'id_header',
    sourceKey: 'id'
})
rol_calendarios.belongsTo(Rol_Header, {
    foreignKey: 'id_header',
    targetKey: 'id'
})


Rol_Jornada.hasMany(rol_calendarios, {

    foreignKey: 'id_jornada',
    sourceKey: 'id'
})
rol_calendarios.belongsTo(Rol_Jornada, {
    foreignKey: 'id_jornada',
    targetKey: 'id'
})
