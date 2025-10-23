/**
 * Modelo Horarios
 *
 * Relaciones Sequelize:
 * - Horarios pertenece a la tabla Servicios:
 *     Horarios.belongsTo(Servicios, { foreignKey: 'servicio_id', targetKey: 'id' })
 *     Servicios.hasMany(Horarios, { foreignKey: 'servicio_id', sourceKey: 'id' })
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Servicios } from "./servicios.model";

export const Horarios = SUGO_sequelize_connection.define('horarios', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  servicio_id: { type: DataTypes.BIGINT, allowNull: false },
  servicio_operador_id: { type: DataTypes.BIGINT, allowNull: false }, // Relación con operadores_servicio
  dias_servicios: DataTypes.TEXT,
  turno: DataTypes.SMALLINT,
  hora_inicio: DataTypes.TIME,
  hora_inicio_cc: DataTypes.TIME,
  lugar_inicio: DataTypes.TEXT,
  hora_termino: DataTypes.TIME,
  hora_termino_cc: DataTypes.TIME,
  termino_modulo: DataTypes.TIME,
  lugar_termino_cc: DataTypes.TEXT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'horarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Servicios.hasMany(Horarios, { foreignKey: 'servicio_id', sourceKey: 'id' });
Horarios.belongsTo(Servicios, { foreignKey: 'servicio_id', targetKey: 'id' });