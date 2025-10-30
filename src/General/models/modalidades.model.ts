import { DataTypes, Model } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection.js';

export interface IModalidades {
  id: number;
  name?: string;
  categoria?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Modalidades extends Model<IModalidades> {}

Modalidades.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  },
}, {
  sequelize: SUGO_sequelize_connection,
  tableName: 'modalidades_autorizadas',
  timestamps: false,
});


