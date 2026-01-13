import { DataTypes, Model } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js";
import { Ipv_estados } from "../interfaces/pv_estados.js";

export class Pv_estados extends Model<Ipv_estados> {}

Pv_estados.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    momento: {
      type: DataTypes.STRING,
    },
    tipo: {
      type: DataTypes.INTEGER,
    },
    eco: {
      type: DataTypes.INTEGER,
    },
    eco_estatus: {
      type: DataTypes.INTEGER,
    },
    eco_tipo: {
      type: DataTypes.INTEGER,
    },
    motivo_id: {
      type: DataTypes.INTEGER,
    },
    motivo_desc: {
      type: DataTypes.STRING,
    },
    modulo: {
      type: DataTypes.INTEGER,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    ruta: {
      type: DataTypes.STRING,
    },
    ruta_modalidad: {
      type: DataTypes.STRING,
    },
    ruta_cc: {
      type: DataTypes.STRING,
    },
    op_cred: {
      type: DataTypes.INTEGER,
    },
    op_turno: {
      type: DataTypes.INTEGER,
    },
    extintor: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: SUGO_sequelize_connection,
    tableName: "pv_estados",
    timestamps: false,
  }
);
