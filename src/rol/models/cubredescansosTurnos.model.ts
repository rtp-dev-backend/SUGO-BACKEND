import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { ICubredescansosTurnos } from '../interfaces/rol.interfaces';
import { cubredescansos } from './cubredescansos.model';

export interface CubredescansosTurnosModelInterface extends ICubredescansosTurnos { id: number }

export const cubredescansosTurnos = SUGO_sequelize_connection.define<any, CubredescansosTurnosModelInterface>(
  'cubredescansos_turnos', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    cubredescanso_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    turno: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    operador: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    servicios_a_cubrir: {
      type: DataTypes.JSON,
      allowNull: true,
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
    tableName: 'cubredescansos_turnos',
    indexes: [
      { fields: ['cubredescanso_id', 'turno'] },
      { fields: ['operador'] },
    ],
  }
);

cubredescansosTurnos.belongsTo(cubredescansos, { foreignKey: 'cubredescanso_id', targetKey: 'id' });
cubredescansos.hasMany(cubredescansosTurnos, { foreignKey: 'cubredescanso_id', sourceKey: 'id' });
