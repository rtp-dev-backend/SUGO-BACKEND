import { DataTypes, INTEGER } from 'sequelize';
import { SUGO_sequelize_connection } from './../../database/sugo.connection';
import { Rol_Header } from './Rol_headers.model';


interface Modelo {
    id: number,
    path:string,
    nombre: string,
    usuario:string|number,


}

export const rol_archivos = SUGO_sequelize_connection.define<any, Modelo>(
    'rol_archivo', {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    path: {
        type: DataTypes.STRING,
    },
    nombre: {
        type: DataTypes.STRING
    },
    usuario: {
        type: DataTypes.STRING,
        comment: "Se usara la credencial para identificar al usuario"
    },
   
},
    {
        timestamps: true,
    },
);
Rol_Header.belongsToMany(rol_archivos, {
    through: 'rol_headers_files'
})


rol_archivos.belongsToMany(Rol_Header, {
    through: 'rol_headers_files'
})
