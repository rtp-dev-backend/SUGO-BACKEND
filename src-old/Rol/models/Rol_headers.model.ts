import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import {Catalogo_modulos} from '../../General/models/Catalogo_modulos.model.js'
import {Catalogo_peridos} from '../../General/models/Catalogo_periodo.model.js'
import {ruta_autorizada} from '../../General/models/rutas_autorizadas.model.js'
import { ModelRolHeader } from "../interfaces/Rol_headers.interface.js"


export const Rol_Header = SUGO_sequelize_connection.define<any, ModelRolHeader>(
    'rol_headers', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_modulos: {
        type: DataTypes.INTEGER,
    },
    id_periodos: {
        type: DataTypes.INTEGER,
    },
    id_rutas: {
        type: DataTypes.INTEGER,
    },
   
},
    {
        timestamps: false
      },
    
);

Catalogo_modulos.hasMany(Rol_Header, {

    foreignKey: 'id_modulos',
    sourceKey: 'id'
})

Rol_Header.belongsTo(Catalogo_modulos, {
    foreignKey: 'id_modulos',
    targetKey: 'id'
})

Catalogo_peridos.hasMany(Rol_Header, {

    foreignKey: 'id_periodos',
    sourceKey: 'id'
})

Rol_Header.belongsTo(Catalogo_peridos, {
    foreignKey: 'id_periodos',
    targetKey: 'id'
})


ruta_autorizada.hasMany(Rol_Header, {

    foreignKey: 'id_rutas',
    sourceKey: 'id'
})

Rol_Header.belongsTo(ruta_autorizada, {
    foreignKey: 'id_rutas',
    targetKey: 'id'
})

