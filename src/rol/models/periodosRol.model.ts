/**
 * Modelo Sequelize para la tabla 'periodos_rol'.
 *
 * Representa un periodo de rol (rango de fechas y serial).
 *
 * Campos:
 * - id: Identificador único del periodo
 * - fecha_inicio: Fecha de inicio del periodo
 * - fecha_fin: Fecha de fin del periodo
 * - periodo: Serial por año (número de periodo dentro del año)
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";

export const PeriodosRol = SUGO_sequelize_connection.define('periodos_rol', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
  periodo: { type: DataTypes.INTEGER, allowNull: true }, // Serial por año
}, {
  tableName: 'periodos_rol',
  timestamps: false,
});