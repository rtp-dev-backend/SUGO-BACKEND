import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IHorarios } from '../interfaces/rol.interfaces';
import { servicios } from './servicios.model';
import { operadoresServicio } from './operadoresServicio.model';

export interface HorariosModelInterface extends IHorarios { id: number }

export const horarios = SUGO_sequelize_connection.define<any, HorariosModelInterface>(
  'horarios', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    servicio_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    dias_servicios: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    turno: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_inicio_cc: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    lugar_inicio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hora_termino: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_termino_cc: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    termino_modulo: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    lugar_termino_cc: {
      type: DataTypes.TEXT,
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
    servicio_operador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'horarios',
    indexes: [
      { fields: ['servicio_id', 'dias_servicios', 'turno'] },
    ],
  }
);

servicios.hasMany(horarios, { foreignKey: 'servicio_id', sourceKey: 'id' });
horarios.belongsTo(servicios, { foreignKey: 'servicio_id', targetKey: 'id' });
operadoresServicio.hasMany(horarios, { foreignKey: 'servicio_operador_id', sourceKey: 'id' });
horarios.belongsTo(operadoresServicio, { foreignKey: 'servicio_operador_id', targetKey: 'id' });
