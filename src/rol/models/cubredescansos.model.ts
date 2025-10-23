/**
 * Modelo Sequelize para la tabla 'cubredescansos'.
 *
 * Representa un cubredescanso asociado a un rol.
 *
 * Relaciones:
 * - Cubredescansos pertenece a Roles (rol_id)
 *
 * Campos:
 * - id: Identificador único del cubredescanso
 * - rol_id: FK al rol principal
 * - economico: Número económico del vehículo
 * - sistema: Identificador del sistema
 * - created_at, updated_at: Timestamps
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Roles } from "./roles.model";

export const Cubredescansos = SUGO_sequelize_connection.define('cubredescansos', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  rol_id: { type: DataTypes.BIGINT, allowNull: false },
  economico: DataTypes.INTEGER,
  sistema: DataTypes.TEXT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'cubredescansos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

