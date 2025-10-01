import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { ruta_autorizada } from './rutas_autorizadas.model.js'


interface autorizada1 {
    id: number,
    categoria: string,
    name: string
}

export const modalidad_autorizada = SUGO_sequelize_connection.define<any, autorizada1>(
    'modalidades_autorizadas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoria: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);

modalidad_autorizada.hasMany(ruta_autorizada, {
    foreignKey: 'id_autorizada_mod',
    sourceKey: 'id'
})

ruta_autorizada.belongsTo(modalidad_autorizada, {
    foreignKey: 'id_autorizada_mod',
    targetKey: 'id'
})



