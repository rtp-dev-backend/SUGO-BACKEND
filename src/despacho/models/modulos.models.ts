import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Catalogo_modulos } from "../interfaces/modulos.interfaces";

export class Modulos extends Model<Catalogo_modulos> {}

Modulos.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulo: {
      type: DataTypes.STRING,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    mod_clave: {
      type: DataTypes.INTEGER,
    },
  },

  {
    sequelize: SUGO_sequelize_connection,
    tableName: "modulos",
    timestamps: false,
  },
);
