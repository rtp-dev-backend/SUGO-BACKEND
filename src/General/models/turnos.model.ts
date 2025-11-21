import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js";
import { Iturnos } from "../interfaces/turnos.js";

export class Turno extends Model<Iturnos> {}

Turno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notas_descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: SUGO_sequelize_connection,
    tableName: "catalogo_turnos",
    timestamps: false,
  }
);
