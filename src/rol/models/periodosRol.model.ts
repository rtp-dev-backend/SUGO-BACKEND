import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IPeriodosRol } from '../interfaces/rol.interfaces';

export interface PeriodosRolModelInterface extends IPeriodosRol { id: number }

export const PeriodosRol = SUGO_sequelize_connection.define<any, PeriodosRolModelInterface>(
  'periodos_rol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: 'periodos_rol',
  }
);
