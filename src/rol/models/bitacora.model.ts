import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';

export const Bitacora = SUGO_sequelize_connection.define('bitacora', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  tabla: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  accion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  datos_old: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  datos_new: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'bitacora',
  timestamps: false,
});
