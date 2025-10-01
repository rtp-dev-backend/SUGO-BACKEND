import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"


interface periodo2 {
    id: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    hora: Date,
    serial: number,
}

export const Periodo_prueba = SUGO_sequelize_connection.define<any, periodo2>(
    'periodo_prueba',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha_inicio: {
            type: DataTypes.DATE,


        },
        fecha_fin: {
            type: DataTypes.DATEONLY,

        },
        hora: {
            type: DataTypes.TIME
        },
        serial: {

            type: DataTypes.INTEGER,

        },
    },
    {
        timestamps: true,
    }

);