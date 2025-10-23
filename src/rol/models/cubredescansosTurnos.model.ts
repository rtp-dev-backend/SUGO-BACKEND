/**
 * Modelo CubredescansosTurnos
 *
 * Relaciones Sequelize:
 * - CubredescansosTurnos pertenece a la tabla Cubredescansos:
 *     CubredescansosTurnos.belongsTo(Cubredescansos, { foreignKey: 'cubredescanso_id', targetKey: 'id' })
 *     Cubredescansos.hasMany(CubredescansosTurnos, { foreignKey: 'cubredescanso_id', sourceKey: 'id' })
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { Cubredescansos } from "./cubredescansos.model";

export const CubredescansosTurnos = SUGO_sequelize_connection.define('cubredescansos_turnos', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  cubredescanso_id: { type: DataTypes.BIGINT, allowNull: false },
  turno: DataTypes.SMALLINT,
  operador: { type: DataTypes.INTEGER, allowNull: true },
  servicios_a_cubrir: { type: DataTypes.JSON, allowNull: true },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'cubredescansos_turnos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Cubredescansos.hasMany(CubredescansosTurnos, { foreignKey: 'cubredescanso_id', sourceKey: 'id' });
CubredescansosTurnos.belongsTo(Cubredescansos, { foreignKey: 'cubredescanso_id', targetKey: 'id' });