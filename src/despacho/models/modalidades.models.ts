import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Catalogos_modalidad } from "../interfaces/modalidades.interfaces";

export class Modalidades extends Model<Catalogos_modalidad> {}

Modalidades.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    categoria: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: SUGO_sequelize_connection,
    tableName: "modalidades_autorizadas",
    timestamps: false,
  },
);
