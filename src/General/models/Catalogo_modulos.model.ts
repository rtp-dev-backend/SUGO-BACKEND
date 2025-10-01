import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"


interface modulos {
    id: number,
    mod_clave: number,
    modulo: string,
    descripcion: string
}

export const Catalogo_modulos = SUGO_sequelize_connection.define<any, modulos>(
    'modulos',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        mod_clave:{
            type: DataTypes.INTEGER
        },
        modulo: {
            type: DataTypes.STRING,

        },
        descripcion: {
            type: DataTypes.STRING
        },
    }

);
