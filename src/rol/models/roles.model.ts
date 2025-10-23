/**
 * Modelo Sequelize para la tabla 'roles'.
 * Encapsula el encabezado de un rol cargado y sus relaciones.
 * - Relaciona servicios, cubredescansos, jornadas excepcionales y rutas.
 * - Permite obtener toda la información de un rol cargado.
 */
import { DataTypes } from "sequelize";
import { SUGO_sequelize_connection } from "../../database/sugo.connection";
import { CargasArchivosRol } from "./cargasArchivosRol.model";
import { Servicios } from "./servicios.model";
import { Cubredescansos } from "./cubredescansos.model";
import { JornadasExcepcionales } from "./jornadasExcepcionales.model";
import { Rutas } from "../../General/models/rutas.model";

export const Roles = SUGO_sequelize_connection.define('roles', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true }, // ID único
  archivo: { type: DataTypes.BIGINT, allowNull: true }, // FK archivo de carga
  periodo: DataTypes.TEXT, // FK periodo
  ruta: DataTypes.TEXT, // FK ruta
  modulo: DataTypes.INTEGER, // FK módulo
  notas: DataTypes.TEXT, // Observaciones
  dias_impar: DataTypes.TEXT, // Días impar
  dias_par: DataTypes.TEXT,   // Días par
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Relaciones con otros modelos
CargasArchivosRol.hasMany(Roles, { foreignKey: 'archivo', sourceKey: 'id' });
Roles.belongsTo(CargasArchivosRol, { foreignKey: 'archivo', targetKey: 'id' });

Roles.hasMany(Servicios, { foreignKey: 'rol_id', sourceKey: 'id' });
Servicios.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(Cubredescansos, { foreignKey: 'rol_id', sourceKey: 'id' });
Cubredescansos.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.hasMany(JornadasExcepcionales, { foreignKey: 'rol_id', sourceKey: 'id' });
JornadasExcepcionales.belongsTo(Roles, { foreignKey: 'rol_id', targetKey: 'id' });

Roles.belongsTo(Rutas, { foreignKey: 'ruta', targetKey: 'id' }); // Relación con rutas