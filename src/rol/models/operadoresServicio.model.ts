import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IOperadoresServicio } from '../interfaces/rol.interfaces';
import { servicios } from './servicios.model';

export interface OperadoresServicioModelInterface extends IOperadoresServicio { id: number }

export const operadoresServicio = SUGO_sequelize_connection.define<any, OperadoresServicioModelInterface>(
  'operadores_servicio', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    servicio_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    turno: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    operador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descansos: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
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
    tableName: 'operadores_servicio',
    indexes: [
      { fields: ['servicio_id', 'turno'] },
    ],
  }
);

operadoresServicio.belongsTo(servicios, { foreignKey: 'servicio_id', targetKey: 'id' });
servicios.hasMany(operadoresServicio, { foreignKey: 'servicio_id', sourceKey: 'id' });
