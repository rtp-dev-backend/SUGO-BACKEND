import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { ModelRolJornada } from "../interfaces/Rol_jordanas.interface.js";



export const Rol_Jornada = SUGO_sequelize_connection.define<any, ModelRolJornada>(
    'rol_jornadas', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    turno: {
        type: DataTypes.INTEGER,
    },
    hr_ini_t: {
        type: DataTypes.TIME,
    },
    lug_ini_cc: {
        type: DataTypes.STRING,
    },
    hr_ini_cc: {
        type: DataTypes.TIME,
    },
    hr_ter_cc: {
        type: DataTypes.TIME,
    },
    lug_ter_cc: {
        type: DataTypes.STRING,
    },
    hr_ter_mod: {
        type: DataTypes.TIME,
    },
    hr_ter_t: {
        type: DataTypes.TIME,
    }
},
    {
        timestamps: false
    },

);