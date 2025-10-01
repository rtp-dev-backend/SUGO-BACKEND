import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"

export interface PVecosXmodalidad {
    // id
    eco:        number;
    modalidad:  string;
    estatus:        number;
    created_at:        number;
    created_by:        number;
    autorizado_by:        number;
}

export interface PVecosXmodalidad_ModelInterface extends PVecosXmodalidad { id: number, logs: string }

export const  pv_ecos_modalidades = SUGO_sequelize_connection.define<any,PVecosXmodalidad_ModelInterface>(
    'pv_ecos_modalidades', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        eco: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        modalidad: {
            type: DataTypes.STRING,
            // allowNull: false,           // DB constrain
            // validate: {                 // Valida con JS
            //     notNull: true,
            // }
        },
        estatus: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        autorizado_by: {
            type: DataTypes.INTEGER,
            allowNull: false,           // DB constrain
            validate: {                 // Valida con JS
                notNull: true,
                isNumeric: true,
            }
        },
        logs: {
            type: DataTypes.JSON
        },
    },
    {
        timestamps: false,       // Es igual a createdAt: true, updatedAt: true
    }
);