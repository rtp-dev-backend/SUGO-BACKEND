import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { pv_estados_motivos } from "./pv_estados_motivos.model.js";
import { pv_ecos_modalidades } from "./pv_ecos_modalidades.model.js";

export interface PVestados {
    // id
    momento:         Date;
    tipo:            number;
    eco:             number;
    eco_estatus:     number;
    eco_tipo?:       number;
    motivo_id:       number;
    motivo_desc?:    string;
    modulo?:         number;
    direccion?:      string;
    ruta?:           string;
    ruta_modalidad?: string;
    ruta_cc?:        string;
    op_cred?:        number;
    op_turno?:       number;
    extintor?:       string;
    estatus:         number;
    createdAt?:      Date;
    createdBy:       number;
    createdBy_modulo: number;
    modulo_puerta:   string;
    updatedAt?:      Date;
    updatedBy?:      number;
    prev_values?:    string;
    registro_id?:    number;
}

export interface PVestados_ModelInterface extends PVestados { id: number }

export const  pv_estados = SUGO_sequelize_connection.define<any,PVestados_ModelInterface>(
    'pv_estados', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        momento: {
            type: DataTypes.DATE,
            comment:'Momento en que sucedio segun modulo',
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isDate: true,
            }
        },
        tipo: {
            type: DataTypes.INTEGER,
            comment: '[despacho, recepcion, actualización](1)',
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        eco: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        eco_estatus: {
            type: DataTypes.INTEGER,
            comment: '[Baja, Disponible, NO disponible]',
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,        
            }
        },
        eco_tipo: {
            type: DataTypes.INTEGER,
            comment: '[planta, postura](1)',
            validate: {                 // Valida con JS
                // notNull: true,
                isNumeric: true,
            }
        },
        motivo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                notEmpty: true
            }
        },
        motivo_desc: {
            type: DataTypes.STRING,
        },
        modulo: {
            type: DataTypes.INTEGER,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        ruta: {
            type: DataTypes.STRING,
        },
        ruta_modalidad: {
            type: DataTypes.STRING,
        },
        ruta_cc: {
            type: DataTypes.STRING,
        },
        op_cred: {
            type: DataTypes.INTEGER,
        },
        op_turno: {
            type: DataTypes.INTEGER,
        },
        extintor: {
            type: DataTypes.STRING,
        },
        estatus: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            },
            defaultValue: 1,
            comment: 'Del registro [eliminado, activo, inactivo]'
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        createdBy_modulo: {
            type: DataTypes.INTEGER,
        },
        modulo_puerta: {
            type: DataTypes.STRING,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        prev_values: {
            type: DataTypes.JSON,
        },
        registro_id: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: true,       // Es igual a createdAt: true, updatedAt: true
        indexes: [
            {fields: ['tipo']},
            {fields: ['eco']},
            {fields: ['eco_estatus']},
            {fields: ['modulo']},
            {fields: ['direccion']},
            {fields: ['ruta']},
            {fields: ['ruta_modalidad']},
            {fields: ['estatus']},
            {fields: ['createdBy_modulo']},
        ],
    }
);


pv_estados_motivos.hasMany(pv_estados, {
    foreignKey: 'motivo_id',
    sourceKey: 'id'
})
pv_estados.belongsTo(pv_estados_motivos, {
    foreignKey: 'motivo_id',
    targetKey: 'id'
})


pv_estados.hasMany(pv_estados, {
    foreignKey: 'registro_id',
    sourceKey: 'id'
})
pv_estados.belongsTo(pv_estados, {
    as: 'complemento', 
    foreignKey: 'registro_id',
    targetKey: 'id'
})


pv_ecos_modalidades.hasMany(pv_estados, {
    foreignKey: 'eco',
    sourceKey: 'eco'
})
pv_estados.belongsTo(pv_ecos_modalidades, {
    as: 'eco_modalidad',
    foreignKey: 'eco',
    targetKey: 'eco'
})