import { DataTypes, Model } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection.js';
import { Rutas } from './rutas.model';
import { Modalidades } from './modalidades.model';
import { IRutaModalidades } from '../interfaces/ruta_modalidades';

export class RutaModalidades extends Model<IRutaModalidades> {}

RutaModalidades.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ruta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modalidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estatus: {
    type: DataTypes.INTEGER,
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
  tableName: 'ruta_modalidades',
  timestamps: false,
});

// Relación: RutaModalidades pertenece a Rutas
RutaModalidades.belongsTo(Rutas, {
  foreignKey: 'ruta_id',
  targetKey: 'id',
  as: 'ruta',
});

// Relación: RutaModalidades pertenece a Modalidades
RutaModalidades.belongsTo(Modalidades, {
  foreignKey: 'modalidad_id',
  targetKey: 'id',
  as: 'modalidad',
});
