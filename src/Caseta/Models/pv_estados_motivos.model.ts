import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"

export interface PVestados {
    // id
    desc:               string;
    tipo:               number;
    eco_disponible:     boolean;
    estatus:            number;
    createdBy:          number;
    updatedBy:          number;
    prev_values:        string;
}

export interface PVestadosModalidades_ModelInterface extends PVestados { id: number }

export const  pv_estados_motivos = SUGO_sequelize_connection.define<any,PVestadosModalidades_ModelInterface>(
    'pv_estados_motivos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
            }
        },
        tipo: {
            type: DataTypes.INTEGER,
            comment: '[fuera, dentro](1) de modulo',
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        eco_disponible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
            }
        },
        estatus: {
            type: DataTypes.INTEGER
        },
        createdBy: {
            type: DataTypes.INTEGER
        },
        updatedBy: {
            type: DataTypes.INTEGER
        },
        prev_values: {
            type: DataTypes.JSON
        },
    },
    {
        timestamps: true,       // Es igual a createdAt: true, updatedAt: true
    }
);