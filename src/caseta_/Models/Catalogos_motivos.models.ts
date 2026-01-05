import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js";
import { Catalogos_motivos } from "../interfaces/motivos.interfaces";

export class Motivos extends Model<Catalogos_motivos> {}

Motivos.init(
  {
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize: SUGO_sequelize_connection,
    tableName: "pv_estados_motivos",
    timestamps: false,
  }
);
