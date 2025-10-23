import { DataTypes, Model } from 'sequelize';
import { SUGO_sequelize_connection } from "../../database/sugo.connection.js"
import { IRutas } from '../interfaces/rutas';

export class Rutas extends Model<IRutas> {}

Rutas.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ruta: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  origen: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  origen_nomenclatura: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  destino: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  destino_nomenclatura: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  estatus: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: SUGO_sequelize_connection,
  tableName: 'rutas',
  timestamps: false,
});
