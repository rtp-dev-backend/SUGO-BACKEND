import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IServicios } from '../interfaces/rol.interfaces';
import { Roles } from './roles.model';

export interface ServiciosModelInterface extends IServicios { id: number }

export const servicios = SUGO_sequelize_connection.define<any, ServiciosModelInterface>(
  'servicios', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    economico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sistema: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'servicios',
    indexes: [
      { fields: ['rol_id', 'economico'] },
      { fields: ['economico'] },
    ],
  }
);

servicios.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });
Roles.hasMany(servicios, { foreignKey: 'rol_id', sourceKey: 'id' });
