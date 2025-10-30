import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { ICargasArchivosRol } from '../interfaces/rol.interfaces';

export interface CargasArchivosRolModelInterface extends ICargasArchivosRol { id: number }

export const cargasArchivosRol = SUGO_sequelize_connection.define<any, CargasArchivosRolModelInterface>(
  'cargas_archivos_rol', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_archivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subido_por: {
      type: DataTypes.INTEGER,
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
    tableName: 'cargas_archivos_rol',
    timestamps: false,
  }
);
