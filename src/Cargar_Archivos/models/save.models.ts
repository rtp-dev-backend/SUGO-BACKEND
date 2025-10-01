import { DataTypes, INTEGER } from 'sequelize';
import { SUGO_sequelize_connection } from './../../database/sugo.connection';


interface Modelo {
    id: number,
    nombre: string,

}

export const saveImg = SUGO_sequelize_connection.define<any, Modelo>(
    'save', {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING
    },
   
},
    {
        timestamps: true,
    },
);