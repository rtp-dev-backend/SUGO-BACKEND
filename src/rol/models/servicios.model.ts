/**
 * Modelo Sequelize para la tabla 'servicios'.
 *
 * Representa un servicio asociado a un rol.
 *
 * Relaciones:
 * - Servicios pertenece a Roles (rol_id)
 * - Servicios tiene muchos OperadoresServicio (servicio_id)
 *
 * Campos:
 * - id: Identificador único del servicio
 * - rol_id: FK al rol principal
 * - economico: Número económico del vehículo
 * - sistema: Identificador del sistema
 * - created_at, updated_at: Timestamps
 */
import { OperadoresServicio } from "./operadoresServicio.model";
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Roles } from "./roles.model";

export const Servicios = SUGO_sequelize_connection.define('servicios', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  rol_id: { type: DataTypes.BIGINT, allowNull: false },
  economico: DataTypes.INTEGER,
  sistema: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'servicios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

