import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"

export interface PVestado {
    eco:            number;
    eco_estatus:    number;
    momento:        Date;
    motivo:         string; 
    motivo_desc:    string;
    lugar_tipo:     number;
    lugar:          string;
    lugar_desc:     string;
    estatus:        number;
    createdAt:      Date;
    createdBy:      number;
    updatedAt:      Date;
    updatedBy:      number;
}

export interface PVestado_ModelInterface extends PVestado { id: number }

export const  pv_estados_old = SUGO_sequelize_connection.define<any,PVestado_ModelInterface>(
    'pv_estados_old', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        eco: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        momento: {
            type: DataTypes.DATE,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isDate: true,
            }
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                notEmpty: true
            }
        },
        motivo_desc: {
            type: DataTypes.STRING,
        },
        lugar_tipo: {
            type: DataTypes.INTEGER,
        },
        lugar: {
            type: DataTypes.STRING,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
            }
        },
        lugar_desc: {
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
            comment: '[eliminado, activo, inactivo]'
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        // timestamps: true,       // Es igual a createdAt: true, updatedAt: true
        createdAt: true, 
        updatedAt: false,
        indexes: [
            {fields: ['eco_estatus']},
            {fields: ['eco']},
            {fields: ['motivo']},
            {fields: ['lugar']},
            {fields: ['estatus']},
        ],
    }
);


// Catalogo_modulos.hasMany(eco_entradas_salidas, {
//     foreignKey: 'modulo_id',
//     sourceKey: 'id'
// })
// eco_entradas_salidas.belongsTo(Catalogo_modulos, {
//     foreignKey: 'modulo_id',
//     targetKey: 'id'
// })
