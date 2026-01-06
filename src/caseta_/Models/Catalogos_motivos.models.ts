import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Catalogos_motivos } from "../interfaces/motivos.interfaces";

export class Motivos extends Model<Catalogos_motivos> {}

Motivos.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eco_disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prev_values: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize: SUGO_sequelize_connection,
    tableName: "pv_estados_motivos",
    timestamps: false,
  }
);
