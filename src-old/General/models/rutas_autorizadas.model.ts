import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { modalidad_autorizada } from "./modalidad_autorizada.model.js"
import { Cat_Rutas } from "../interfaces/Catalogo_rutas_autorizadas.js";


export const ruta_autorizada = SUGO_sequelize_connection.define<any, Cat_Rutas>(
    'rutas_autorizadas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
        },
        id_autorizada_mod: {
            type: DataTypes.INTEGER,
        },
        swap_ruta: {
            type: DataTypes.STRING,
        },
        origen_destino: {
            type: DataTypes.STRING,
        },
        estatus: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: true,
      }
);
