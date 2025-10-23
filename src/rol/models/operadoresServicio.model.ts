/**
 * Modelo Sequelize para la tabla 'operadores_servicio'.
 *
 * Representa un operador asignado a un servicio.
 *
 * Relaciones:
 * - OperadoresServicio pertenece a Servicios (servicio_id)
 *
 * Campos:
 * - id: Identificador único del operador-servicio
 * - servicio_id: FK al servicio
 * - turno: Turno asignado
 * - operador_id: Id del operador
 * - descansos: Array de descansos
 * - created_at, updated_at: Timestamps
 */
import { Servicios } from "./servicios.model";
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";

export const OperadoresServicio = SUGO_sequelize_connection.define('operadores_servicio', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  servicio_id: { type: DataTypes.BIGINT, allowNull: false },
  turno: DataTypes.SMALLINT,
  operador: DataTypes.INTEGER,
  descansos: DataTypes.ARRAY(DataTypes.TEXT),
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'operadores_servicio',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

