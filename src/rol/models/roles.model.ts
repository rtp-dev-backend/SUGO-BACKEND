import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IRoles } from '../interfaces/rol.interfaces';
import { cargasArchivosRol } from './cargasArchivosRol.model';
import { PeriodosRol } from './periodosRol.model';
import { RutaModalidades } from '../../General/models/ruta_modalidades.model';

export interface RolesModelInterface extends IRoles { id: number }

export const Roles = SUGO_sequelize_connection.define<any, RolesModelInterface>(
  'roles', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    archivo: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ruta_modalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modulo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notas: {
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
    dias_impar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dias_par: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: 'roles',
  }
);

Roles.belongsTo(cargasArchivosRol, { foreignKey: 'archivo', targetKey: 'id' });
Roles.belongsTo(PeriodosRol, { foreignKey: 'periodo', targetKey: 'id' });
Roles.belongsTo(RutaModalidades, { foreignKey: 'ruta_modalidad', targetKey: 'id' });
RutaModalidades.hasMany(Roles, { foreignKey: 'ruta_modalidad', sourceKey: 'id' });

