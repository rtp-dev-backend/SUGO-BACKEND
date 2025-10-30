import { DataTypes } from 'sequelize';
import { SUGO_sequelize_connection } from '../../database/sugo.connection';
import { IJornadasExcepcionales } from '../interfaces/rol.interfaces';
import { Roles } from './roles.model';

export interface JornadasExcepcionalesModelInterface extends IJornadasExcepcionales { id: number }

export const jornadasExcepcionales = SUGO_sequelize_connection.define<any, JornadasExcepcionalesModelInterface>(
	'jornadas_excepcionales', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		rol_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		operador: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		lugar: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		hora_inicio: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		hora_termino: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		dias_servicio: {
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
		tableName: 'jornadas_excepcionales',
		indexes: [
			{ fields: ['rol_id'] },
			{ fields: ['operador'] },
		],
	}
);

Roles.hasMany(jornadasExcepcionales, { foreignKey: 'rol_id', sourceKey: 'id' });
jornadasExcepcionales.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });
Roles.hasMany(jornadasExcepcionales, { foreignKey: 'rol_id', sourceKey: 'id' });
jornadasExcepcionales.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

