import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { Catalogo_modulos } from "../../General/models/Catalogo_modulos.model.js"

export interface EcoInOut {
    modulo_id:       number
    eco:             number
    op_cred:         number
    turno?:          number
    extintor?:       number
    ruta_swap?:      string
    ruta_modalidad?: string
    ruta_cc?:        string
    modulo_time:     Date
    motivo:          string
    motivo_desc?:    string
    tipo:            number
    estatus?:        number
    eco_tipo?:       number
    cap_time:        Date
    cap_user:        number
    registro_id?:    number
}

export interface EcoInOut_ModelInterface extends EcoInOut { id: number }

export const  eco_entradas_salidas = SUGO_sequelize_connection.define<any,EcoInOut_ModelInterface>(
    'eco_entradas_salidas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        modulo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,        
            }
        },
        eco: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isNumeric: true,
            }
        },
        op_cred: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                isNumeric: true,
            }
        },
        modulo_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        turno: {
            type: DataTypes.INTEGER,
        },
        extintor: {
            type: DataTypes.STRING,
        },
        ruta_swap: {
            type: DataTypes.STRING,
        },
        ruta_modalidad: {
            type: DataTypes.STRING,
        },
        ruta_cc: {
            type: DataTypes.STRING,
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        motivo_desc: {
            type: DataTypes.TEXT,
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '1: despacho, 2: recepcion'
        },
        estatus: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: '1: activo, NULL: eliminado'
        },
        eco_tipo: {
            type: DataTypes.INTEGER,
            comment: '1: planta, 2: postura'
        },
        cap_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        cap_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        registro_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        indexes: [
            {fields: ['modulo_id']},
            {fields: ['ruta_swap']},
            {fields: ['motivo']},
            {fields: ['eco']},
            {fields: ['modulo_time']},
            {fields: ['tipo']},
            {fields: ['estatus']},
        ],
        timestamps: false,

    }
);


Catalogo_modulos.hasMany(eco_entradas_salidas, {
    foreignKey: 'modulo_id',
    sourceKey: 'id'
})
eco_entradas_salidas.belongsTo(Catalogo_modulos, {
    foreignKey: 'modulo_id',
    targetKey: 'id'
})

eco_entradas_salidas.hasMany(eco_entradas_salidas, {
    foreignKey: 'registro_id',
    sourceKey: 'id'
})
eco_entradas_salidas.belongsTo(eco_entradas_salidas, {
    as: 'complemento', 
    foreignKey: 'registro_id',
    targetKey: 'id'
})

// Rol_Jornada.hasMany(rol_calendarios, {

//     foreignKey: 'id_jornada',
//     sourceKey: 'id'
// })
// rol_calendarios.belongsTo(Rol_Jornada, {
//     foreignKey: 'id_jornada',
//     targetKey: 'id'
// })
