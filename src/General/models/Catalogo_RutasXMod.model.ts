import { DataTypes } from "sequelize"
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { ruta_autorizada } from "./rutas_autorizadas.model.js";
import { Catalogo_modulos } from "./Catalogo_modulos.model.js";

interface RutaXMod  {
    id: number,
    id_modulo: number,
    id_ruta: number,


}

export const Catalogo_RutaXMod = SUGO_sequelize_connection.define<any, RutaXMod>(
'Catalogo_rutaxmod',
{

id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
id_modulo: {
    type: DataTypes.INTEGER,
},
id_ruta:{
    type: DataTypes.INTEGER,
}
}
);

Catalogo_modulos.hasMany(Catalogo_RutaXMod, {

    foreignKey: 'id_modulo',
    sourceKey: 'id'
})
Catalogo_RutaXMod.belongsTo(Catalogo_modulos, {
    foreignKey: 'id_modulo',
    targetKey: 'id'
})


ruta_autorizada.hasMany(Catalogo_RutaXMod, {

    foreignKey: 'id_ruta',
    sourceKey: 'id'
})

Catalogo_RutaXMod.belongsTo(ruta_autorizada, {
    foreignKey: 'id_ruta',
    targetKey: 'id'
})
