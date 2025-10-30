import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { ICubredescansos } from '../interfaces/rol.interfaces';
import { Roles } from './roles.model';

export interface CubredescansosModelInterface extends ICubredescansos { id: number }

export const cubredescansos = SUGO_sequelize_connection.define<any, CubredescansosModelInterface>(
  'cubredescansos', {
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
      allowNull: true,
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
    tableName: 'cubredescansos',
    indexes: [
      { fields: ['rol_id'] },
    ],
  }
);

cubredescansos.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });
Roles.hasMany(cubredescansos, { foreignKey: 'rol_id', sourceKey: 'id' });
