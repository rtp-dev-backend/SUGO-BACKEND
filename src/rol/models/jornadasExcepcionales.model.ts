/**
 * Modelo Sequelize para la tabla 'jornadas_excepcionales'.
 *
 * Representa una jornada excepcional asociada a un rol.
 *
 * Relaciones:
 * - JornadasExcepcionales pertenece a Roles (rol_id)
 *
 * Campos:
 * - id: Identificador único de la jornada
 * - rol_id: FK al rol principal
 * - operador_id: Id del operador
 * - lugar: Lugar de la jornada
 * - hora_inicio, hora_termino: Horarios
 * - dias_servicio: Días de servicio
 * - descansos: Array de descansos
 * - created_at, updated_at: Timestamps
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Roles } from "./roles.model";

export const JornadasExcepcionales = SUGO_sequelize_connection.define('jornadas_excepcionales', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  rol_id: { type: DataTypes.BIGINT, allowNull: false },
  operador: { type: DataTypes.INTEGER, allowNull: true },
  lugar: { type: DataTypes.TEXT, allowNull: true },
  hora_inicio: { type: DataTypes.TIME, allowNull: true },
  hora_termino: { type: DataTypes.TIME, allowNull: true },
  dias_servicio: { type: DataTypes.JSON, allowNull: true },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'jornadas_excepcionales',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

